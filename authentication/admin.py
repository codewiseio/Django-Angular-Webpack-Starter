from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User,UserActivation,UserPasswordReset

admin.site.register(User)
admin.site.register(UserActivation)
admin.site.register(UserPasswordReset)