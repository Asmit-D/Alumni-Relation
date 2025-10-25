from django.db import models
from multiselectfield import MultiSelectField
import uuid

class Alumni(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    dp = models.URLField(blank=True, null=True)
    batch = models.IntegerField()
    email = models.EmailField(unique=True)
    twitter = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    
    DOMAIN_CHOICES = [
        ('Startup', 'Startup'),
        ('Core', 'Core'),
        ('Govt Service', 'Govt Service'),
        ('Analog', 'Analog'),
        ('Digital', 'Digital'),
        ('Management', 'Management'),
    ]
    domains = MultiSelectField(max_length=100, choices=DOMAIN_CHOICES)
    
    residence = models.CharField(max_length=255, blank=True, null=True)
    current_company = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.name} ({self.id})'

class EntranceExam(models.Model):
    id = models.OneToOneField(Alumni, on_delete=models.CASCADE, primary_key=True)
    data = models.JSONField()

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.id.name} ({self.id})'

class Education(models.Model):
    id = models.OneToOneField(Alumni, on_delete=models.CASCADE, primary_key=True)
    data = models.JSONField()

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.id.name} ({self.id})'

class WorkProfile(models.Model):
    id = models.OneToOneField(Alumni, on_delete=models.CASCADE, primary_key=True)
    data = models.JSONField()

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return f'{self.id.name} ({self.id})'
