from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


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
    is_active   = models.BooleanField(default=True,help_text="Designates whether user is active or not")
    status      = models.SmallIntegerField(choices=STATUS_CHOICES,blank=False,null=False,default=0)
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
    
    def get_short_name(self):
        self.email;
    
    def get_long_name(self):
        self.email;
    
    def __unicode__(self):
        return self.email

