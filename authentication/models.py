from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from .settings import AUTHENTICATION

# for random string generation
import string
import random

# for dispatching emails after creating new activation and password reset links
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail


class UserManager(BaseUserManager):
    """
    A custom user manager to deal with emails as unique identifiers for
    auth instead of usernames. This replaces the default "UserManager".
    """
    def create_user(self,email,password,**extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The email must be set.')
        email = self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self,email,password,**extra_fields):
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True)
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email,password,**extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    A custom user class which uses emails as unique identifiers instead
    of usernames. This replaces the default "User" supplied by Django.
    """
    DISABLED = -1
    INACTIVE = 0
    ACTIVE = 1
    STATUS_CHOICES = (
        ("", '-- select --'),
        (DISABLED, 'Disabled'),
        (INACTIVE, 'Inactive'),
        (ACTIVE, 'Active')
    )
    
    email        = models.EmailField(unique=True)
    is_superuser = models.BooleanField(default=False,help_text="Designates whether user can log into the backend.")
    status      = models.SmallIntegerField(choices=STATUS_CHOICES,blank=False,null=False,default=0 )
    last_login  = models.DateTimeField(blank=True,null=True)
    
    created     = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    created_by  = models.ForeignKey('User', on_delete=models.PROTECT, blank=True, null=True, related_name="created_user")
    modified    = models.DateTimeField(auto_now=True,blank=True,null=True)
    modified_by = models.ForeignKey('User', on_delete=models.PROTECT, blank=True, null=True, related_name="modified_user")    

    USERNAME_FIELD = 'email'
    objects = UserManager()
    
    @property
    def is_admin(self):
      return self.is_superuser
    
    @property
    def is_staff(self):
      return self.is_superuser

    @property
    def is_active(self):
        return True if self.status == 1 else False;
    
    def get_short_name(self):
        self.email;
    
    def get_long_name(self):
        self.email;
    
    def __unicode__(self):
        return self.email






class UserActivation(models.Model):
    """ Provide activation links for new users.
    
    Generates a random key which is used to activate a new user account. Emails can
    then be sent to users with a link containing the key. Once this link has been
    followed the account will be set to active.
    
    Extends:
        models.Model
    
    Variables:
        user (models.ForeignKey): User account to activate
        key  (models.StringField): Randomly generated string of eight uppercase letters and numbers
        created (models.DateTimeField): Time activation link was created
        activated (models.DateTimeField): Time account was activated
    """

    def generate_key():
        """Generate a random string of 8 uppercase letters and numbers

        Returns:
            string: Random string of 8 uppercase letters and numbers

        """
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(8))

    user      = models.ForeignKey('User', on_delete=models.CASCADE, blank=False, null=False)    
    key       = models.CharField(max_length=8,unique=True,blank=False,null=False,default=generate_key)
    created   = models.DateTimeField(auto_now_add=True,blank=True,null=False)
    activated = models.DateTimeField(blank=True,null=True)





class ResetPasswordRequest(models.Model):
    """ Provide password reset links for new users.
    
    Generates a random key which is used to reset user account passwords. Emails can
    then be sent to users with a link containing the key. Once this link has been
    followed the user can set a new password.
    
    Extends:
        models.Model
    
    Variables:
        user (models.ForeignKey): User account to activate
        key  (models.StringField): Randomly generated string of 16 uppercase letters and numbers
        created (models.DateTimeField): Time reset link was created
        activated (models.DateTimeField): Time reset link was followed
    """

    def generate_key():
        """Generate a random string of 16 uppercase letters and numbers

        Returns:
            string: Random string of 16 uppercase letters and numbers

        """
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(16))


    DISABLED = -1
    ENABLED = 1
    USED = 2
    STATUS_CHOICES = (
        ("", '-- select --'),
        (DISABLED, 'Disabled'),
        (ENABLED, 'Active'),
        (USED, 'Used'),
    )

    user      = models.ForeignKey('User', on_delete=models.CASCADE, blank=False, null=False) 
    key       = models.CharField(max_length=16,unique=True,blank=False,null=False,default=generate_key)
    created   = models.DateTimeField(auto_now_add=True,blank=True,null=False)
    status    = models.SmallIntegerField(choices=STATUS_CHOICES,blank=False,null=False,default=1)
    used      = models.DateTimeField(blank=True,null=True)
