from django.conf.urls import url
from .views import ventasReport, report_ventas

urlpatterns = [

    url(r'^ventas/$',
        ventasReport.as_view(), name='reportventas'),
    url(r'^ventas/filtro/$',
        report_ventas, name='filtroventas'),


]
