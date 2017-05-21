from django.conf.urls import url
from .views import (
                    nueva_factura, search_productos,
                    vivero_factura, save_facturaReal,
                    SelFacturas, AllFacturas, SearchFac, pdfFactura,
                    selViveroPro, getProductos, ViveroRem, remionesAll,
                    nuevaRemision, remisionCliente, remisionProductos,
                    saveRemision, copiaFactura, ventasPOS, productosPos, viveroPos)

urlpatterns = [
    url(r'^seleccionar/$', vivero_factura, name='viverofactura'),
    url(r'^viveroproductos/$', selViveroPro, name='viveroproductos'),
    url(r'^remisiones/$', ViveroRem, name='remisiones'),
    url(r'^remisiones/vivero/(?P<vivero_id>\w+)/todos/$',
        remionesAll, name='todosremisiones'),
    url(r'^remisiones/vivero/(?P<vivero_id>\w+)/crear/$',
        nuevaRemision.as_view(), name='crearremision'),
    url(r'^remisiones/vivero/(?P<vivero_id>\w+)/crear/cliente/$',
        remisionCliente, name='remisioncliente'),
    url(r'^remisiones/vivero/(?P<vivero_id>\w+)/crear/producto/$',
        remisionProductos, name='remisionproducto'),
    url(r'^remisiones/vivero/(?P<vivero_id>\w+)/crear/guardar/$',
        saveRemision, name='saveRemision'),
    url(r'^viveroproductos/(?P<pro>\w+)/productos/$',
        getProductos, name='getproductos'),
    url(r'^selvivero/$', SelFacturas, name='selfacturas'),
    url(r'^facturas/(?P<pro>\w+)/$',
        AllFacturas, name='allfacturas'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/$',
        nueva_factura, name='nuevafactura'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/productos/$',
        search_productos, name='searchpro'),
    url(r'^seleccionar/nuevafactura/(?P<pro>\w+)/savefactura/$',
        save_facturaReal, name='saveInvoicereal'),
    url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/copia/$',
        copiaFactura, name='copiafactura'),
    url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/$',
        SearchFac, name='detallefactura'),
    url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/generar/$',
        SearchFac, name='generarcopiafactura'),
    url(r'^pos/vivero/(?P<id>\w+)/pos/$', ventasPOS, name='pos'),
    url(r'^pos/vivero/$', viveroPos, name='vivero'),
    url(r'^pos/vivero/(?P<id>\w+)/pos/productopos/$', productosPos, name='productopos'),
    # url(r'^facturas/(?P<pro>\w+)/detallefac/(?P<fac>\w+)/pdf$',
    #     pdfFactura.as_view(), name='pdfFactura'),

]
