from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
import cloudinary.utils
from django.conf import settings
from .models import *
from .serializer import *
from .permissions import IsEditor
class AlumniList(APIView):     #This class is used to get all the alumni details and to add new alumni details with some or all of the entrance exam, education and work profile details

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsEditor()]

    def get(self, request):
        alumni = Alumni.objects.all().order_by("name")

        paginator = PageNumberPagination()
        paginator.page_size = 10

        search = request.GET.get("search", "")
        domains = request.GET.get("domains", "")

        # Filter by search
        if search:
            alumni = alumni.filter(name__icontains=search) | alumni.filter(current_company__icontains=search) | alumni.filter(residence__icontains=search)

        # Filter by multiple domains
        if domains:
            domain_list = domains.split(",")
            filtered_alumni = set()
            for domain in domain_list:
                filtered_alumni.update(alumni.filter(domains__icontains=domain))
            alumni = list(filtered_alumni)

        page = paginator.paginate_queryset(alumni, request)

        pagination_data={
            "total_pages": paginator.page.paginator.num_pages,
            "has_next": paginator.page.has_next(),
            "has_previous": paginator.page.has_previous(),
        }

        serializer = AlumniSerializer(page, many=True)
        choices = [choice[1] for choice in Alumni.DOMAIN_CHOICES]
        return Response({ "alumni": serializer.data, "choices": choices, "pagination": pagination_data })

    def post(self, request):
        data=request.data
        alumni=data.get("alumni")
        if alumni["dp"]:
            alumni["dp"]=f"https://res.cloudinary.com/{settings.CLOUDINARY_STORAGE['CLOUD_NAME']}/image/upload/{alumni['dp']}"
        Alumniserializer = AlumniSerializer(data=alumni)
        if not Alumniserializer.is_valid():
            return Response(Alumniserializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        alumni_instance=Alumniserializer.save()
        res={ "alumni": Alumniserializer.data }

        EntranceExamserializer = EntranceExamSerializer(data=data.get("entrance_exam"))
        Educationserializer = EducationSerializer(data=data.get("education"))
        WorkProfileserializer = WorkProfileSerializer(data=data.get("work_profile"))

        if EntranceExamserializer.is_valid() :
            EntranceExamserializer.save(id=alumni_instance)
            res["entrance_exam"] = EntranceExamserializer.data
        else:
            print(EntranceExamserializer.errors)
            res["entrance_exam_errors"] = EntranceExamserializer.errors
        if Educationserializer.is_valid() :
            Educationserializer.save(id=alumni_instance)
            res["education"] = Educationserializer.data
        else:
            print(Educationserializer.errors)
            res["education_errors"] = Educationserializer.errors
        if WorkProfileserializer.is_valid() :
            WorkProfileserializer.save(id=alumni_instance)
            res["work_profile"] = WorkProfileserializer.data
        else:
            print(WorkProfileserializer.errors)
            res["work_profile_errors"] = WorkProfileserializer.errors
        return Response(res, status=status.HTTP_201_CREATED)

class Alumnidetail(APIView):    #This class is used to get the details of a particular alumni with the entrance exam, education and work profile details
    
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsEditor()]
    
    def get_object(self, pk, model):
        try:
            return model.objects.get(pk=pk)
        except model.DoesNotExist:
            return None

    def get(self, request, pk):
        alumni = self.get_object(pk, Alumni)
        if alumni is None:
            return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)
        Alumniserializer = AlumniSerializer(alumni)
        entrance_exam = self.get_object(pk, EntranceExam)
        EntranceExamserializer = EntranceExamSerializer(entrance_exam)
        education = self.get_object(pk, Education)
        Educationserializer = EducationSerializer(education)
        work_profile = self.get_object(pk, WorkProfile)
        WorkProfileserializer = WorkProfileSerializer(work_profile)
        return Response({ "alumni": Alumniserializer.data, "entrance_exam": EntranceExamserializer.data, "education": Educationserializer.data, "work_profile": WorkProfileserializer.data })

class Alumniview(APIView):       #This class is used to update and delete alumni details

    def get_permissions(self):
        if self.request.method == "PUT" or self.request.method == "DELETE":
            return [IsEditor()]
        return [IsAuthenticated()]
    
    def get_object(self, pk):
        try:
            return Alumni.objects.get(pk=pk)
        except Alumni.DoesNotExist:
            return None
    
    def put(self, request, pk):
        alumni=self.get_object(pk)
        if alumni:
            data=request.data.get("alumni").copy()
            data["dp"]=request.FILES.get("dp")
            serializer = AlumniSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        alumni=self.get_object(pk)
        if alumni:
            alumni.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)

class EntranceExamview(APIView):    #This class is used to add, update and delete entrance exam details of an alumni
    
    def get_permissions(self):
        if self.request.method == "PUT" or self.request.method == "DELETE" or self.request.method == "POST" :
            return [IsEditor()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Alumni.objects.get(pk=pk)
        except Alumni.DoesNotExist:
            return None
    
    def post(self, request, pk):
        alumni=self.get_object(pk=pk)
        if alumni:
            serializer = EntranceExamSerializer(data=request.data.get("entrance_exam"))
            if serializer.is_valid():
                serializer.save(id=alumni)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        entrance_exam=self.get_object(pk)
        if entrance_exam:
            serializer = EntranceExamSerializer(entrance_exam, data=request.data.get("entrance_exam"))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Entrance Exam not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        entrance_exam=self.get_object(pk)
        if entrance_exam:
            entrance_exam.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({ "error": "Entrance Exam not found" }, status=status.HTTP_404_NOT_FOUND)

class Educationview(APIView):     #This class is used to add, update and delete education details of an alumni
    
    def get_permissions(self):
        if self.request.method == "PUT" or self.request.method == "DELETE" or self.request.method == "POST" :
            return [IsEditor()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Alumni.objects.get(pk=pk)
        except Alumni.DoesNotExist:
            return None
    
    def post(self, request, pk):
        alumni=self.get_object(pk=pk)
        if alumni:
            serializer = EducationSerializer(data=request.data.get("education"))
            if serializer.is_valid():
                serializer.save(id=alumni)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        education=self.get_object(pk)
        if education:
            serializer = EducationSerializer(education, data=request.data.get("education"))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Education not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        education=self.get_object(pk)
        if education:
            education.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({ "error": "Education not found" }, status=status.HTTP_404_NOT_FOUND)

class WorkProfileview(APIView):     #This class is used to add, update and delete work profile details of an alumni
    
    def get_permissions(self):
        if self.request.method == "PUT" or self.request.method == "DELETE" or self.request.method == "POST" :
            return [IsEditor()]
        return [IsAuthenticated()]
    
    def get_object(self, pk):
        try:
            return Alumni.objects.get(pk=pk)
        except Alumni.DoesNotExist:
            return None
    
    def post(self, request, pk):
        alumni=self.get_object(pk=pk)
        if alumni:
            serializer = WorkProfileSerializer(data=request.data.get("work_profile"))
            if serializer.is_valid():
                serializer.save(id=alumni)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Alumni not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        work_profile=self.get_object(pk)
        if work_profile:
            serializer = WorkProfileSerializer(work_profile, data=request.data.get("work_profile"))
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({ "error": "Work Profile not found" }, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        work_profile=self.get_object(pk)
        if work_profile:
            work_profile.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({ "error": "Work Profile not found" }, status=status.HTTP_404_NOT_FOUND)

class CloudinarySignatureView(APIView):

    def get_permissions(self):
        return [IsEditor()]

    def get(self, request):
        timestamp = int(timezone.now().timestamp())
        params_to_sign = {
            "timestamp": timestamp,
            "folder": "alumni_module",
        }

        print("Params to sign:", params_to_sign)  # Debugging log
        print("API_SECRET:", settings.CLOUDINARY_STORAGE['API_SECRET'])  # Debugging log

        signature = cloudinary.utils.api_sign_request(
            params_to_sign,
            settings.CLOUDINARY_STORAGE['API_SECRET']
        )

        return Response({
            "cloud_name": settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
            "api_key": settings.CLOUDINARY_STORAGE['API_KEY'],
            "timestamp": timestamp,
            "signature": signature,
        })