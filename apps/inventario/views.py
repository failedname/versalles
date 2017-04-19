from django.shortcuts import render
from ..ventas.models import Producto, Vivero
from ..inventario.models import Almacen
import json


def SelVivero(request):
    template_name = 'inventario/vivero.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def Productos(request, pro):
    template_name = 'inventario/productos.html'
    produ = Almacen.objects.select_related(
                                            'producto', 'vivero',
                                            'producto__id_categoria',
                                            'producto__id_presentacion').filter(vivero_id=pro)
    data = [{
        'nombre': res.producto.nombre,
        'precio': res.producto.precio_venta,
        'iva': res.producto.iva_porce,
        'categoria': res.producto.id_categoria.nomb_cate,
        'presentacion': res.producto.id_presentacion.tipo,
        'vivero': res.vivero.nombre,
        'stock': res.stock

    }for res in produ]
    return render(request, template_name, {'data': json.dumps(data)})
