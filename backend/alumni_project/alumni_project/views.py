from urllib import response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
from django.http import JsonResponse

class Login(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            refresh = RefreshToken.for_user(user)
            is_editor = user.groups.filter(name="Editor").exists()

            response = JsonResponse({
                "access": str(refresh.access_token),
                "is_editor": is_editor
            })

            # Set refresh token in HttpOnly cookie
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,         # can't be accessed by JS
                secure=True,           # required if HTTPS
                samesite='None',       # allow cross-site
                path='/token/refresh/'  # cookie will be sent only to refresh endpoint
            )

            return response
        else:
            return Response({"detail": "Invalid credentials"}, status=401)

class RefreshAccessToken(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "Refresh token not found"}, status=404)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            return Response({
                "access": str(new_access),
                })
        except Exception:
            return Response({"detail": "Invalid or expired refresh token"}, status=403)

class Logout(APIView):
    def post(self, request):
        response = JsonResponse({"message": "Logged out"})
        response.delete_cookie("refresh_token", path='/token/refresh/')
        return response