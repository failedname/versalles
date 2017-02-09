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
from django.conf.urls import url
from django.contrib.auth.views import login
from django.contrib.auth.views import logout_then_login
from .views import PanelView

urlpatterns = [
    url(r'^$', login,
        {'template_name': 'dashboard/login.html'}, name='login'),
    url(r'^cerrar$', logout_then_login, name='logout'),
    url(r'^panel/$', PanelView, name='panel'),

]
