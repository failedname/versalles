# -*- coding: utf-8 -*-
from django.shortcuts import render

from django.views.generic import TemplateView


class Contacts(TemplateView):
    template_name = "contactos/contactos.html"
