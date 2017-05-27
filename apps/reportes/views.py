from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from apps.ventas.models import Detalle_FacturaReal, detalleUser, detalleRemison

import json


@method_decorator(login_required, name='dispatch')
class ventasReport(TemplateView):
    template_name = 'reportes/ventas.html'


def report_ventas(request):
    if 'vivero' in request.session:
        fechas = json.loads(request.body)

        data = Detalle_FacturaReal.objects.extra(
            select={'total': 'SELECT sum(ventas_detalle_facturareal.val_neto)  FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo',
                    'iva': 'SELECT sum(ventas_detalle_facturareal.iva) FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo'
                    }).select_related(
            'factura',
            'factura__estado',
            'factura__vivero',
            'factura__cliente').filter(
            factura__vivero_id=request.session['vivero'], factura__fecha__gte=fechas['start'], factura__fecha__lte=fechas['end'], factura__estado__estado='cerrada').distinct(
            'factura_id')
        fact = [{
            'id': res.factura.pk,
            'codigo': res.factura.codigo,
            'fecha': str(res.factura.fecha),
            'identificacion': res.factura.cliente.nit_cc,
            'nombre': res.factura.cliente.nombre,
            'estado': res.factura.estado.estado,
            'totaliva': res.iva,
            'total': res.total
        }for res in data]
        return JsonResponse({'data': fact}, safe=True)
    else:
        vivero = detalleUser.objects.get(usuario__pk=request.user.id)
        request.session['vivero'] = vivero.vivero.id
        fechas = json.loads(request.body)

        data = Detalle_FacturaReal.objects.extra(
            select={'total': 'SELECT sum(ventas_detalle_facturareal.val_neto)  FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo',
                    'iva': 'SELECT sum(ventas_detalle_facturareal.iva) FROM ventas_detalle_facturareal WHERE ventas_detalle_facturareal.factura_id = ventas_facturareal.codigo'
                    }).select_related(
            'factura',
            'factura__estado',
            'factura__vivero',
            'factura__cliente').filter(
            factura__vivero_id=request.session['vivero'], factura__fecha__gte=fechas['start'], factura__fecha__lte=fechas['end'], factura__estado__estado='cerrada').distinct(
            'factura_id')
        fact = [{
            'id': res.factura.pk,
            'codigo': res.factura.codigo,
            'fecha': str(res.factura.fecha),
            'identificacion': res.factura.cliente.nit_cc,
            'nombre': res.factura.cliente.nombre,
            'estado': res.factura.estado.estado,
            'totaliva': res.iva,
            'total': res.total
        }for res in data]
        return JsonResponse({'data': fact}, safe=True)


@method_decorator(login_required, name='dispatch')
class report_remisiones(TemplateView):
    template_name = 'reportes/remisiones.html'

    def post(self, request, *args, **kwargs):
        if 'vivero' in request.session:
            fechas = json.loads(request.body)

            data = detalleRemison.objects.extra(
                select={'total': 'SELECT sum(ventas_detalleremison.val_neto)  FROM ventas_detalleremison WHERE ventas_detalleremison.remision_id = ventas_remision.id',
                        'iva': 'SELECT sum(ventas_detalleremison.iva) FROM ventas_detalleremison WHERE ventas_detalleremison.remision_id = ventas_remision.id'
                        }).select_related(
                'remision',
                'remision__estado',
                'remision__vivero',
                'remision__cliente').filter(
                remision__vivero_id=request.session['vivero'], remision__fecha__gte=fechas['start'], remision__fecha__lte=fechas['end'], remision__estado__estado='cerrada').distinct(
                'remision_id')
            fact = [{
                'codigo': res.remision.pk,
                'fecha': str(res.remision.fecha),
                'identificacion': res.remision.cliente.nit_cc,
                'nombre': res.remision.cliente.nombre,
                'estado': res.remision.estado.estado,
                'totaliva': res.iva,
                'total': res.total
            }for res in data]
            return JsonResponse({'data': fact}, safe=True)
        else:
            vivero = detalleUser.objects.get(usuario__pk=request.user.id)
            request.session['vivero'] = vivero.vivero.id
            fechas = json.loads(request.body)

            data = detalleRemison.objects.extra(
                select={'total': 'SELECT sum(ventas_detalleremison.val_neto)  FROM ventas_detalleremison WHERE ventas_detalleremison.remision_id = ventas_remision.id',
                        'iva': 'SELECT sum(ventas_detalleremison.iva) FROM ventas_detalleremison WHERE ventas_detalleremison.remision_id = ventas_remision.id'
                        }).select_related(
                'remision',
                'remision__estado',
                'remision__vivero',
                'remision__cliente').filter(
                remision__vivero_id=request.session['vivero'], remision__fecha__gte=fechas['start'], remision__fecha__lte=fechas['end'], remision__estado__estado='cerrada').distinct(
                'remision_id')
            fact = [{
                'codigo': res.remision.pk,
                'fecha': str(res.remision.fecha),
                'identificacion': res.remision.cliente.nit_cc,
                'nombre': res.remision.cliente.nombre,
                'estado': res.remision.estado.estado,
                'totaliva': res.iva,
                'total': res.total
            }for res in data]
            return JsonResponse({'data': fact}, safe=True)
