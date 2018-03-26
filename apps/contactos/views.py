# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic import TemplateView
from ..ventas.models import Cliente


class Contacts(TemplateView):
    template_name = "contactos/contactos.html"

    def post(self, request, *args, **kwargs):
        clientes = Cliente.objects.all()
        data = [{
            'pk': res.pk,
            'nit': res.nit_cc,
            'nombre': res.nombre,
            'telefono': res.telefono,
            'direccion': res.direccion

        }for res in clientes]
        return JsonResponse({'data': data}, safe=True)


class Proveedores(TemplateView):
    template_name = "contactos/proveedores.html"
