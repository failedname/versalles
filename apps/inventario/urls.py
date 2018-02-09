
from django.conf.urls import url
from .views import Productos, SaveProducto

urlpatterns = [
    url(r'^productos/$',
        Productos, name='productos'),
    url(r'^productos/save_producto/$',
        SaveProducto, name='save_productos'),




]
