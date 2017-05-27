from django.conf.urls import url
from .views import (ventasReport, report_ventas,
                    report_remisiones)

urlpatterns = [

    url(r'^ventas/$',
        ventasReport.as_view(), name='reportventas'),
    url(r'^ventas/filtro/$',
        report_ventas, name='filtroventas'),
    url(r'^remisiones/$',
        report_remisiones.as_view(), name='reportremisiones'),


]
