from django.conf.urls import url, include
from django.contrib import admin
from django import views

from .views import NotFound404ApiView

from angular.views import IndexView



urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include('agape.authentication.urls') ),
    url(r'^api/.*$',NotFound404ApiView.as_view(), name='api-404'),
    url(r'^.*/?$',IndexView.as_view(), name='index'),
]
