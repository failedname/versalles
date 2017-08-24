# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-24 20:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0007_detalleuser'),
    ]

    operations = [
        migrations.CreateModel(
            name='abonoPedido',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(auto_now_add=True)),
                ('valorabono', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='detallePedido',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('descuento', models.IntegerField()),
                ('val_unitario', models.IntegerField()),
                ('iva', models.IntegerField()),
                ('val_neto', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Cliente')),
                ('vivero', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Vivero')),
            ],
        ),
        migrations.AddField(
            model_name='detallepedido',
            name='pedido',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Pedido'),
        ),
        migrations.AddField(
            model_name='detallepedido',
            name='producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Producto'),
        ),
        migrations.AddField(
            model_name='abonopedido',
            name='pedido',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Pedido'),
        ),
    ]
