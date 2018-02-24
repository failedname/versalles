from django.conf.urls import url
from .views import (ventasReport, report_ventas,
                    report_remisiones, export_ventas, ReportCat)

urlpatterns = [

    url(r'^ventas/$',
        ventasReport.as_view(), name='reportventas'),
    url(r'^ventas/filtro/$',
        report_ventas, name='filtroventas'),
    url(r'^ventas/excel/(?P<start>[\w-]+)/(?P<end>[\w-]+)/$',
        export_ventas, name='exportventas'),
    url(r'^remisiones/$',
        report_remisiones.as_view(), name='reportremisiones'),
    url(r'^categoria/$',
        ReportCat.as_view(), name='reportcategoria'),


]
