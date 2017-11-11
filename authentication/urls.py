from django.conf.urls import url, include
from .views import UserViewSet, AuthenticationView, ResetPasswordRequestView, ValidateEmailView

# build router
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, base_name='users')

urlpatterns = [
    url(r'^',include(router.urls)),
    url(r'^authentication/$', AuthenticationView.as_view(), name='authentication'),
    url(r'^authentication/password/((?P<key>[A-Z0-9_]+)/)?$', ResetPasswordRequestView.as_view(), name='reset-password'),
    url(r'^authentication/email/?$',ValidateEmailView.as_view(), name='validate-email'),
]

    # users/
    # 	- GET: list
    # 	- POST: register
    # 	- PATCH: update
    
    # authentication/
    # 	- POST: login
    # 	- DELETE: logout
    # 	- PATCH: activate account

    # authentication/password
    # 	- POST: create password reset request
    # 	- PATCH: modify password
    	
    # authentication/email
    # 	- GET: verify email
    # 		- parameters:
    # 			email
    # 			userid