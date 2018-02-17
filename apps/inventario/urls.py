
from django.conf.urls import url
from .views import Productos, SaveProducto, Script

urlpatterns = [
    url(r'^productos/$',
        Productos, name='productos'),
    url(r'^productos/save_producto/$',
        SaveProducto, name='save_productos'),
    url(r'^productos/script/$',
        Script, name='script'),




]
