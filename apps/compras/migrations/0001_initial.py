# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-09 03:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ventas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Compra',
            fields=[
                ('codigo', models.IntegerField(primary_key=True, serialize=False)),
                ('fecha', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='DetalleCompra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField()),
                ('valor_compra', models.IntegerField()),
                ('iva', models.IntegerField()),
                ('valor_neto', models.IntegerField()),
                ('descuento', models.IntegerField(null=True)),
                ('compra', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='compras.Compra')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Producto')),
            ],
        ),
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('identificacion', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('telefono', models.IntegerField()),
                ('direccion', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name_plural': 'Proveedores',
                'verbose_name': 'Proveedor',
            },
        ),
        migrations.AddField(
            model_name='compra',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='compras.Proveedor'),
        ),
        migrations.AddField(
            model_name='compra',
            name='vivero',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ventas.Vivero'),
        ),
    ]
