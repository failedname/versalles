from django.shortcuts import render
from django.http import JsonResponse
from ..ventas.models import Producto, Vivero, Presentacion
from ..inventario.models import Almacen
from ..ventas.models import Producto, Categoria, Presentacion
import json


def Script(request):
    pro = Producto.objects.all().filter(vivero_id=request.session['vivero'])
    for res in pro:
        Almacen.objects.create(producto_id=res.pk, stock=0,
                               vivero_id=request.session['vivero'])


def Productos(request):
    template_name = 'inventario/productos.html'
    product = Almacen.objects.select_related('producto',
                                             'producto__id_presentacion',
                                             'producto__id_categoria').filter(
        vivero=request.session['vivero'])
    categoria = Categoria.objects.all()
    presentacion = Presentacion.objects.all()

    data = [{
        'id': res.producto_id,
        'nombre': res.producto.nombre,
        'barra': res.producto.barras,
        'categoria': res.producto.id_categoria.nomb_cate,
        'presentacion': res.producto.id_presentacion.tipo,
        'precio': res.producto.precio_venta,
        'iva': res.producto.iva_porce,
        'stock': res.stock
    }for res in product]
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
    Almacen.objects.create(producto_id=p.pk, stock=0,
                           vivero_id=request.session['vivero'])

    req_producto = product = Almacen.objects.select_related('producto',
                                                            'producto__id_presentacion',
                                                            'producto__id_categoria').filter(
        vivero=request.session['vivero'], producto=p.pk)
    data = [{
        'id': res.producto_id,
        'nombre': res.producto.nombre,
        'barra': res.producto.barras,
        'categoria': res.producto.id_categoria.nomb_cate,
        'presentacion': res.producto.id_presentacion.tipo,
        'precio': res.producto.precio_venta,
        'iva': res.producto.iva_porce,
        'stock': res.stock
    }for res in req_producto]

    return JsonResponse({'res': data}, safe=True)
