from django.conf.urls import url
from .views import Contacts, Proveedores
urlpatterns = [
    url(r'^$', Contacts.as_view(), name='clientes'),
    url(r'^proveedores/$', Proveedores.as_view(), name='proveedores'),

]
