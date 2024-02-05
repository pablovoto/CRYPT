from django.urls import include, path 
from .views import * 
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'users', UserViewSet , basename='users')
router.register(r'students', StudentViewSet, basename='students')
router.register(r'professors', ProfessorViewSet, basename='professors')

router.register(r'project_manager', views.ProjectManagerViewset, basename='project_manager')
router.register(r'project', views.ProjectViewset, basename='project')

router.register(r'matches', MatchView, basename='matches')
router.register(r'matchhistory/', MatchHistoryView, basename='matchhistory')


router.register(r'drive_stat', views.DriveStatViewSet, basename='drive_stat')
router.register(r'type2_stat', views.Type2StatViewSet, basename='type2_stat')
router.register(r'service_stat', views.ServiceStatViewSet, basename='service_stat')

router.register(r'products', ProductView, basename='products')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]