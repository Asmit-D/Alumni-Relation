from django.contrib import admin
from .models import Alumni, EntranceExam, Education, WorkProfile

# Register your models here.
admin.site.register(Alumni)
admin.site.register(EntranceExam)
admin.site.register(Education)
admin.site.register(WorkProfile)