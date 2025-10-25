from django.urls import path
from .views import *

urlpatterns = [
    path('', AlumniList.as_view(), name='alumni_list'),
    path('<uuid:pk>/', Alumnidetail.as_view(), name='alumni_details'),
    path('detail/<uuid:pk>/', Alumniview.as_view(), name='alumni_update_delete'),
    path('entranceexam/<uuid:pk>/', EntranceExamview.as_view(), name='entrance_exam_details'),
    path('education/<uuid:pk>/', Educationview.as_view(), name='education_details'),
    path('workprofile/<uuid:pk>/', WorkProfileview.as_view(), name='work_profile_details'),
    path('cloudinary-signature/', CloudinarySignatureView.as_view(), name='cloudinary-signature'),
]
