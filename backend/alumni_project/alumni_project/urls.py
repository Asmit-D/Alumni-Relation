from django.contrib import admin
from django.urls import path
from django.urls import include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from .views import RefreshAccessToken,Login,Logout

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumni/', include('alumni_list.urls')),
    path('', RedirectView.as_view(url='alumni/')),
    path('login/', Login.as_view(), name='login'),
    path('token/refresh/', RefreshAccessToken.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
