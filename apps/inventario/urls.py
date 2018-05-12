
from django.conf.urls import url
from .views import Productos, SaveProducto, Script, AddInventario, DelInventario,Printproduct

urlpatterns = [
    url(r'^productos/$',
        Productos, name='productos'),
    url(r'^productos/save_producto/$',
        SaveProducto, name='save_productos'),

    url(r'^productos/add/$',
        AddInventario, name='add'),
    url(r'^productos/del/$',
        DelInventario, name='del'),
    url(r'^productos/print/$',
        Printproduct, name='print'),




]
