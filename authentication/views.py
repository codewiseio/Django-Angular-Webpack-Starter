from rest_framework import permissions,status,views,viewsets
from rest_framework.response import Response
from rest_framework import generics

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
User = get_user_model()

from authentication.permissions import IsAccountOwner
from authentication.serializers import UserSerializer
from django.shortcuts import render

from django.db import transaction

import json

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
                login(request, user)
                return Response( UserSerializer(user).data );

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
    
    