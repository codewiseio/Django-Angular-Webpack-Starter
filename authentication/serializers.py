from django.contrib.auth import update_session_auth_hash

from rest_framework import serializers

from django.contrib.auth import get_user_model

from .models import UserManager

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        User = get_user_model()
        model = User
        fields = ('id', 'email', 'password', 'confirm_password')

    def create(self, validated_data):

        User = get_user_model()
        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        # create the instance
        instance = User(email=validated_data['email'])

        # set the password
        instance = self.set_password(instance, password, confirm_password)

        # save
        instance.save()            

        return instance

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)

        # set the password
        instance = self.set_password(instance, password, confirm_password)

        # save
        instance.save()  

        update_session_auth_hash(self.context.get('request'), instance)

        return instance

    def set_password(self, instance, password, confirm_password):
        # if confirm password supplied
        if confirm_password:

            # test that password and confirmation match
            if password and confirm_password and password == confirm_password:
                instance.set_password(password)

            # password/confirmation do not match
            else:
                raise ValueError('Passwords do not match.')

        # if no password confirmation, just save the password
        elif password:
            instance.set_password(password)

        return instance
        
