
from django.conf.urls import url
from .views import nueva_compra, compras, buscar_proveedor, buscarProductos, save_compra

urlpatterns = [
    url(r'^$', compras, name="all_compras"),
    url(r'^nuevacompra/$',
        nueva_compra, name='nuevacompra'),
    url(r'^nuevacompra/proveedor/$', buscar_proveedor, name="buscar_pro"),
    url(r'^nuevacompra/productos/$', buscarProductos, name="burcar_producto"),
    url(r'^nuevacompra/save/$', save_compra, name="savecompra")
    # url(r'^seleccionar/nuevacompra/(?P<pro>\w+)/save_compra/$',
    #     SaveCompra, name='savecompra'),



]
