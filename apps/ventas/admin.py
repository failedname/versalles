# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import (
    Cliente, Producto, Categoria,
    Presentacion, Vivero, EstadoFactura,
    Detalle_FacturaReal,
    Numeracion, FacturaReal, Remision, detalleRemison, detalleUser,
    estadoPedido, Pedido, abonoPedido, PagosFactura)


class ExampleAdmin(admin.ModelAdmin):
    change_list_template = 'smuggler/change_list.html'


@admin.register(estadoPedido)
class estadoPedidoAdmin(admin.ModelAdmin):
    pass


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    pass


@admin.register(abonoPedido)
class abonoPedidoAdmin(admin.ModelAdmin):
    pass


@admin.register(detalleUser)
class DetalleUser(admin.ModelAdmin):
    pass


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nit_cc', 'nombre', 'telefono')


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_venta', 'iva_porce',
                    'id_categoria', 'id_presentacion',
                    'precio_compra', 'tran_porce', 'valor_real_compra',
                    'precioxmayor', 'mayor_porce')
    list_per_page = 50
    search_fields = ('nombre',)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nomb_cate',)


@admin.register(EstadoFactura)
class EstadoFacturaAdmin(admin.ModelAdmin):
    pass


@admin.register(Presentacion)
class PresentacionAdmin(admin.ModelAdmin):
    list_display = ('tipo',)


@admin.register(Vivero)
class ViveroAdmin(admin.ModelAdmin):
    pass


@admin.register(Numeracion)
class NumeracionAdmin(admin.ModelAdmin):
    pass


@admin.register(FacturaReal)
class FacturaRealAdmin(admin.ModelAdmin):
    pass


@admin.register(Detalle_FacturaReal)
class DetalleFacturaRealAdmin(admin.ModelAdmin):
    pass


@admin.register(Remision)
class remisionAdmin(admin.ModelAdmin):
    pass


@admin.register(detalleRemison)
class detalleRemision(admin.ModelAdmin):
    pass


@admin.register(PagosFactura)
class PagosFacturaAdmin(admin.ModelAdmin):
    pass
