# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-24 20:59
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0011_pedido_estado'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detallepedido',
            name='descuento',
        ),
    ]