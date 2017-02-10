
from django.conf.urls import url
from .views import (
                    nueva_factura, search_productos,
                    vivero_factura, save_facturaReal,
                    SelFacturas, AllFacturas, SearchFac)

urlpatterns = [
    url(r'^seleccionar/$', vivero_factura, name='viverofactura'),
    url(r'^selvivero/$', SelFacturas, name='selfacturas'),
    url(r'^facturas/(?P<pro>\w+)/$',
        AllFacturas, name='allfacturas'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/$',
        nueva_factura, name='nuevafactura'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/productos/$',
        search_productos, name='searchpro'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/savefactura/$',
        save_facturaReal, name='saveInvoicereal'),
    url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/$',
        SearchFac, name='detallefactura'),


]
