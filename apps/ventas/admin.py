# -*- coding: utf-8 -*-
from django.contrib import admin
from .models import (
                        Cliente, Producto, Categoria,
                        Presentacion, Vivero, EstadoFactura,
                        Detalle_FacturaReal,
                        Numeracion, FacturaReal)

class ExampleAdmin(admin.ModelAdmin):
    change_list_template = 'smuggler/change_list.html'


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id','nit_cc', 'nombre', 'telefono')


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio_venta', 'iva_porce',
                    'id_categoria', 'id_presentacion', 'precio_compra')
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
