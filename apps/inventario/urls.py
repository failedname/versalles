
from django.conf.urls import url
from .views import Productos

urlpatterns = [
    url(r'^productos/$',
        Productos, name='productos'),




]
