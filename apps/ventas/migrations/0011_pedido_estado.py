# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-24 20:58
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0010_auto_20170824_1537'),
    ]

    operations = [
        migrations.AddField(
            model_name='pedido',
            name='estado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='ventas.estadoPedido'),
        ),
    ]
