# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Cliente(models.Model):
    nit_cc = models.CharField(blank=True, max_length=100, unique=True)
    nombre = models.CharField(max_length=50)
    telefono = models.CharField(max_length=100)
    direccion = models.CharField(max_length=100, null=True)

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    nomb_cate = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Categoria Producto'
        verbose_name_plural = 'Categoria Productos '

    def __str__(self):
        return self.nomb_cate


class Presentacion(models.Model):
    tipo = models.CharField(max_length=50)

    class Meta:
        verbose_name = 'Presentacion Producto'
        verbose_name_plural = 'Presentacion Productos'

    def __str__(self):
        return self.tipo


class Vivero(models.Model):
    identificacion = models.CharField(max_length=100)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)
    telefono = models.IntegerField()

    class Meta:
        verbose_name = 'Vivero'
        verbose_name_plural = 'Viveros'

    def __str__(self):
        return self.nombre








class detalleUser(models.Model):
    vivero = models.ForeignKey(Vivero)
    usuario = models.OneToOneField(User)

    class Meta:
        verbose_name = 'Detalle de Usuario'
        verbose_name_plural = 'Detalles de Usuarios'


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    precio_venta = models.IntegerField(verbose_name='precio', null=True)
    iva_porce = models.IntegerField(verbose_name='iva', null=True)
    id_categoria = models.ForeignKey(Categoria, verbose_name='Categoria')
    id_presentacion = models.ForeignKey(
        Presentacion, verbose_name='Presentación')
    vivero = models.ForeignKey(Vivero, null=True)
    precio_compra = models.IntegerField(null=True)
    tran_porce = models.IntegerField(verbose_name='Trasporte %', null=True)
    mayor_porce = models.IntegerField(
        verbose_name='Utilidad x mayor %', null=True)
    precioxmayor = models.IntegerField(
        blank=True, verbose_name='precio al por mayor', null=True)
    valor_real_compra = models.IntegerField(
        blank=True, verbose_name='valor compra real', null=True)

    def save(self):
        preciocompra = ((self.tran_porce / 100) *
                        self.precio_compra) + self.precio_compra
        print(preciocompra)
        self.valor_real_compra = preciocompra
        self.precioxmayor = ((self.mayor_porce / 100) *
                             preciocompra) + preciocompra
        super(Producto, self).save()

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return self.nombre

class estadoPedido(models.Model):
    codigo = models.IntegerField(primary_key=True)
    estado = models.CharField(max_length=100)


class Pedido(models.Model):
    fecha = models.DateField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente)
    vivero = models.ForeignKey(Vivero)
    estadopedido = models.ForeignKey(estadoPedido,null=True) 


class detallePedido(models.Model):
    pedido = models.ForeignKey(Pedido)  
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto)
    val_unitario = models.IntegerField()
    iva = models.IntegerField()
    val_neto = models.IntegerField()

class abonoPedido(models.Model):
    pedido = models.ForeignKey(Pedido)
    fecha = models.DateField(auto_now_add=True)
    valorabono = models.IntegerField()


class FacturaDoble(models.Model):
    fecha = models.DateField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente)
    vivero = models.ForeignKey(Vivero)

    class Meta:
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'


class EstadoFactura(models.Model):
    estado = models.CharField(max_length=100)

    def __str__(self):
        return self.estado


class FacturaReal(models.Model):
    codigo = models.IntegerField(primary_key=True)
    fecha = models.DateField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente)
    vivero = models.ForeignKey(Vivero)
    estado = models.ForeignKey(EstadoFactura, null=True)

    class Meta:
        verbose_name = 'Factura Real'
        verbose_name_plural = 'Facturas Reales'


class Detalle_FacturaDoble(models.Model):
    factura = models.ForeignKey(FacturaDoble)
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto)
    descuento = models.IntegerField()
    val_unitario = models.IntegerField()
    iva = models.IntegerField()
    val_neto = models.IntegerField()

    class Meta:
        verbose_name = 'Detalle Factura Doble'
        verbose_name_plural = 'Detalle Facturas Dobles'


class Detalle_FacturaReal(models.Model):
    factura = models.ForeignKey(FacturaReal)
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto)
    val_unitario = models.IntegerField()
    iva = models.IntegerField()
    val_neto = models.IntegerField()

    class Meta:
        verbose_name = 'Detalle Factura Real'
        verbose_name_plural = 'Detalle Facturas Reales'


class Numeracion(models.Model):
    resolucion = models.CharField(max_length=100)
    fecha = models.DateField(auto_now_add=False, null=True)
    num_ini = models.IntegerField()
    num_fin = models.IntegerField()
    vivero = models.ForeignKey(Vivero)

    class Meta:
        verbose_name = 'Numeracion'
        verbose_name_plural = 'Numeraciones'


class Remision(models.Model):
    fecha = models.DateField(auto_now_add=True)
    vivero = models.ForeignKey(Vivero)
    cliente = models.ForeignKey(Cliente)
    estado = models.ForeignKey(EstadoFactura, null=True)


class detalleRemison(models.Model):
    remision = models.ForeignKey(Remision)
    producto = models.ForeignKey(Producto)
    cantidad = models.IntegerField()
    val_unitario = models.IntegerField(null=True)
    iva = models.IntegerField(null=True)
    val_neto = models.IntegerField(null=True)
