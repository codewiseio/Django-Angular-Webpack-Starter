from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient
import json
from django.utils import timezone
from datetime import timedelta

# Create your tests here.
from .models import User, UserActivation, ResetPasswordRequest

class UserTestCase(TestCase):
    def setUp(self):
       user = User(email="codewiseio@gmail.com")
       user.set_password("password")
       user.save()


    def test_user_account(self):
        """User account is created and retrieved."""
        user = User.objects.get(email="codewiseio@gmail.com")
        self.assertEqual(user.email, 'codewiseio@gmail.com')

    def test_account_activation(self):
    	user = User.objects.get(email="codewiseio@gmail.com")
    	instance = UserActivation.objects.create(user=user)
    	self.assertTrue(instance.key, "Created activation key")

    def test_password_reset(self):
      user = User.objects.get(email="codewiseio@gmail.com")
      instance = ResetPasswordRequest.objects.create(user=user)
      self.assertTrue(instance.key, "Created activation key")      



class APITestCase(TestCase):

  def setup(self):
    self.client =  APIClient()


  def test_user_registration(self):
    # register user
    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 201, "Created new user")
    
    # get user, verify that user is not active
    user = User.objects.get(email="testing@example.com")
    self.assertEqual(user.status, 0, "New user is inactive")

    # attempt to login with credentials (should fail because user is inactive)
    response = self.client.post('/api/v1/authentication/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 401, "Could not login to inactive account")

    # check if activation link created
    activation =  UserActivation.objects.get(user_id=user.id)
    self.assertTrue(activation, "User activation key generated")
    self.assertTrue(not activation.activated, "Activation has not been used");

    # follow activation link
    response = self.client.patch('/api/v1/authentication/', json.dumps({'key':activation.key}), content_type='application/json')
    self.assertEqual(response.status_code, 200, "User has been activated")

    # check if activation link is used
    activation =  UserActivation.objects.get(key=activation.key)
    self.assertTrue(activation.activated, "Activation key has been used");

    # check if user is now active
    user = User.objects.get(email="testing@example.com")
    self.assertEqual(user.status, 1, "User is now active")

    # attempt to login with credentials (should pass because account has been activated)
    response = self.client.post('/api/v1/authentication/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 200, "Sign in successful")
    self.assertEqual(response.data.get('email'), "testing@example.com")
    self.assertTrue(response.data.get('token'), "Received authentication token.")

    # logout
    response = self.client.delete('/api/v1/authentication/')
    self.assertEqual(response.status_code, 204, "Sign out successful")

  def test_authenticate_disabled_account_error(self):
    # register user
    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 201, "Created new user")

    # disable user
    user = User.objects.get(email="testing@example.com")
    user.status = -1;
    user.save();

    user = User.objects.get(email="testing@example.com")
    self.assertEqual(user.status, -1, "New user is disabled")

    # check if activation link created
    activation =  UserActivation.objects.get(user_id=user.id)
    self.assertTrue(activation, "User activation key generated")
    self.assertTrue(not activation.activated, "Activation has not been used");

    # follow activation link (expect an error)
    response = self.client.patch('/api/v1/authentication/', json.dumps({'key':activation.key}), content_type='application/json')
    self.assertEqual(response.status_code, 400, "Can not activate disabled user")

  def test_register_duplicate_email_error(self):
    # register user
    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 201, "Created new user")

    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 409, "Could not register duplicate account")

  def test_password_reset(self):
    # register user
    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 201, "Created new user")    

    # activate user
    user = User.objects.get(email="testing@example.com")
    user.status = 1;
    user.save()

    # create password reset request
    response = self.client.post('/api/v1/authentication/password/', {'email': 'testing@example.com', 'reset': True})
    self.assertEqual(response.status_code, 200, "Reset password request created")

    # check for existence of database entry
    instance = ResetPasswordRequest.objects.filter(user=user).order_by('-id')[0]
    self.assertTrue(instance, "Reset password request object exists")

    # try creating another password reset and verify that they have the same key
    response = self.client.post('/api/v1/authentication/password/', {'email': 'testing@example.com', 'reset': True})
    duplicate = ResetPasswordRequest.objects.filter(user=user).order_by('-id')[0]
    self.assertEqual(instance.key, duplicate.key, "Used the same password reset request")   

    # update the original reset request to be over an hour old
    duplicate = None
    time_threshold = timezone.now() - timedelta(minutes=60)
    instance.created = time_threshold
    instance.save()

    # create another password reset and verify that they have different keys
    response = self.client.post('/api/v1/authentication/password/', {'email': 'testing@example.com', 'reset': True})
    duplicate = ResetPasswordRequest.objects.filter(user=user).order_by('-id')[0]
    self.assertTrue(not instance.key == duplicate.key, "Created new password reset request") 

    # reset the password using the expired link (should fail)
    response = self.client.patch('/api/v1/authentication/password/{}/'.format(instance.key), json.dumps({'password': 'newpass'}), content_type='application/json')
    self.assertEqual(response.status_code, 410, "Do not reset password on expired link")

    # reset the password using the new link (should pass)
    response = self.client.patch('/api/v1/authentication/password/{}/'.format(duplicate.key), json.dumps({'password': 'newpass'}), content_type='application/json')
    self.assertEqual(response.status_code, 200, "Reset password on valid link")

    # reset the password using the new link again (should fail)  
    response = self.client.patch('/api/v1/authentication/password/{}/'.format(duplicate.key), json.dumps({'password': 'newpass'}), content_type='application/json')
    self.assertEqual(response.status_code, 410, "Do not reset on used link")

    # create a new password reset request, validate that it is a unique key
    used = duplicate

    # create another password reset and verify that they have different keys
    response = self.client.post('/api/v1/authentication/password/', {'email': 'testing@example.com', 'reset': True})
    another = ResetPasswordRequest.objects.filter(user=user).order_by('-id')[0]
    self.assertTrue(not used.key == another.key, "Created new password reset request") 

    # submit the change request with no password (should fail)
    response = self.client.patch('/api/v1/authentication/password/{}/'.format(another.key), json.dumps({'password': ''}), content_type='application/json')
    self.assertEqual(response.status_code, 400, "No password supplied error")

  def test_validate_email(self):

    # check if email is available ( yes available )
    response = self.client.get('/api/v1/users/?email=testing@example.com')
    self.assertEqual(len(response.data), 0, "No conflict")

    # register user
    response = self.client.post('/api/v1/users/', {'email': 'testing@example.com', 'password':'testing'})
    self.assertEqual(response.status_code, 201, "Created new user")    
  
    # check if email is available ( no, in use )
    response = self.client.get('/api/v1/users/?email=testing@example.com')
    self.assertEqual(len(response.data), 1, "Conflict")