# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-09-19 16:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edegal', '0006_auto_20170918_2017'),
    ]

    operations = [
        migrations.AddField(
            model_name='album',
            name='body',
            field=models.TextField(blank=True, default='', help_text='Albumilla voi olla tekstisisältöä, jolloin se näytetään albuminäkymän yläosassa ennen ala-albumeja ja kuvia.', verbose_name='Tekstisisältö'),
        ),
    ]
