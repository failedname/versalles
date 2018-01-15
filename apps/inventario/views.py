from django.shortcuts import render
from ..ventas.models import Producto, Vivero
from ..inventario.models import Almacen
import json


def Productos(request):
    template_name = 'inventario/productos.html'
    productos = Producto.objects.all().filter(vivero=request.session['vivero'])
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
