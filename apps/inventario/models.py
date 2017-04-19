from django.db import models
from . .ventas.models import Producto, Vivero


class Almacen(models.Model):
    producto = models.ForeignKey(Producto)
    stock = models.IntegerField()
    vivero = models.ForeignKey(Vivero)

    class Meta:
        verbose_name = 'Almacen'
        verbose_name_plural = 'Almacenes'
