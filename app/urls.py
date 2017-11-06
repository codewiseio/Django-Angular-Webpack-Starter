from django.conf.urls import url, include
from django.contrib import admin
from django import views

from .views import NotFound404ApiView

from angular.views import IndexView

from authentication.views import UserViewSet, AuthenticationView, ResetPasswordRequestView

# build router
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, base_name='user')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/',include(router.urls)),
    url(r'^api/v1/authentication/$', AuthenticationView.as_view(), name='authentication'),
    url(r'^api/v1/authentication/password/((?P<key>[A-Z0-9_]+)/)?$', ResetPasswordRequestView.as_view(), name='reset-password'),

    #agape.authentication.urls('api/v1'),
    
    # api/v1/users/
    # 	- GET: list
    # 		-?email=codewiseio@gmail.com
    # 	- POST: register
    # 	- PATCH: update
    
    # api/v1/authentication/
    # 	- POST: login
    # 	- DELETE: logout
    # 	- PATCH: activate account

    # api/v1/authentication/password
    # 	- POST: create password reset request
    # 	- PATCH: modify password






 #    url(r'^api/v1/login/$', LoginView.as_view(), name='login'),
	# url(r'^api/v1/register/$', RegisterView.as_view(), name='register'),
	# url(r'^api/v1/register/validate-email/?$', ValidateEmailView.as_view(), name='validate-email'),
	# url(r'^api/v1/register/activate/(?P<key>[A-Z0-9_]+)/?$', ActivateUserView.as_view(), name='activate-user'),
	# url(r'^api/v1/reset-password/?$', ResetPasswordRequestView.as_view(), name='reset-password-request'),
	# url(r'^api/v1/reset-password/(?P<key>[A-Z0-9_]+)/?$', ResetPasswordView.as_view(), name='reset-password'),
    url(r'^api/.*$',NotFound404ApiView.as_view(), name='api-404'),
    url(r'^.*/?$',IndexView.as_view(), name='index'),
]
