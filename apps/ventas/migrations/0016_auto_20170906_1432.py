# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-06 19:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0015_auto_20170827_2055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detallepedido',
            name='val_neto',
            field=models.IntegerField(null=True),
        ),
    ]