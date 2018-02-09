from django.shortcuts import render
from ..ventas.models import Producto, Vivero, Presentacion
from ..inventario.models import Almacen
from ..ventas.models import Producto
import json


def Productos(request):
    template_name = 'inventario/productos.html'
    productos = Producto.objects.filter(
        vivero=request.session['vivero']).select_related('id_presentacion', 'id_categoria')
    data = [{
        'id': res.id,
        'nombre': res.nombre,
        'barra': res.barras,
        'categoria': res.id_categoria.nomb_cate,
        'presentacion': res.id_presentacion.tipo,
        'precio': res.precio_venta,
        'iva': res.iva_porce
    }for res in productos]
    return render(request, template_name, {'data': json.dumps(data)})


def SaveProducto(request):
    nombre = request.POST['nombre']
    precio_venta = request.POST['precio_venta']
    imagen = request.POST['imagen']
    descripcion = request.POST['descripcion']
    iva = request.POST['iva']
    categoria = request.POST['categoria']
    precio_compra = request.POST['precio_compra']
    presentacion = request.POST['presentacion']
    transporte = request.POST['transporte']
    barras = request.POST['barras']
    utilidad = request.POST['utilidad']

    print(nombre)
