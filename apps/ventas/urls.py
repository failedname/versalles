from django.conf.urls import url
from .views import (
                    nueva_factura, search_productos,
                    vivero_factura, save_facturaReal,
                    SelFacturas, AllFacturas, SearchFac, pdfFactura,
                    selViveroPro, getProductos)

urlpatterns = [
    url(r'^seleccionar/$', vivero_factura, name='viverofactura'),
    url(r'^viveroproductos/$', selViveroPro, name='viveroproductos'),
    url(r'^viveroproductos/(?P<pro>\w+)/productos/$', getProductos, name='getproductos'),
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
    url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/generar/$',
        SearchFac, name='generarcopiafactura'),
    # url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/pdf$',
    #     pdfFactura.as_view(), name='pdfFactura'),

]
