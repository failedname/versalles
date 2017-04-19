
from django.conf.urls import url
from .views import seleccion, nueva_compra, search_productos

urlpatterns = [
    url(r'^seleccionar/$', seleccion, name='seleccion'),
    url(r'^seleccionar/nuevacompra/(?P<pro>\w+)/$',
        nueva_compra, name='nuevacompra'),
    url(r'^seleccionar/nuevacompra/(?P<pro>\w+)/productos/(?P<pros>\w+)/$',
        search_productos, name='searchpro'),
    # url(r'^seleccionar/nuevacompra/(?P<pro>\w+)/save_compra/$',
    #     SaveCompra, name='savecompra'),



]
