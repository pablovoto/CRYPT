from django.urls import include, path 
from .views import * 
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'project_manager', views.ProjectManagerViewset, basename='project_manager')
router.register(r'project', views.ProjectViewset, basename='project')
router.register(r'match', views.MatchView, basename='match')
router.register(r'match_history', views.MatchHistoryView, basename='match_history')
router.register(r'drive_stat', views.DriveStatViewSet, basename='drive_stat')
router.register(r'type2_stat', views.Type2StatViewSet, basename='type2_stat')
router.register(r'service_stat', views.ServiceStatViewSet, basename='service_stat')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('verify_email/<uidb64>/<token>/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('home/', views.home, name='home'),
]