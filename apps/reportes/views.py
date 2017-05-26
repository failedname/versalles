from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import JsonResponse
from apps.ventas.models import Detalle_FacturaReal
import json


class ventasReport(TemplateView):
    template_name = 'reportes/ventas.html'


def report_ventas(request):
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
