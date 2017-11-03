from rest_framework import permissions,status,views,viewsets
from rest_framework.response import Response
from rest_framework import generics

from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.db import transaction
from rest_framework_jwt.settings import api_settings
User = get_user_model()



from django.utils import timezone
from datetime import timedelta

from .permissions import IsAccountOwner
from .serializers import UserSerializer
from .models import UserActivation, ResetPasswordRequest






# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    lookup_field = 'email'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return(permissions.AllowAny(),)
        
        if self.request.method == 'POST':
            return(permissions.AllowAny(),)
        
        return(permissions.IsAuthenticated(), IsAccountOwner(),)
    
    def create(self,request):
        """ Create a new user """
        serializer = self.serializer_class(data=request.data)
        
        # check for existing account with given email
        duplicate = User.objects.get(email=request.data.get('email'))
        if duplicate:
            return Response({
                'status': 'Conflict',
                'message': 'This email is already in use.',
                'message-token': 'conflict-email'
            }, status=status.HTTP_409_CONFLICT)
        
        # validate supplied data
        if serializer.is_valid():
            
            # create account
            User.objects.create_user(**serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        
        # data not valid, return bad request response
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """ Update user data. Ensure password is encrypted. """

        # if a password was supplied
        if request.data.get('password') :
            user = User.objects.get(pk=kwargs['pk'])
            # encrypt the password
            user.set_password( request.data.get('password') )
            # remove the password from the request data 
            request.data.pop('password');

        # perform update
        serializer = self.get_serializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save();
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    def post(self, request, format=None):
        
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)

        # authenticate the user
        user = authenticate(email=email, password=password)

        # user authenticated successfully
        if user is not None:

            # if user is active
            if user.is_active:

                # login
                login(request, user)

                # create an authentication token
                jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
                
                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)

                # create the response
                response = UserSerializer(user).data
                response['token'] = token
                   
                return Response( response, status=status.HTTP_200_OK );

            # if user is not active
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This user has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)

        # could not authenticate user
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Email/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


            
    
class LogoutView(views.APIView):
    # permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, format=None):
        print('Logout')
        logout(request)
        
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    
    

class RegisterView(views.APIView):
    """ Register a new user
    
    Accepts an email address and password as post data and creates a new user account.
    Sends an email to the user to activate the account before permitting login.
    
    Extends:
        generics.CreateAPIView
    
    Variables:
        serializer_class (class): Serializer to transform data
    """
    serializer_class = UserSerializer
    
    def post(self,request):
        """ Perform account registration
            
        Accepts an email address and password as post data and creates a new user account.
        Sends an email to the user to activate the account before permitting login.
        """

        """ Create a new user """
        serializer = self.serializer_class(data=request.data)
        
        # check for existing account with given email
        try:
            duplicate = User.objects.get(email=request.data.get('email'))
            if duplicate:
                return Response({
                    'status': 'Conflict',
                    'message': 'This email is already in use.',
                    'message-token': 'conflict-email'
                }, status=status.HTTP_409_CONFLICT)
        except:
            pass

        # validate supplied data
        if serializer.is_valid():
            
            # create the user account
            instance =  serializer.save()
            self.dispatch_activation_email(instance,request)

            # remove password data from response
            response = serializer.validated_data
            response.pop('password', None)
            response.pop('confirm_password', None)

            return Response(response, status=status.HTTP_201_CREATED)
        
        else:
            # data not valid, return bad request response
            return Response({
                'status': 'Bad request',
                'message': 'Account could not be created with received data.'
            }, status=status.HTTP_400_BAD_REQUEST)



    def dispatch_activation_email(self, user, request):
        """ Send the activation email to the user when the database record is created.

        Creates a new "UserActivation" record in the database which contains a unique
        key. An email is then sent to the user with a link containing the key. Following
        this link will set the user account to active.

        Args:
            user (object): The user to send the activation link
        """

        # create the activation record
        activation = UserActivation.objects.create(user_id=user.id)

        # create the link
        current_site = get_current_site(request)
        link = 'http://{}/activate/{}'.format(current_site.domain, activation.key)

        # dispatch the email
        send_mail(
            'Activate your account at {}'.format(current_site.name),
            'Please activate your account by following this link \n\n{}\n\n-'.format(link),
            'test@example.com',
            [user.email],
            fail_silently=False
        )


class ActivateUserView(views.APIView):
    """ Activate a new account
    
    After registering, new accounts are sent an activation link via email.
    This view handles validation of these links and sets new accounts to 
    active.

    Allows GET requests with a 'key' parameter.

    Status:
        200: Account activated
        400: Could not activate account with given key
        409: Account is already active
    
    Extends:
        views.APIView    
    """
    @transaction.atomic
    def get(self,request,*args, **kwargs):

        # get key from uri
        key = self.kwargs.get('key')

        # perform key lookup
        results = UserActivation.objects.filter(key=key).all()

        # no activation key found in database
        if len(results) == 0:
            return Response({
                    'status': 'fail',
                    'message': 'Could not activate account',
                },  status=status.HTTP_400_BAD_REQUEST);
        # found activation key, but user is already activated
        elif results[0] and results[0].activated:
            return Response({
                    'status': 'fail',
                    'message': 'This account has already been activated with this link.',
                },  status=status.HTTP_409_CONFLICT);   
        # found activation key, activate account
        else:
            activation = results[0]
            activation.activated = timezone.now()
            activation.save()

            activation.user.status = 1;
            activation.user.save();
            return Response({
                    'status': 'succes',
                    'message': 'This account is now active.',
                },  status=status.HTTP_200_OK); 

    

class ResetPasswordRequestView(views.APIView):
    """ Send a password reset link to a user via email
    
    The view takes a user email address as a paramter. Will send a password
    reset link if no other request has been issued in the past 15 minutes.
    Invalidates any other outstanding password reset requests. Password reset
    links are only valid for 30 minutes.

    Requests:
        GET

    Parameters:
        email (string): Email address of registered user

    Status:
        200: Password reset link sent
        404: User does not exist
        409: Already requested a password reset link in the past 15 minutes

    
    Extends:
        views.APIView    
    """
    @transaction.atomic
    def get(self,request,*args, **kwargs):

        # get key from uri
        email = request.GET.get('email')

        # find user with given email
        user = User.objects.filter(email=email).all()

        # user does not exist, return 404
        if len(user) == 0:
            return Response({
                    'status': 'fail',
                    'message': 'No account registered with this email address.',
                },  status=status.HTTP_404_NOT_FOUND);

        # user does exist
        else:
            user = user[0]

        # create password reset instance
        instance = ResetPasswordRequest.objects.create(user=user)
        self.dispatch_email(instance, request)

        return Response({
                'status': 'succes',
                'message': 'Password reset email dispatched.',
            },  status=status.HTTP_200_OK); 




    def dispatch_email(self, instance, request):
        """ Send an email to the user containing a link to reset their password.

        Args:
            instance (object): The ResetPasswordRequest instance
            request (object): The request object
        """

        # create the link
        current_site = get_current_site(request)
        link = 'http://{}/reset-password/{}'.format(current_site.domain, instance.key)

        # dispatch the email
        send_mail(
            'Password Reset',
            'Reset your password by following this link \n\n{}\n\n-'.format(link),
            'test@example.com',
            [instance.user.email],
            fail_silently=False
            )




class ResetPasswordView(views.APIView):
    """ Perform a password reset
    
    Modify a user's password after they have followed the password reset link
    sent to their email address. Verification is done using the unique code
    included in the uri.

    Requests:
        POST


    Extends:
        views.APIView    
    """

    def get(self,request,*args, **kwargs):

        # get key from uri
        key = self.kwargs.get('key')

        # get user from password reset items
        try:
            instance = ResetPasswordRequest.objects.get(key=key)
        except:
            # return 404 if no matching reset request
            return Response({
                    'status': 'fail',
                    'message': 'This link is not valid.'
                }, status=status.HTTP_404_NOT_FOUND);

        # return error if link has been used already or is disabled
        if instance.status == ResetPasswordRequest.USED or instance.status == ResetPasswordRequest.DISABLED:

            return Response({
                    'status': 'used',
                    'message': 'This link is no longer valid.'
                }, status=status.HTTP_401_UNAUTHORIZED);

        # confirm password reset link is valid
        else:
            return Response({
                    'status': 'ok'
                }, status=status.HTTP_200_OK);


    @transaction.atomic
    def post(self,request,*args, **kwargs):
        """Peform the password reset.
        
        Decorators:
            transaction.atomic
        
        Request Data:
            password (string): Email address of registered user

        Status:
            200: Success
            400: No password provided
            401: Link is no longer valid or has been used
            404: Reset code not found   
        """

        # get key from uri
        key = self.kwargs.get('key')

        # get user from password reset items
        try:
            instance = ResetPasswordRequest.objects.get(key=key)
        except:
            # return 404 if no matching reset request
            return Response({
                    'status': 'fail',
                    'message': 'This link is not valid.'
                }, status=status.HTTP_404_NOT_FOUND);

        # return error if link has been used already or is disabled
        if instance.status == ResetPasswordRequest.USED or instance.status == ResetPasswordRequest.DISABLED:

            return Response({
                    'status': 'used',
                    'message': 'This link is no longer valid.'
                }, status=status.HTTP_401_UNAUTHORIZED);

        # return error if user did not supply a password
        elif request.data.get('password', None) == None:
            return Response({
                    'status': 'fail',
                    'message': 'No password set.'
                }, status=status.HTTP_400_BAD_REQUEST);
 

        # set the password
        user = instance.user
        user.set_password(request.data.get('password'))
        user.save()

        instance.used = timezone.now()
        instance.status = ResetPasswordRequest.USED
        instance.save()


        return Response({
                'status': 'success',
                'message': 'Password has been changed.'
            }, status=status.HTTP_200_OK);










class ValidateEmailView(views.APIView):
    """ Determine if an email is already registered with a user account."""


    def get(self,request):
        print('Check email view.')
        print (request.GET)

        email = request.GET.get('email')
        userid = request.GET.get('userid')

        # check for existing account with given email
        duplicates = User.objects.filter(email=email)

        # exclude the account already registered with this email
        if userid:
            duplicates = duplicates.exclude(id=userid)

        results = duplicates.all()
        if len(results) > 0:
            return Response({
                'status': 'conflict',
                'valid': False,
                'message': 'This email is already in use.',
                'message-token': 'conflict-email'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'Valid',
                'valid': True
            }, status=status.HTTP_200_OK)
