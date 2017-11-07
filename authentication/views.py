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
from .settings import AUTHENTICATION


class UserViewSet(viewsets.ModelViewSet):
    """ Viewset that provides CRUD operations for user accounts
    
    Extends:
        viewsets.ModelViewSet

    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """ Set permission restrictions """

        # allow not lgged in users to access safe methods
        if self.request.method in permissions.SAFE_METHODS:
            return(permissions.AllowAny(),)
        
        # allow not logged in users to create accounts
        if self.request.method == 'POST':
            return(permissions.AllowAny(),)
        
        # required user to be logged in and account owner
        return(permissions.IsAuthenticated(), IsAccountOwner(),)
    

    def create(self,request):    
        """ Perform account registration
            
        Accepts an email address and password as post data and creates a new user account.
        Sends an email to the user to activate the account before permitting login.
        """


        
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

        # create the user
        data = request.data.copy()

        # set default user status
        data['status'] = 0 if AUTHENTICATION['REQUIRE_ACTIVATION'] else 1
        serializer = self.serializer_class(data=data)

        # validate supplied data
        if serializer.is_valid():
            
            # create the user account
            instance =  serializer.save()

            # if account requires activation
            if AUTHENTICATION['REQUIRE_ACTIVATION']:
                # create and send the activation link
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



    def partial_update(self, request, pk=None):
        """ Update user data. Ensure password is encrypted. """

        # confirm current password to commit credential changes
        if request.data.get('current_password') and not request.data.get('current_password') == "":
            user = User.objects.get(pk=pk)
            
            # authenticate the password
            auth = authenticate(email=user.email, password=request.data.get('current_password'))

        # throw error if current password not given
        else:
            return Response({
                'status': 'Password required',
                'message': 'Current password required.'
            }, status=status.HTTP_401_UNAUTHORIZED)


        # if a password was supplied
        if request.data.get('password') and not request.data.get('password') == "":

            if auth:
                # encrypt the password
                user.set_password( request.data.get('password') )
                # remove the password from the request data 
                request.data.pop('password');
            else:
                return Response({
                    'status': 'Invalid password',
                    'message': 'Current password required.'
                }, status=status.HTTP_401_UNAUTHORIZED)     


        # perform update
        serializer = self.get_serializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save();
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)


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


class AuthenticationView(views.APIView):
    """ Handles authentication (logging in and out)
    """

    def post(self, request, format=None):
        """ Sign in to a user account .

        Returns a response with an authentication token
        """
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
                user.last_login = timezone.now()
                user.save()

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


    def delete(self, request, *args, **kwargs):
        """ Destroy a users authentication token, effectively signing out.
        """

        # If a user is signed in
        if request.user.is_authenticated():
            # sign out
            logout(request)
            return Response({}, status=status.HTTP_204_NO_CONTENT) 
        
        # otherwise respond with bad request
        else:
            # Do something for anonymous users.
            return Response({
                'status': 'Bad request',
                'message': 'There is no authenticated user to sign out.'
            }, status=status.HTTP_400_BAD_REQUEST)  


    def patch(self,request,*args,**kwargs):
        """ Activate a user account
        """

        key = request.data.get('key')
        if key == None:
            return Response({
                    'status': 'fail',
                    'message': 'Could not activate account',
                },  status=status.HTTP_400_BAD_REQUEST);

        # perform key lookup
        results = UserActivation.objects.filter(key=key).all()

        # no activation key found in database
        if len(results) == 0:
            return Response({
                    'status': 'fail',
                    'message': 'Could not activate account',
                },  status=status.HTTP_400_BAD_REQUEST);

        # user has been banned
        elif results[0] and results[0].user.status < 0:
            return Response({
                    'status': 'fail',
                    'message': 'This account has been disabled.',
                },  status=status.HTTP_400_BAD_REQUEST);              

        # found activation key, but user is already activated
        elif results[0] and results[0].activated:
            return Response({
                    'status': 'fail',
                    'message': 'This account has already been activated.',
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
    
    Will send a password eset link if no other request has been issued in the 
    past X minutes. Password reset links are only valid for the number of minutes
    specified in the configuration file. Defaults to 30.

    Extends:
        views.APIView    
    """
    @transaction.atomic
    def post(self,request,*args, **kwargs):
        """ Create a new reset password request. 

        Generates a new unique key which can be used to reset a users password. Sends
        an email containing a password reset link to the specified user.
        """

        # get key from uri
        email = request.data.get('email')

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

        # if user has been disabled, throw an error
        if user.status == User.DISABLED:
            return Response({
                    'status': 'fail',
                    'message': 'This account has been disabled.',
                },  status=status.HTTP_404_BAD_REQUEST);
        
        # check if there is another password reset request sent in the past 30 minutes
        # TODO: Allow minutes to be configured via settings module
        time_threshold = timezone.now() - timedelta(minutes=AUTHENTICATION.get('RESET_PASSWORD_EXPIRES'))
        results = ResetPasswordRequest.objects.filter(user=user,status=ResetPasswordRequest.ENABLED, created__gt=time_threshold).order_by('-id')
                
        # if active request, use the same request link
        if len(results) > 0:
            instance = results[0]

        # if no active request, create a new request link
        else:
            instance = ResetPasswordRequest.objects.create(user=user)

        # create password reset instance
        self.dispatch_email(instance, request)

        return Response({
                'status': 'succes',
                'message': 'A link to reset your password has been sent to this email address.',
            },  status=status.HTTP_200_OK); 




    def get(self,request,*args, **kwargs):
        """ Check a reset password request for valididy and expiration
        """

        # get key from uri
        key = self.kwargs.get('key')

        # check key for validity
        response = self.validate_key(key)

        # if received Response, invalid key
        if isinstance(response, Response):
            # return the response
            return response
        # otherwise, confirm password reset link is valid
        else:
            return Response({
                    'status': 'ok'
                }, status=status.HTTP_200_OK);


    @transaction.atomic
    def patch(self,request,*args, **kwargs):
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

        # check key for validity
        response = self.validate_key(key)

        # if received Response, invalid key
        if isinstance(response, Response):
            # return the response
            return response
        # otherwise, we have a ResetPasswordRequest
        else:
            instance = response

        # return error if user did not supply a password
        if request.data.get('password', None) == None or request.data.get('password') == "":
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


    def validate_key(self,key):
        """ Check a key for validity.

        Checks that key exists, has not been disabled, and is not expired.

        Returns:
            Response object for invalid keys
            ResetPasswordRequest for valid keys
        """

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
        if instance.status == ResetPasswordRequest.USED:
            return Response({
                    'status': 'fail',
                    'message': 'This link has expired.'
                }, status=status.HTTP_410_GONE);

        elif instance.status == ResetPasswordRequest.DISABLED:
            return Response({
                    'status': 'used',
                    'message': 'This link has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED);

        # return error if link has expired
        elif instance.created < timezone.now() - timedelta(minutes=AUTHENTICATION.get('RESET_PASSWORD_EXPIRES')):
            return Response({
                    'status': 'fail',
                    'message': 'This link has expired.'
                }, status=status.HTTP_410_GONE);

        # check that user is not disabled
        elif instance.user.status == User.DISABLED:
            return Response({
                    'status': 'fail',
                    'message': 'This account has been disabled.',
                },  status=status.HTTP_401_UNAUTHORIZED);

        else:
            return instance

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

class ValidateEmailView(views.APIView):
    """ Determine if an email is already registered with a user account."""


    def get(self,request):

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
