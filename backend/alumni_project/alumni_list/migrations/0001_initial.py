# Generated by Django 5.1.6 on 2025-03-01 15:34

import django.db.models.deletion
import multiselectfield.db.fields
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alumni',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('dp', models.ImageField(blank=True, null=True, upload_to='profile_pics/')),
                ('batch', models.IntegerField()),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('twitter', models.URLField(blank=True, null=True)),
                ('linkedin', models.URLField(blank=True, null=True)),
                ('domains', multiselectfield.db.fields.MultiSelectField(choices=[('Startup', 'Startup'), ('Core', 'Core'), ('Govt Service', 'Govt Service'), ('Analog', 'Analog'), ('Digital', 'Digital'), ('Management', 'Management')], max_length=100)),
                ('residence', models.CharField(blank=True, max_length=255, null=True)),
                ('current_company', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='alumni_list.alumni')),
                ('data', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='EntranceExam',
            fields=[
                ('id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='alumni_list.alumni')),
                ('data', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='WorkProfile',
            fields=[
                ('id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='alumni_list.alumni')),
                ('data', models.JSONField()),
            ],
        ),
    ]
