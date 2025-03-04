from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializer import *

class AlumniList(APIView):     #This class is used to get all the alumni details and to add new alumni details with some or all of the entrance exam, education and work profile details

    def get(self, request):
        alumni = Alumni.objects.all()
        serializer = AlumniSerializer(alumni, many=True)
        return Response({"alumni":serializer.data})

    def post(self, request):
        data=request.data.get("alumni").copy()
        data["dp"]=request.FILES.get("dp")
        Alumniserializer = AlumniSerializer(data=data)
        if Alumniserializer.is_valid():
            Alumniserializer.save()
            EntranceExamserializer = EntranceExamSerializer(data=request.data.get("entrance_exam"))
            Educationserializer = EducationSerializer(data=request.data.get("education"))
            WorkProfileserializer = WorkProfileSerializer(data=request.data.get("work_profile"))
            if EntranceExamserializer.is_valid() :
                return Response(EntranceExamserializer.save())
            if Educationserializer.is_valid() :
                return Response(Educationserializer.save())
            if WorkProfileserializer.is_valid() :
                return Response(WorkProfileserializer.save())
            
            return Response({ "alumni": Alumniserializer.data, 
                            "entrance_exam": EntranceExamserializer.data if EntranceExamserializer.is_valid() else None, 
                            "education": Educationserializer.data if Educationserializer.is_valid() else None,
                            "work_profile": WorkProfileserializer.data if WorkProfileserializer.is_valid() else None,
                            }, status=status.HTTP_201_CREATED)
        return Response(Alumniserializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Alumnidetail(APIView):    #This class is used to get the details of a particular alumni with the entrance exam, education and work profile details
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