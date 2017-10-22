from rest_framework import status, generics
from rest_framework.response import Response

from django.contrib.auth import get_user_model
User = get_user_model()
from authentication.serializers import UserSerializer

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    
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