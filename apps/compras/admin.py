from django.contrib import admin
from .models import Proveedor, Compra, DetalleCompra


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('identificacion', 'nombre', 'telefono', 'direccion')


@admin.register(DetalleCompra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('compra',)

@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    pass
