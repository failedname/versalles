# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-02-11 18:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0026_auto_20180211_1300'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='descripcion',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
