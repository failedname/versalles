
from django.conf.urls import url
from .views import Productos, SelVivero

urlpatterns = [
    url(r'^seleccionar/$', SelVivero, name='seleccionar'),
    url(r'^productos/vivero/(?P<pro>\w+)/$',
        Productos, name='productos'),




]
