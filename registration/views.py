from rest_framework import status, generics, views
from rest_framework.response import Response

from django.contrib.auth import get_user_model
User = get_user_model()
from authentication.models import UserManager
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
            instance =  serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        
        # data not valid, return bad request response
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

class CheckEmailView(views.APIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self,request):
        print('Check email view.')
        print (request.GET)

        email = request.GET.get('email')
        userid = request.GET.get('userid')

        # check for existing account with given email
        try:
            duplicate = User.objects.get(email=email)
            if duplicate:
                return Response({
                    'status': 'conflict',
                    'valid': False,
                    'message': 'This email is already in use.',
                    'message-token': 'conflict-email'
                }, status=status.HTTP_200_OK)
        except:
                return Response({
                    'status': 'Valid',
                    'valid': True
                }, status=status.HTTP_200_OK)
