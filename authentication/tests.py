from django.test import TestCase

# Create your tests here.
from .models import User, UserActivation

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
    	activation = UserActivation.objects.create(user=user)
    	self.assertTrue(activation.key, "Created activation key")

