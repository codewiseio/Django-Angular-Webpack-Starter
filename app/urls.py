from django.conf.urls import url
from django.contrib import admin
from angular.views import IndexView

from registration.views import RegisterView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^.*$',IndexView.as_view(), name='index'),

	url(r'^api/v1/register/?$', RegisterView.as_view(), name='register'),
]
