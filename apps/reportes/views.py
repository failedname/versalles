from django.shortcuts import render
from django.views.generic import TemplateView


class ventasReport(TemplateView):
    template_name = 'reportes/ventas.html'
