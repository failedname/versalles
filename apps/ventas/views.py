# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.db.models import Sum
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from ..inventario.models import Almacen
from .models import (Cliente, Producto, Vivero,
                     FacturaReal, Detalle_FacturaReal,
                     Numeracion, EstadoFactura, Remision, detalleRemison,
                     Pedido, pedidoDetalle, abonoPedido, estadoPedido, PagosFactura)
import json


def cancelFactura(request):
    return JsonResponse({'data': 'hola'}, safe=True)


def pagoFactura(request):
    valor = request.body.decode('utf-8')
    info = json.loads(valor)
    abono = PagosFactura(
        pedido_id=info['factura'], valorabono=info['pago'])
    abono.save()
    pago = PagosFactura.objects.filter(pedido_id=info['factura']).aggregate(
        total=Sum('valorabono'))
    detalle = Detalle_FacturaReal.objects.filter(factura_id=info['factura']).aggregate(
        total=Sum('val_neto'))

    if(int(pago['total']) == int(detalle['total'])):
        estado = EstadoFactura.objects.all().filter(estado='cerrada')
        changeEstado = FacturaReal.objects.get(pk=info['factura'])
        changeEstado.estado_id = estado[0].pk
        changeEstado.save()

    recibo = PagosFactura.objects.select_related(
        'pedido', 'pedido__cliente'
    ).filter(pk=abono.pk, pedido_id=info['factura'])
    data = [{
        'abono': res.pk,
        'pedido': res.pedido.pk,
        'cliente': res.pedido.cliente.nombre,
        'direccion': res.pedido.cliente.direccion,
        'nit': res.pedido.cliente.nit_cc,
        'telefono': res.pedido.cliente.telefono,
        'fecha': res.fecha,
        'vivero': res.pedido.vivero.nombre,
        'nit_vivero': res.pedido.vivero.identificacion,
        'valorabono': res.valorabono


    }for res in recibo]
    facturas = Detalle_FacturaReal.objects.extra(
        select={'total': 'SELECT sum(ventas_detalle_facturareal.val_neto)  FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo',
                'abonos': 'SELECT sum(ventas_pagosfactura.valorabono) FROM ventas_pagosfactura WHERE ventas_pagosfactura.pedido_id = ventas_facturareal.codigo'}).select_related(
        'factura',
        'factura__estado',
        'factura__vivero',
        'factura__cliente').filter(
        factura__vivero_id=request.session['vivero'], factura=info['factura']).distinct(
        'factura_id')
    fact = [{
        'estado': res.factura.estado.estado,
        'abonos': res.abonos
    }for res in facturas]
    return JsonResponse({'data': data, 'factura': fact}, safe=True)


def jsonPedidos(request, id):
    vivero = request.session['vivero']
    pedidos = Pedido.objects.raw(
        'SELECT "public"."ventas_pedido"."id", "public"."ventas_pedido".fecha, (SELECT sum(ventas_pedidodetalle.val_neto) FROM ventas_pedidodetalle WHERE ventas_pedidodetalle.pedido_id = ventas_pedido."id") AS total, (SELECT sum(ventas_abonopedido.valorabono) FROM ventas_abonopedido WHERE ventas_abonopedido.pedido_id = ventas_pedido."id" ) AS abonos, "public"."ventas_cliente"."nit_cc", "public"."ventas_cliente".nombre, "public"."ventas_pedido"."estadopedido_id","public"."ventas_estadopedido".estado FROM "public"."ventas_cliente" JOIN "public"."ventas_pedido" ON "public"."ventas_cliente"."id" = "public"."ventas_pedido"."cliente_id"  JOIN "public"."ventas_estadopedido" ON "public"."ventas_estadopedido".codigo = "public"."ventas_pedido"."estadopedido_id" WHERE ventas_pedido.vivero_id = %s  ORDER BY "public"."ventas_pedido"."id" DESC', [vivero])
    data = [{
        'pedido': res.id,
        'fecha':  str(res.fecha),
        'identificacion': res.nit_cc,
        'nombre': res.nombre,
        'total': res.total,
        'abonos': res.abonos,
        'estado': res.estado
    }for res in pedidos]
    return JsonResponse({'data': data}, safe=True)


def allPedidos(request):
    vivero = request.session['vivero']
    pedidos = Pedido.objects.raw(
        'SELECT "public"."ventas_pedido"."id", "public"."ventas_pedido".fecha, (SELECT sum(ventas_pedidodetalle.val_neto) FROM ventas_pedidodetalle WHERE ventas_pedidodetalle.pedido_id = ventas_pedido."id") AS total, (SELECT sum(ventas_abonopedido.valorabono) FROM ventas_abonopedido WHERE ventas_abonopedido.pedido_id = ventas_pedido."id" ) AS abonos, "public"."ventas_cliente"."nit_cc", "public"."ventas_cliente".nombre, "public"."ventas_pedido"."estadopedido_id","public"."ventas_estadopedido".estado FROM "public"."ventas_cliente" JOIN "public"."ventas_pedido" ON "public"."ventas_cliente"."id" = "public"."ventas_pedido"."cliente_id"  JOIN "public"."ventas_estadopedido" ON "public"."ventas_estadopedido".codigo = "public"."ventas_pedido"."estadopedido_id" WHERE ventas_pedido.vivero_id = %s  ORDER BY "public"."ventas_pedido"."id" DESC', [vivero])
    data = [{
        'pedido': res.id,
        'fecha':  str(res.fecha),
        'identificacion': res.nit_cc,
        'nombre': res.nombre,
        'total': res.total,
        'abonos': res.abonos,
        'estado': res.estado
    }for res in pedidos]

    template_name = "ventas/allpedidos.html"
    return render(request, template_name, {'data': json.dumps(data)})


def detallePedido(request, id):
    vivero = request.session['vivero']
    template_name = "ventas/detallepedidos.html"
    pedido = pedidoDetalle.objects.select_related(
        'pedido', 'producto', 'pedido__cliente'
    ).filter(pedido__vivero_id=vivero, pedido_id=id)
    abonos = abonoPedido.objects.select_related(
        'pedido', 'pedido__vivero'
    ).filter(pedido__vivero_id=vivero, pedido_id=id)
    dataAbonos = [{
        'id': res.pk,
        'fecha': str(res.fecha),
        'valor': res.valorabono
    }for res in abonos]
    data = [{
        'codproducto': res.producto.pk,
        'nombre': res.producto.nombre,
        'precio': res.val_unitario,
        'iva': res.iva,
        'cantidad': res.cantidad,
        'pedido': res.pedido_id,
        'cliente': res.pedido.cliente.nombre,
        'nit': res.pedido.cliente.nit_cc,
        'telefono': res.pedido.cliente.telefono,
        'direccion': res.pedido.cliente.direccion
    }for res in pedido]

    return render(request, template_name, {'data': json.dumps(data), 'abonos': json.dumps(dataAbonos)})


class abonosPedido(TemplateView):
    template_name = 'ventas/abonopedido.html'

    def post(self, request, *args, **kwargs):
        valor = request.body.decode('utf-8')
        abono = abonoPedido(pedido_id=kwargs.get(
            'id'), valorabono=json.loads(valor))
        abono.save()
        total = pedidoDetalle.objects.filter(
            pedido_id=kwargs.get(
                'id')).aggregate(total=Sum('val_neto'))
        abonos = abonoPedido.objects.filter(
            pedido_id=kwargs.get(
                'id')).aggregate(abono=Sum('valorabono'))

        if(int(total['total']) == int(abonos['abono'])):
            p = Pedido.objects.get(pk=kwargs.get(
                'id'))
            p.estadopedido_id = 1
            p.save()
        recibo = abonoPedido.objects.select_related(
            'pedido', 'pedido__cliente'
        ).filter(pk=abono.pk, pedido_id=kwargs.get('id'))
        data = [{
            'abono': res.pk,
            'pedido': res.pedido.pk,
            'cliente': res.pedido.cliente.nombre,
            'direccion': res.pedido.cliente.direccion,
            'nit': res.pedido.cliente.nit_cc,
            'telefono': res.pedido.cliente.telefono,
            'fecha': res.fecha,
            'vivero': res.pedido.vivero.nombre,
            'nit_vivero': res.pedido.vivero.identificacion,
            'valorabono': res.valorabono


        }for res in recibo]
        return JsonResponse({'data': data}, safe=True)


def nuevoPedido(request):
    template_name = "ventas/nuevopedido.html"
    return render(request, template_name)


def clientePedido(request):
    data = request.body.decode('utf-8')
    cliente = Cliente.objects.all().filter(nombre__icontains=data)[:5]
    items = [{
        'id': res.pk,
        'nombre': res.nombre,
        'iden': res.nit_cc

    }for res in cliente]
    return JsonResponse({'data': items}, safe=True)


def productoPedido(request):
    if (len(request.POST['valinput']) > 0):
        prods = Producto.objects.select_related(
            'id_presentacion').filter(
                nombre__icontains=request.POST['valinput'],
                vivero_id=request.session['vivero'])[:9]
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


def guardarPedi(request):
    data = request.body.decode('utf-8')
    datos = json.loads(data)
    c = Cliente.objects.all().filter(nit_cc=datos['cliente']['id'])
    f = Pedido(vivero_id=request.session['vivero'],
               estadopedido_id=2,
               cliente_id=c[0].pk)

    f.save()
    id_fac = f.pk

    for res in datos['res']:
        detalle = pedidoDetalle(pedido_id=id_fac,
                                cantidad=res['cantidad'],
                                producto_id=res['codigo'],
                                val_unitario=res['valorU'],
                                iva=res['iva'],
                                val_neto=res['valorN'])
        detalle.save()
    if(datos['abono']['valor'] != 0):
        abonoPedido.objects.create(
            pedido_id=id_fac, valorabono=datos['abono']['valor'])
        total = pedidoDetalle.objects.filter(
            pedido_id=id_fac).aggregate(total=Sum('val_neto'))
        abono = abonoPedido.objects.filter(
            pedido_id=id_fac).aggregate(abono=Sum('valorabono'))

        if(int(total['total']) == int(abono['abono'])):
            p = Pedido.objects.get(pk=id_fac)
            p.estadopedido_id = 1
            p.save()
    informe = pedidoDetalle.objects.select_related(
        'pedido', 'producto',
        'pedido__cliente',
        'pedido__vivero').filter(
        pedido_id=id_fac)
    abonos = abonoPedido.objects.all().filter(pedido_id=id_fac)
    detalleAbonos = [{
        'valor': res.valorabono
    }for res in abonos]
    data = [{
        'pedido': res.pedido.pk,
        'cliente': res.pedido.cliente.nombre,
            'direccion': res.pedido.cliente.direccion,
            'nit': res.pedido.cliente.nit_cc,
            'telefono': res.pedido.cliente.telefono,
            'codigo': res.producto_id,
            'nombre': res.producto.nombre,
            'cantidad': res.cantidad,
            'iva': res.iva,
            'valor': res.val_unitario,
            'valneto': res.val_neto,
            'fecha': res.pedido.fecha,
            'vivero': res.pedido.vivero.nombre,
            'nit_vivero': res.pedido.vivero.identificacion


            }for res in informe]
    return JsonResponse({'data': data, 'abn': detalleAbonos}, safe=True)


def copiaAbono(request, id):
    vivero = request.session['vivero']
    idRecibo = request.body.decode('utf-8')
    recibo = abonoPedido.objects.select_related(
        'pedido', 'pedido__cliente', 'pedido__vivero'
    ).filter(pedido_id=id, pedido__vivero_id=vivero, pk=idRecibo)
    data = [{
        'abono': res.pk,
        'pedido': res.pedido.pk,
            'cliente': res.pedido.cliente.nombre,
            'direccion': res.pedido.cliente.direccion,
            'nit': res.pedido.cliente.nit_cc,
            'telefono': res.pedido.cliente.telefono,
            'fecha': res.fecha,
            'vivero': res.pedido.vivero.nombre,
            'nit_vivero': res.pedido.vivero.identificacion,
            'valorabono': res.valorabono


            }for res in recibo]
    return JsonResponse({'data': data}, safe=True)


def copiaPedido(request, id):
    vivero = request.session['vivero']
    informe = pedidoDetalle.objects.select_related(
        'pedido', 'producto',
        'pedido__cliente',
        'pedido__vivero').filter(
        pedido_id=id, pedido__vivero_id=vivero)
    abonos = abonoPedido.objects.all().filter(pedido_id=id)
    detalleAbonos = [{
        'valor': res.valorabono
    }for res in abonos]
    data = [{
        'pedido': res.pedido.pk,
        'cliente': res.pedido.cliente.nombre,
            'direccion': res.pedido.cliente.direccion,
            'nit': res.pedido.cliente.nit_cc,
            'telefono': res.pedido.cliente.telefono,
            'codigo': res.producto_id,
            'nombre': res.producto.nombre,
            'cantidad': res.cantidad,
            'iva': res.iva,
            'valor': res.val_unitario,
            'valneto': res.val_neto,
            'fecha': res.pedido.fecha,
            'vivero': res.pedido.vivero.nombre,
            'nit_vivero': res.pedido.vivero.identificacion


            }for res in informe]
    return JsonResponse({'data': data, 'abn': detalleAbonos}, safe=True)


def pdfFactura(request):
    pass


@login_required
def vivero_factura(request):

    template_name = 'ventas/vivero_factura.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


@login_required
def SelFacturas(request):
    template_name = 'ventas/seleccion_facturas.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


@login_required
def SearchFac(request,  fac):
    vivero = request.session['vivero']
    template_name = 'ventas/detailInvoice.html'
    detfac = Detalle_FacturaReal.objects.select_related(
        'factura', 'factura__cliente', 'factura__estado', 'producto').filter(
        factura__vivero_id=vivero, factura__codigo=fac)
    data = [{
        'factura': res.factura.codigo,
        'estado': res.factura.estado.estado,
        'fecha': str(res.factura.fecha),
        'cliente': res.factura.cliente.nombre,
        'identificacion': res.factura.cliente.nit_cc,
        'direccion': res.factura.cliente.direccion,
        'telefono': res.factura.cliente.telefono,
        'codigo': res.producto.pk,
        'nombre': res.producto.nombre,
        'cantidad': res.cantidad,
        'valor': res.val_unitario,
        'iva': res.iva,
        'total': res.val_neto,
        'vivero': res.factura.vivero_id


    }for res in detfac]

    return render(request, template_name, {'data': json.dumps(data)})


@login_required
def AllFacturas(request):
    template_name = 'ventas/allfacturas.html'
    data = Detalle_FacturaReal.objects.extra(
        select={'total': 'SELECT sum(ventas_detalle_facturareal.val_neto)  FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo',
                'abonos': 'SELECT sum(ventas_pagosfactura.valorabono) FROM ventas_pagosfactura WHERE ventas_pagosfactura.pedido_id = ventas_facturareal.codigo'}).select_related(
        'factura',
        'factura__estado',
        'factura__vivero',
        'factura__cliente').filter(
        factura__vivero_id=request.session['vivero']).distinct(
        'factura_id')

    fact = [{
        'id': res.factura.pk,
        'codigo': res.factura.codigo,
        'fecha': str(res.factura.fecha),
        'identificacion': res.factura.cliente.nit_cc,
        'nombre': res.factura.cliente.nombre,
        'estado': res.factura.estado.estado,
        'total': res.total,
        'abonos': res.abonos
    }for res in data]
    return render(request, template_name, {'data': json.dumps(fact)
                                           })


def nueva_factura(request):
    cliente_row = Cliente.objects.all()
    data = [{
        'id': res.pk,
        'cc': res.nit_cc,
        'nombre': res.nombre,

    } for res in cliente_row]
    template_name = 'ventas/nueva_factura.html'
    return render(request, template_name, {'data': json.dumps(data)})


def search_productos(request):
    dta = request.body.decode('utf-8')
    otra = json.loads(dta)
    prods = Producto.objects.select_related(
        'id_presentacion').filter(
            nombre__icontains=otra['valinput'], vivero_id=request.session['vivero'])[:9]
    if (otra['precio'] == 'generales'):

        data = [{
            'id': res.pk,
            'nombre': res.nombre,
            'iva': res.iva_porce,
            'precio': res.precio_venta,
            'presentacion': res.id_presentacion.tipo

        }for res in prods]
        return JsonResponse({'data': data}, safe=False)
    elif (otra['precio'] == 'compra'):
        data = [{
            'id': res.pk,
            'nombre': res.nombre,
            'iva': res.iva_porce,
            'precio': res.valor_real_compra,
            'presentacion': res.id_presentacion.tipo

        }for res in prods]
        return JsonResponse({'data': data}, safe=False)
    elif (otra['precio'] == 'mayor'):
        data = [{
            'id': res.pk,
            'nombre': res.nombre,
            'iva': res.iva_porce,
            'precio': res.precioxmayor,
            'presentacion': res.id_presentacion.tipo

        }for res in prods]
        return JsonResponse({'data': data}, safe=False)


def save_facturaReal(request):
    data = request.body.decode('utf-8')
    datos = json.loads(data)

    estado = EstadoFactura.objects.all().filter(estado='abierta')
    rows = FacturaReal.objects.filter(
        vivero_id=request.session['vivero']).count()
    num = Numeracion.objects.all().filter(vivero_id=request.session['vivero'])
    nume = [{
        'resu': res.resolucion,
        'fecha': res.fecha,
        'ini': res.num_ini,
        'fin': res.num_fin
    }for res in num]
    if rows == 0:
        c = Cliente.objects.all().filter(pk=datos['cliente']['id'])
        f = FacturaReal(codigo=num[0].num_ini,
                        vivero_id=request.session['vivero'],
                        estado_id=estado[0].pk,
                        cliente_id=c[0].pk)

        f.save()

        id_fac = f.codigo
        for res in datos['datos']:
            Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                               cantidad=int(res['cantidad']),
                                               producto_id=res['id'],
                                               val_unitario=int(res['precio']),
                                               iva=res['iva'],
                                               val_neto=int(res['precio']) * res(res['cantidad']))
            stock = Almacen.objects.get(
                producto_id=res['id'], vivero_id=request.session['vivero'])
            if stock.stock > 0:

                rest = int(stock.stock) - int(res['cantidad'])
                print(rest)
                stock.stock = rest
                stock.save()
        if(len(datos['pago']) != 0):

            PagosFactura.objects.create(
                pedido_id=id_fac, valorabono=datos['pago'])
            pago = PagosFactura.objects.annotate(
                total=Sum('valorabono')).filter(pedido_id=id_fac)
            detalle = Detalle_FacturaReal.objects.annotate(
                total=Sum('val_neto')).filter(factura_id=id_fac)
            if(pago[0].total == detalle[0].total):
                esta = EstadoFactura.objects.all().filter(estado='cerrada')
                update = FacturaReal.objects.get(pk=id_fac)
                update.estado_id = esta[0].pk
                update.save()

        informe = Detalle_FacturaReal.objects.select_related(
            'factura', 'producto',
            'producto__id_presentacion',
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
                'presentacion': res.producto.id_presentacion.tipo,
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

        c = Cliente.objects.all().filter(pk=int(datos['cliente']['id']))
        ultimo = FacturaReal.objects.latest('codigo')
        numeracion = 1 + ultimo.codigo
        f = FacturaReal(codigo=numeracion,
                        vivero_id=request.session['vivero'],
                        estado_id=estado[0].pk,
                        cliente_id=c[0].pk)

        f.save()
        id_fac = f.codigo

        for res in datos['datos']:
            Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                               cantidad=int(res['cantidad']),
                                               producto_id=res['id'],
                                               val_unitario=int(
                                                   res['precio']),
                                               iva=res['iva'],
                                               val_neto=int(res['precio']) * int(res['cantidad']))
            stock = Almacen.objects.get(
                producto_id=res['id'], vivero_id=request.session['vivero'])
            if stock.stock > 0:

                rest = int(stock.stock) - int(res['cantidad'])
                print(rest)
                stock.stock = rest
                stock.save()
        if(len(datos['pago']) != 0):
            PagosFactura.objects.create(
                pedido_id=id_fac, valorabono=datos['pago'])
            pago = PagosFactura.objects.annotate(
                total=Sum('valorabono')).filter(pedido_id=id_fac)
            detalle = Detalle_FacturaReal.objects.annotate(
                total=Sum('val_neto')).filter(factura_id=id_fac)
            if(pago[0].total == detalle[0].total):
                esta = EstadoFactura.objects.all().filter(estado='cerrada')
                update = FacturaReal.objects.get(pk=id_fac)
                update.estado_id = esta[0].pk
                update.save()
        informe = Detalle_FacturaReal.objects.select_related(
            'factura', 'producto',
            'producto__id_presentacion',
            'factura__cliente').filter(
            factura_id=id_fac)
        data = [{
            'factura': res.factura.codigo,
            'cliente': res.factura.cliente.nombre,
            'nit': res.factura.cliente.nit_cc,
            'direccion': res.factura.cliente.direccion,
            'telefono': res.factura.cliente.telefono,
            'codigo': res.producto_id,
                'nombre': res.producto.nombre,
                'presentacion': res.producto.id_presentacion.tipo,
                'cantidad': res.cantidad,
                'iva': res.iva,
                'valor': res.val_unitario,
                'valneto': res.val_neto,
                'fecha': res.factura.fecha,
                'vivero': res.factura.vivero.nombre,
                'nit_vivero': res.factura.vivero.identificacion

                }for res in informe]
        return JsonResponse({'data': data, 'nume': nume}, safe=True)


def copiaFactura(request, fac):
    vivero = request.session['vivero']
    num = Numeracion.objects.all().filter(vivero_id=vivero)
    nume = [{
        'resu': res.resolucion,
        'fecha': res.fecha,
        'ini': res.num_ini,
        'fin': res.num_fin
    }for res in num]
    informe = Detalle_FacturaReal.objects.select_related(
        'factura', 'producto',
        'producto__id_presentacion',
        'factura__cliente',
        'factura__vivero').filter(
        factura_id=fac, factura__vivero_id=vivero)

    data = [{
        'factura': res.factura.codigo,
        'cliente': res.factura.cliente.nombre,
        'direccion': res.factura.cliente.direccion,
        'nit': res.factura.cliente.nit_cc,
        'telefono': res.factura.cliente.telefono,
        'codigo': res.producto_id,
        'nombre': res.producto.nombre,
        'presentacion': res.producto.id_presentacion.tipo,
        'cantidad': res.cantidad,
        'iva': res.iva,
        'valor': res.val_unitario,
        'valneto': res.val_neto,
        'fecha': res.factura.fecha,
        'vivero': res.factura.vivero.nombre,
        'nit_vivero': res.factura.vivero.identificacion


    }for res in informe]
    return JsonResponse({'data': data, 'nume': nume}, safe=True)


def selViveroPro(request):
    template_name = 'ventas/seleccion_productos.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def getProductos(request, pro):
    template_name = 'ventas/productos.html'
    data = Producto.objects.select_related('id_categoria',
                                           'id_presentacion'
                                           ).filter(
        vivero=pro
    ).order_by('nombre')
    res = [{
        'nombre': response.nombre,
        'precioventa': response.precio_venta,
        'preciocompra': response.precio_compra,
        'categoria': response.id_categoria.nomb_cate,
        'presentacion': response.id_presentacion.tipo,
        'precioxmayor': response.precioxmayor
    }for response in data]
    return render(request, template_name, {'data': json.dumps(res)})


def clienteFactura(request):
    data = request.body.decode('utf-8')
    cliente = Cliente.objects.all().filter(
        Q(nombre__icontains=data) | Q(nit_cc__icontains=data))[:5]
    items = [{
        'id': res.pk,
        'nombre': res.nombre,
        'iden': res.nit_cc

    }for res in cliente]
    return JsonResponse({'data': items}, safe=True)


def ViveroRem(request):
    template_name = 'ventas/seleccion_remisiones.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def remionesAll(request):
    template_name = 'ventas/allremisiones.html'
    data = detalleRemison.objects.extra(
        select={'total':
                'SELECT sum(ventas_detalleremison.val_neto)  FROM ventas_detalleremison WHERE ventas_detalleremison.remision_id = ventas_remision.id'}).select_related(
        'remision',
        'remision__estado',
        'remision__vivero',
        'remision__cliente').filter(
        remision__vivero_id=request.session['vivero']
    ).distinct(
        'remision_id')
    rem = [{
        'id': res.remision.pk,
        'fecha': str(res.remision.fecha),
        'identificacion': res.remision.cliente.nit_cc,
        'nombre': res.remision.cliente.nombre,
        'estado': res.remision.estado.estado,
        'total': res.total
    }for res in data]
    return render(request, template_name, {'data': json.dumps(rem)})


class nuevaRemision(TemplateView):
    template_name = 'ventas/nuevaremision.html'


def remisionCliente(request):
    if(len(request.POST['data']) > 0):
        data = Cliente.objects.all().filter(
            nombre__icontains=request.POST['data'])[:9]
        result = [{
            'id': res.pk,
            'nombre': res.nombre,
            'cc': res.nit_cc
        }for res in data]
        return JsonResponse({'data': result}, safe=True)
    else:
        return JsonResponse({'error': 'no hay registros'}, safe=True)


def remisionProductos(request):
    if (len(request.POST['data']) > 0):
        prods = Producto.objects.select_related(
            'id_presentacion').filter(
                nombre__icontains=request.POST['data'],
                vivero_id=request.session['vivero'])[:9]
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


def detalleRemision(request, remision_id):

    template_name = "ventas/detalleremision.html"
    rem = detalleRemison.objects.select_related('remision',
                                                'producto', 'producto__id_presentacion',
                                                'remision__cliente',
                                                'remision__vivero',
                                                'remision__estado'
                                                ).filter(
        remision__pk=remision_id, remision__vivero=request.session['vivero'])

    data = [{
        'remision': res.remision.pk,
        'estado': res.remision.estado.estado,
        'cliente': res.remision.cliente.nombre,
        'direccion': res.remision.cliente.direccion,
        'nit': res.remision.cliente.nit_cc,
        'telefono': res.remision.cliente.telefono,
        'codigo': res.producto_id,
        'nombre': res.producto.nombre,
        'presentacion': res.producto.id_presentacion.tipo,
        'cantidad': res.cantidad,
        'iva': res.iva,
        'valor': res.val_unitario,
        'valneto': res.val_neto,
        'fecha': str(res.remision.fecha),
        'vivero': res.remision.vivero.nombre,
        'nit_vivero': res.remision.vivero.identificacion


    }for res in rem]

    return render(request, template_name, {'data': json.dumps(data)})


def copiaRemision(request, remision_id):

    informe = detalleRemison.objects.select_related(
        'remision', 'producto',
        'producto__id_presentacion',
        'remision__cliente',
        'remision__vivero').filter(
        remision_id=remision_id, remision__vivero=request.session['vivero'])

    data = [{
        'remision': res.remision.pk,
        'cliente': res.remision.cliente.nombre,
        'direccion': res.remision.cliente.direccion,
        'nit': res.remision.cliente.nit_cc,
        'telefono': res.remision.cliente.telefono,
        'codigo': res.producto_id,
        'nombre': res.producto.nombre,
        'presentacion': res.producto.id_presentacion.tipo,
        'cantidad': res.cantidad,
        'iva': res.iva,
        'valor': res.val_unitario,
        'valneto': res.val_neto,
        'fecha': res.remision.fecha,
        'vivero': res.remision.vivero.nombre,
        'nit_vivero': res.remision.vivero.identificacion


    }for res in informe]
    return JsonResponse({'data': data}, safe=True)


def saveRemision(request):
    data = request.body.decode('utf-8')
    datos = json.loads(data)
    estado = EstadoFactura.objects.all().filter(estado='cerrada')
    c = Cliente.objects.all().filter(nit_cc=datos['cliente']['id'])
    f = Remision(vivero_id=request.session['vivero'],
                 estado_id=estado[0].pk,
                 cliente_id=c[0].pk)

    f.save()
    id_fac = f.pk
    for res in datos['res']:
        detalleRemison.objects.create(remision_id=id_fac,
                                      cantidad=res['cantidad'],
                                      producto_id=res['codigo'],
                                      val_unitario=res['valorU'],
                                      iva=res['iva'],
                                      val_neto=res['valorN'])
    informe = detalleRemison.objects.select_related(
        'remision', 'producto',
        'producto__id_presentacion',
        'remision__cliente',
        'remision__vivero').filter(
        remision_id=id_fac)
    data = [{
        'remision': res.remision.pk,
        'cliente': res.remision.cliente.nombre,
        'direccion': res.remision.cliente.direccion,
        'nit': res.remision.cliente.nit_cc,
        'telefono': res.remision.cliente.telefono,
        'codigo': res.producto_id,
        'nombre': res.producto.nombre,
        'presentacion': res.producto.id_presentacion.tipo,
        'cantidad': res.cantidad,
        'iva': res.iva,
        'valor': res.val_unitario,
        'valneto': res.val_neto,
        'fecha': res.remision.fecha,
        'vivero': res.remision.vivero.nombre,
        'nit_vivero': res.remision.vivero.identificacion


    }for res in informe]
    return JsonResponse({'data': data}, safe=True)


def ventasPOS(request):
    template_name = 'ventas/pos.html'
    return render(request, template_name)


def viveroPos(request):
    template_name = 'ventas/posvivero.html'
    data = Vivero.objects.all()
    return render(request, template_name, {'data': data})


def productosPos(request):
    data = Producto.objects.select_related(
        'id_presentacion').filter(
        nombre__icontains=request.body.decode('utf-8'),
        vivero_id=request.session['vivero'])[:4]
    items = [{
        'id': res.pk,
        'nombre': res.nombre,
        'iva': res.iva_porce,
        'precio': res.precio_venta,
        'presentacion': res.id_presentacion.tipo
    }for res in data]
    return JsonResponse({'data': items}, safe=True)


def clientePos(request):
    data = request.body.decode('utf-8')
    cliente = Cliente.objects.all().filter(nombre__icontains=data)[:5]
    items = [{
        'id': res.pk,
        'nombre': res.nombre,
        'iden': res.nit_cc

    }for res in cliente]
    return JsonResponse({'data': items}, safe=True)


def savePos(request):
    data = request.body.decode('utf-8')
    datos = json.loads(data)

    estado = EstadoFactura.objects.all().filter(estado='abierta')
    rows = FacturaReal.objects.filter(
        vivero_id=request.session['vivero']).count()
    num = Numeracion.objects.all().filter(vivero_id=request.session['vivero'])
    nume = [{
        'resu': res.resolucion,
        'fecha': res.fecha,
        'ini': res.num_ini,
        'fin': res.num_fin
    }for res in num]
    if rows == 0:
        if(len(datos['cliente']) == 0):
            c = Cliente.objects.all().filter(nit_cc='POS')
            f = FacturaReal(codigo=num[0].num_ini,
                            vivero_id=request.session['vivero'],
                            estado_id=estado[0].pk,
                            cliente_id=c[0].pk)

            f.save()

            id_fac = f.codigo
            for res in datos['datos']:
                Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                                   cantidad=int(
                                                       res['cantidad']),
                                                   producto_id=res['id'],
                                                   val_unitario=int(
                                                       res['precio']),
                                                   iva=res['iva'],
                                                   val_neto=int(res['precio']) * res(res['cantidad']))
                stock = Almacen.objects.get(
                    producto_id=res['id'], vivero_id=request.session['vivero'])
                if stock.stock > 0:

                    rest = int(stock.stock) - int(res['cantidad'])
                    print(rest)
                    stock.stock = rest
                    stock.save()
            if(len(datos['pago']) != 0):

                PagosFactura.objects.create(
                    pedido_id=id_fac, valorabono=datos['pago'])
                pago = PagosFactura.objects.annotate(
                    total=Sum('valorabono')).filter(pedido_id=id_fac)
                detalle = Detalle_FacturaReal.objects.annotate(
                    total=Sum('val_neto')).filter(factura_id=id_fac)
                if(pago[0].total == detalle[0].total):
                    esta = EstadoFactura.objects.all().filter(estado='cerrada')
                    update = FacturaReal.objects.get(pk=id_fac)
                    update.estado_id = esta[0].pk
                    update.save()

                informe = Detalle_FacturaReal.objects.select_related(
                    'factura', 'producto',
                    'producto__id_presentacion',
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
                    'presentacion': res.producto.id_presentacion.tipo,
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
                c = Cliente.objects.all().filter(pk=datos['cliente']['id'])
                f = FacturaReal(codigo=num[0].num_ini,
                                vivero_id=request.session['vivero'],
                                estado_id=estado[0].pk,
                                cliente_id=c[0].pk)

                f.save()

                id_fac = f.codigo
                for res in datos['venta']:
                    Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                                       cantidad=int(
                                                           res['cantidad']),
                                                       producto_id=res['id'],
                                                       val_unitario=int(
                                                           res['precio']),
                                                       iva=res['iva'],
                                                       val_neto=int(res['precio']) * res(res['cantidad']))
                    stock = Almacen.objects.get(
                        producto_id=res['id'], vivero_id=request.session['vivero'])
                    if stock.stock > 0:

                        rest = int(stock.stock) - int(res['cantidad'])
                        stock.stock = rest
                        stock.save()
                if(len(datos['pago']) != 0):

                    PagosFactura.objects.create(
                        pedido_id=id_fac, valorabono=datos['pago'])
                    pago = PagosFactura.objects.annotate(
                        total=Sum('valorabono')).filter(pedido_id=id_fac)
                    detalle = Detalle_FacturaReal.objects.annotate(
                        total=Sum('val_neto')).filter(factura_id=id_fac)
                    if(pago[0].total == detalle[0].total):
                        esta = EstadoFactura.objects.all().filter(estado='cerrada')
                        update = FacturaReal.objects.get(pk=id_fac)
                        update.estado_id = esta[0].pk
                        update.save()

                informe = Detalle_FacturaReal.objects.select_related(
                    'factura', 'producto',
                    'producto__id_presentacion',
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
                        'presentacion': res.producto.id_presentacion.tipo,
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

        if(len(datos['cliente']) == 0):
            c = Cliente.objects.all().filter(nit_cc='POS')
            ultimo = FacturaReal.objects.latest('codigo')

            numeracion = 1 + ultimo.codigo
            c = Cliente.objects.all().filter(nit_cc='POS')
            f = FacturaReal(codigo=numeracion,
                            vivero_id=request.session['vivero'],
                            estado_id=estado[0].pk,
                            cliente_id=c[0].pk)

            f.save()

            id_fac = f.codigo
            for res in datos['venta']:
                Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                                   cantidad=int(
                                                       res['cantidad']),
                                                   producto_id=res['id'],
                                                   val_unitario=int(
                                                       res['precio']),
                                                   iva=res['iva'],
                                                   val_neto=int(res['precio']) * int(res['cantidad']))
                stock = Almacen.objects.get(
                    producto_id=res['id'], vivero_id=request.session['vivero'])
                if stock.stock > 0:

                    rest = int(stock.stock) - int(res['cantidad'])
                    stock.stock = rest
                    stock.save()
            if(len(datos['pago']) != 0):
                print(len(datos['pago']))
                PagosFactura.objects.create(
                    pedido_id=id_fac, valorabono=datos['pago'])
                pago = PagosFactura.objects.annotate(
                    total=Sum('valorabono')).filter(pedido_id=id_fac)
                detalle = Detalle_FacturaReal.objects.annotate(
                    total=Sum('val_neto')).filter(factura_id=id_fac)
                if(pago[0].total == detalle[0].total):
                    esta = EstadoFactura.objects.all().filter(estado='cerrada')
                    update = FacturaReal.objects.get(pk=id_fac)
                    update.estado_id = esta[0].pk
                    update.save()

            informe = Detalle_FacturaReal.objects.select_related(
                'factura', 'producto',
                'producto__id_presentacion',
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
                    'presentacion': res.producto.id_presentacion.tipo,
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
            c = Cliente.objects.all().filter(pk=datos['cliente']['id'])
            ultimo = FacturaReal.objects.latest('codigo')

            numeracion = 1 + ultimo.codigo
            f = FacturaReal(codigo=numeracion,
                            vivero_id=request.session['vivero'],
                            estado_id=estado[0].pk,
                            cliente_id=c[0].pk)

            f.save()

            id_fac = f.codigo
            for res in datos['venta']:
                print(res['id'])
                Detalle_FacturaReal.objects.create(factura_id=id_fac,
                                                   cantidad=int(
                                                       res['cantidad']),
                                                   producto_id=res['id'],
                                                   val_unitario=int(
                                                       res['precio']),
                                                   iva=res['iva'],
                                                   val_neto=int(res['precio']) * int(res['cantidad']))
                stock = Almacen.objects.get(
                    producto_id=res['id'], vivero_id=request.session['vivero'])
                if stock.stock > 0:

                    rest = int(stock.stock) - int(res['cantidad'])
                    stock.stock = rest
                    stock.save()
            if(len(datos['pago']) != 0):

                PagosFactura.objects.create(
                    pedido_id=id_fac, valorabono=datos['pago'])
                pago = PagosFactura.objects.annotate(
                    total=Sum('valorabono')).filter(pedido_id=id_fac)
                detalle = Detalle_FacturaReal.objects.annotate(
                    total=Sum('val_neto')).filter(factura_id=id_fac)
                if(pago[0].total == detalle[0].total):
                    esta = EstadoFactura.objects.all().filter(estado='cerrada')
                    update = FacturaReal.objects.get(pk=id_fac)
                    update.estado_id = esta[0].pk
                    update.save()

            informe = Detalle_FacturaReal.objects.select_related(
                'factura', 'producto',
                'producto__id_presentacion',
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
                'presentacion': res.producto.id_presentacion.tipo,
                'cantidad': res.cantidad,
                'iva': res.iva,
                'valor': res.val_unitario,
                'valneto': res.val_neto,
                'fecha': res.factura.fecha,
                'vivero': res.factura.vivero.nombre,
                'nit_vivero': res.factura.vivero.identificacion


            }for res in informe]
            return JsonResponse({'data': data, 'nume': nume}, safe=True)
