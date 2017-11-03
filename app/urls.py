from django.conf.urls import url
from django.contrib import admin
from django import views

from .views import NotFound404ApiView

from angular.views import IndexView

from authentication.views import LoginView, RegisterView, ValidateEmailView, ActivateUserView, ResetPasswordRequestView, ResetPasswordView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/login/$', LoginView.as_view(), name='login'),
	url(r'^api/v1/register/$', RegisterView.as_view(), name='register'),
	url(r'^api/v1/register/validate-email/?$', ValidateEmailView.as_view(), name='validate-email'),
	url(r'^api/v1/register/activate/(?P<key>[A-Z0-9_]+)/?$', ActivateUserView.as_view(), name='activate-user'),
	url(r'^api/v1/reset-password/?$', ResetPasswordRequestView.as_view(), name='reset-password-request'),
	url(r'^api/v1/reset-password/(?P<key>[A-Z0-9_]+)/?$', ResetPasswordView.as_view(), name='reset-password'),
    url(r'^api/.*$',NotFound404ApiView.as_view(), name='api-404'),
    url(r'^.*/?$',IndexView.as_view(), name='index'),
]
