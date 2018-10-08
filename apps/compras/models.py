from django.db import models
from ..ventas.models import Producto, Vivero


class Proveedor(models.Model):
    identificacion = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    telefono = models.IntegerField()
    direccion = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'

    def __str__(self):
        return self.nombre


class Compra(models.Model):
    codigo = models.IntegerField(primary_key=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=False)
    vivero = models.ForeignKey(Vivero, on_delete=models.CASCADE)


class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    valor_compra = models.IntegerField()
    iva = models.IntegerField()
    valor_neto = models.IntegerField()
    descuento = models.IntegerField(null=True)



