from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache

class Login(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            refresh = RefreshToken.for_user(user)
            session_key = request.session.session_key
            is_editor = user.groups.filter(name="Editor").exists()

            cache.set(f"refresh_{session_key}", str(refresh), timeout=7*24*60*60)

            return Response({
                "access": str(refresh.access_token),
                "session_key": session_key,
                "is_editor": is_editor
            })
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class RefreshAccessToken(APIView):
    def post(self, request):
        session_key = request.session.session_key
        if not session_key:
            return Response({"detail": "Session not found", "session_key": session_key}, status=404)

        refresh_token = cache.get(f"refresh_{session_key}")
        if not refresh_token:
            return Response({"detail": "Refresh token not found"}, status=404)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            return Response({
                "access": str(new_access),
                "session key": session_key
                })
        except Exception:
            return Response({"detail": "Invalid or expired refresh token"}, status=403)

class Logout(APIView):
    def post(self, request):
        session_key = request.session.session_key
        cache.delete(f"refresh_{session_key}")
        logout(request)
        return Response({"detail": "Logged out"})