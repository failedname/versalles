from django.conf.urls import url
from .views import Contacts
urlpatterns = [
    url(r'^$', Contacts.as_view(), name='contactos'),

]
