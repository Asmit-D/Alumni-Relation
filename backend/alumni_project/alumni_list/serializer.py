from rest_framework import serializers
from django.conf import settings
from . models import *

class EntranceExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntranceExam
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class WorkProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkProfile
        fields = '__all__'

class AlumniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = '__all__'