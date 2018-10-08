from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from ..ventas.models import Vivero
from ..inventario.models import Almacen
from .models import Proveedor, Compra, DetalleCompra, Producto
from django.db.models import Q
import json


def compras(request):
    template_name = 'compras/allcompras.html'
    data = DetalleCompra.objects.extra(
        select={'total': 'SELECT sum(compras_detallecompra.valor_neto)  FROM compras_detallecompra WHERE compras_detallecompra.compra_id = compras_compra.codigo',
                }).select_related(
        'compra',
        'compra__vivero',
        'compra__proveedor').filter(
        compra__vivero_id=request.session['vivero']).distinct(
        'compra_id')

    fact = [{
        'id': res.compra.pk,
        'codigo': res.compra.codigo,
        'fecha': str(res.compra.fecha),
        'identificacion': res.compra.proveedor.identificacion,
        'nombre': res.compra.proveedor.nombre,
        'total': res.total,
    }for res in data]
    return render(request, template_name, {'data': json.dumps(fact)
                                           })


def nueva_compra(request):
    template_name = 'compras/nueva_compra.html'
    return render(request, template_name)


def buscar_proveedor(request):
    data = request.body.decode('utf-8')
    cliente = Proveedor.objects.all().filter(
        Q(nombre__icontains=data) | Q(identificacion__icontains=data))[:5]
    items = [{
        'id': res.pk,
        'nombre': res.nombre,
        'iden': res.identificacion

    }for res in cliente]
    return JsonResponse({'data': items}, safe=True)


def buscarProductos(request):
    dta = request.body.decode('utf-8')
    otra = json.loads(dta)
    prods = Producto.objects.select_related(
        'id_presentacion').filter(
            nombre__icontains=otra['valinput'], vivero_id=request.session['vivero'])[:9]
    data = [{
            'id': res.pk,
            'nombre': res.nombre,
            'iva': res.iva_porce,
            'precio': res.valor_real_compra,
            'presentacion': res.id_presentacion.tipo

            }for res in prods]
    return JsonResponse({'data': data}, safe=False)


def save_compra(request):
    data = request.body.decode('utf-8')
    datos = json.loads(data)
    f = Compra(codigo=datos['compra']['numero'],
               fecha=datos['compra']['fecha'], vivero_id=request.session['vivero'], proveedor_id=datos['cliente']['id'])

    f.save()
    for res in datos['datos']:
        val_iva = ((int(res['iva']) + 100) / 100) * \
            (int(res['precio']) * int(res['cantidad']))
        DetalleCompra.objects.create(
            compra_id=f.codigo, producto_id=res['id'], cantidad=int(res['cantidad']), valor_compra=int(res['precio']), iva=val_iva - (int(res['precio']) * int(res['cantidad'])), valor_neto=val_iva)
        stock = Almacen.objects.get(
            producto_id=res['id'], vivero_id=request.session['vivero'])

        rest = int(stock.stock) + int(res['cantidad'])
        stock.stock = rest
        stock.save()
    return HttpResponse(content="registro gurdado", status=200)
