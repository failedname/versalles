"""versalles URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from apps.dashboard import urls as dash_url
from apps.ventas import urls as ventas_url
from apps.compras import urls as compras_url
from apps.reportes import urls as reportes_url
from apps.contactos import urls as contactos_url
from apps.inventario import urls as inventario_url

urlpatterns = [
    url(r'^admin/', include('smuggler.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(dash_url, namespace='dashboard')),
    url(r'^ventas/', include(ventas_url, namespace='ventas')),
    url(r'^compras/', include(compras_url, namespace='compras')),
    url(r'^reportes/', include(reportes_url, namespace='reportes')),
    url(r'^contactos/', include(contactos_url, namespace='contactos')),
    url(r'^inventario/', include(inventario_url, namespace='inventario')),
]
