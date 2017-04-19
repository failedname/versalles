from django.shortcuts import render
from django.http import JsonResponse
from . .ventas.models import Vivero
from .models import Proveedor, Compra, DetalleCompra, Producto
import json


def seleccion(request):
    template_name = 'compras/seleccion.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def nueva_compra(request, pro):
    proveedor_row = Proveedor.objects.all()
    data = [{
        'cc': res.identificacion,
        'nombre': res.nombre,

    } for res in proveedor_row]
    template_name = 'compras/nueva_compra.html'
    return render(request, template_name, {'data': json.dumps(data)})


def search_productos(request, pros, pro):
    data = {}
    data = []
    prods = Producto.objects.select_related('id_presentacion').filter(
            nombre__contains=pros, vivero_id=pro)
    if len(prods) >= 1:
        for tot in prods:
            data.append({
                'id': tot.pk,
                'nombre':  tot.nombre,
                'precio':  tot.precio_venta,
                'pres': tot.id_presentacion.tipo,
                'iva': tot.iva_porce
            })
        return JsonResponse({'data': data}, safe=True)
    else:
        return JsonResponse({'data': data}, safe=True)


def SaveCompra(request, pro):
    data = request.body.decode('utf-8')
    datos = json.loads(data)
    comp = Compra(codigo=datos['factura'],fecha=datos['fecha'],vivero_id=pro,proveedor_id=datos['proveedor'])
    comp.save()
    det = comp.codigo

    for color in datos['data']:
        cantidad = Almacen.objects.filter(vivero_id=pro,producto_id=color['produ'])
        suma = cantidad[0].stock + int(color['cantidad'])
        Almacen.objects.filter(vivero_id=pro,producto_id=color['produ']).update(stock=suma)
        DetalleCompra.objects.create(compra_id=det,producto_id=color['produ'],cantidad=color['cantidad'],
                                     valor_compra=color['precio'],iva=color['iva'],valor_neto=color['neto'],descuento=color['desc'] )
    return JsonResponse({'mjs':'Compra Ingresada'})
