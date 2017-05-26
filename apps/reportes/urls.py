from django.conf.urls import url
from .views import ventasReport

urlpatterns = [

    url(r'^ventas/$',
        ventasReport.as_view(), name='reportventas'),


]
