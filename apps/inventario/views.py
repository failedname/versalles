from django.shortcuts import render
from django.http import JsonResponse
from ..ventas.models import Producto, Vivero, Presentacion
from ..inventario.models import Almacen
from ..ventas.models import Producto, Categoria, Presentacion
import json


def Productos(request):
    template_name = 'inventario/productos.html'
    productos = Producto.objects.filter(
        vivero=request.session['vivero']).select_related('id_presentacion', 'id_categoria')
    categoria = Categoria.objects.all()
    presentacion = Presentacion.objects.all()

    data = [{
        'id': res.id,
        'nombre': res.nombre,
        'barra': res.barras,
        'categoria': res.id_categoria.nomb_cate,
        'presentacion': res.id_presentacion.tipo,
        'precio': res.precio_venta,
        'iva': res.iva_porce
    }for res in productos]
    cate = [{
        'id': res.pk,
        'nombre': res.nomb_cate
    }for res in categoria]
    pres = [{
        'id': res.pk,
        'nombre': res.tipo
    }for res in presentacion]
    return render(request, template_name, {'data': json.dumps(data),
                                           'categoria': json.dumps(cate),
                                           'presentacion': json.dumps(pres)})


def SaveProducto(request):

    nombre = request.POST['nombre']
    iva = request.POST['iva']
    categoria = request.POST['categoria']
    precio_compra = request.POST['precio_compra']
    presentacion = request.POST['presentacion']
    transporte = request.POST['transporte']
    barras = request.POST['barras']
    utilidad = request.POST['utilidad']
    por_ganancia = request.POST['ganancia']
    p = Producto(
        nombre=nombre,  barras=barras,
        vivero_id=request.session['vivero'],
        id_categoria_id=categoria, iva_porce=float(iva),  precio_compra=int(
            precio_compra),
        id_presentacion_id=presentacion, tran_porce=float(transporte), mayor_porce=float(utilidad),
        general_porce=float(por_ganancia))
    p.save()
    product_save = Producto.objects.filter(pk=p.pk)
    data = [{
        'id': res.id,
        'nombre': res.nombre,
        'barra': res.barras,
        'categoria': res.id_categoria.nomb_cate,
        'presentacion': res.id_presentacion.tipo,
        'precio': res.precio_venta,
        'iva': res.iva_porce
    }for res in product_save]

    return JsonResponse({'res': data}, safe=True)
