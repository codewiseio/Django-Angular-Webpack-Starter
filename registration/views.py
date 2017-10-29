import string
import random

from rest_framework import status, generics, views
from rest_framework.response import Response

from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site

User = get_user_model()
from authentication.models import UserManager, UserActivation
from authentication.serializers import UserSerializer




class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def create(self,request):
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

        print(request.data)
        
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


class CheckEmailView(views.APIView):
    """ Determine if an email is already registered with a user account."""
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
