from django.conf.urls import url
from django.contrib import admin
from angular.views import IndexView

from registration.views import RegisterView, CheckUsernameView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
	url(r'^api/v1/register/$', RegisterView.as_view(), name='register'),
	url(r'^api/v1/register/check-username/?$', CheckUsernameView.as_view(), name='check-username'),
    url(r'^.*$',IndexView.as_view(), name='index'),
]
