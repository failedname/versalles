from django.shortcuts import render
from django.http import JsonResponse
from .models import (
                        Cliente, Producto,
                        Vivero,
                        FacturaReal, Detalle_FacturaReal,
                        Numeracion, EstadoFactura)
from django.views.generic import TemplateView
import json


class prueba(TemplateView):
    template_name = 'ventas/prueba.html'


def vivero_factura(request):
    template_name = 'ventas/vivero_factura.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def SelFacturas(request):
    template_name = 'ventas/seleccion_facturas.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def SearchFac(request, pro, fac):
    template_name = 'ventas/detailInvoice.html'
    detfac = Detalle_FacturaReal.objects.select_related(
                                                        'factura', 'factura__cliente', 'producto').filter(
                                                        factura__vivero_id= pro, factura__codigo= fac)
    data = [{
        'factura': res.factura.codigo,
        'cliente': res.factura.cliente.nombre,
        'identificacion': res.factura.cliente.nit_cc,
        'direccion': res.factura.cliente.direccion,
        'telefono': res.factura.cliente.telefono,
        'codigo': res.producto.pk,
        'nombre': res.producto.nombre,
        'cantidad': res.cantidad,
        'valor': res.val_unitario,
        'iva': res.iva,
        'total': res.val_neto


    }for res in detfac]
    return render(request, template_name, {'data': json.dumps(data)})


def AllFacturas(request, pro):
    template_name = 'ventas/allfacturas.html'
    data = Detalle_FacturaReal.objects.extra(
                                            select={'total': 'SELECT sum(ventas_detalle_facturareal.val_neto)  FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo'}).select_related(
                                            'factura',
                                            'factura__estado',
                                            'factura__vivero',
                                            'factura__cliente').filter(
                                            factura__vivero_id=pro).distinct(
                                            'factura_id')
    fact = [{
        'codigo': res.factura.codigo,
        'fecha': str(res.factura.fecha),
        'identificacion': res.factura.cliente.nit_cc,
        'nombre': res.factura.cliente.nombre,
        'estado': res.factura.estado.estado,
        'total': res.total
    }for res in data]

    return render(request, template_name, {'data': json.dumps(fact)})


def nueva_factura(request, pro):
    request.session['vivero'] = pro
    cliente_row = Cliente.objects.all()
    data = [{
        'id': res.pk,
        'cc': res.nit_cc,
        'nombre': res.nombre,

    } for res in cliente_row]
    template_name = 'ventas/nueva_factura.html'
    return render(request, template_name, {'data': json.dumps(data)})


def search_productos(request, pro):
    print(request.POST['precio'])

    if (len(request.POST['valinput']) > 0):
        prods = Producto.objects.select_related(
            'id_presentacion').filter(
                nombre__contains=request.POST['valinput'], vivero_id=pro)
        if (request.POST['precio'] == 'generales'):

            data = [{
                'id': res.pk,
                'nombre': res.nombre,
                'iva': res.iva_porce,
                'precio': res.precio_venta,
                'presentacion': res.id_presentacion.tipo

            }for res in prods]
            return JsonResponse({'data': data}, safe=False)
        elif (request.POST['precio'] == 'compra'):
            data = [{
                'id': res.pk,
                'nombre': res.nombre,
                'iva': res.iva_porce,
                'precio': res.valor_real_compra,
                'presentacion': res.id_presentacion.tipo

            }for res in prods]
            return JsonResponse({'data': data}, safe=False)
        elif (request.POST['precio'] == 'mayor'):
            data = [{
                'id': res.pk,
                'nombre': res.nombre,
                'iva': res.iva_porce,
                'precio': res.precioxmayor,
                'presentacion': res.id_presentacion.tipo

            }for res in prods]
            return JsonResponse({'data': data}, safe=False)
    else:
        return JsonResponse({'sin': 'hola'}, safe=False)


def save_facturaReal(request, pro):
    data = request.body.decode('utf-8')
    datos = json.loads(data)
    num = Numeracion.objects.all().filter(vivero_id=pro)
    estado = EstadoFactura.objects.all().filter(estado='cerrada')
    rows = FacturaReal.objects.filter(vivero_id=pro).count()
    nume = [{
        'resu': res.resolucion,
        'fecha': res.fecha,
        'ini': res.num_ini,
        'fin': res.num_fin
    }for res in num]
    if rows == 0:
        c = Cliente.objects.all().filter(nit_cc=datos['cliente']['id'])
        print(c[0])
        f = FacturaReal(codigo=num[0].num_ini,
                        vivero_id=pro,
                        estado_id=estado[0].pk,
                        cliente_id=c[0].pk)

        f.save()
        id_fac = f.codigo

        for res in datos['res']:
            Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                               cantidad=res['cantidad'],
                                               producto_id=res['codigo'],
                                               val_unitario=res['valorU'],
                                               iva=res['iva'],
                                               val_neto=res['valorN'])
            informe = Detalle_FacturaReal.objects.select_related(
                'factura', 'producto',
                'factura__cliente',
                'factura__vivero').filter(
                    factura_id=id_fac)
            data = [{
                'factura': res.factura.codigo,
                'cliente': res.factura.cliente.nombre,
                'direccion': res.factura.cliente.direccion,
                'nit': res.factura.cliente.nit_cc,
                'telefono': res.factura.cliente.telefono,
                'codigo': res.producto_id,
                'nombre': res.producto.nombre,
                'cantidad': res.cantidad,
                'iva': res.iva,
                'valor': res.val_unitario,
                'valneto': res.val_neto,
                'fecha': res.factura.fecha,
                'vivero': res.factura.vivero.nombre,
                'nit_vivero': res.factura.vivero.identificacion


            }for res in informe]
        return JsonResponse({'data': data, 'nume': nume}, safe=True)
    else:
        ultimo = FacturaReal.objects.latest('codigo')
        c = Cliente.objects.all().filter(nit_cc=datos['cliente']['id'])
        numeracion = 1 + ultimo.codigo
        f = FacturaReal(codigo=numeracion,
                        vivero_id=pro,
                        estado_id=estado[0].pk,
                        cliente_id=c[0].pk)

        f.save()
        id_fac = f.codigo
        for res in datos['res']:
            Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                               cantidad=res['cantidad'],
                                               producto_id=res['codigo'],
                                               val_unitario=res['valorU'],
                                               iva=res['iva'],
                                               val_neto=res['valorN'])
            informe = Detalle_FacturaReal.objects.select_related(
                'factura', 'producto', 'factura__cliente').filter(
                    factura_id=id_fac)
            data = [{
                'factura': res.factura.codigo,
                'cliente': res.factura.cliente.nombre,
                'nit': res.factura.cliente.nit_cc,
                'direccion': res.factura.cliente.direccion,
                'telefono': res.factura.cliente.telefono,
                'codigo': res.producto_id,
                'nombre': res.producto.nombre,
                'cantidad': res.cantidad,
                'iva': res.iva,
                'valor': res.val_unitario,
                'valneto': res.val_neto,
                'fecha': res.factura.fecha,
                'vivero': res.factura.vivero.nombre,
                'nit_vivero': res.factura.vivero.identificacion

            }for res in informe]
        return JsonResponse({'data': data, 'nume': nume}, safe=True)
