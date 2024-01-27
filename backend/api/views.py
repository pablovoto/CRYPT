# Django imports
from django.contrib.auth.models import User

# Third-party imports
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# Local imports
from .models import *
from .serializers import *

class ProjectManagerViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = ProjectManager.objects.all()
    serializer_class = ProjectManagerSerializer

    def list(self, request):
        queryset = ProjectManager.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class ProjectViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def list(self, request):
        queryset = Project.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project)
        return Response(serializer.data)

    def update(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        serializer = self.serializer_class(project,data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        project = self.queryset.get(pk=pk)
        project.delete()
        return Response(status=204)

class MatchView(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MatchHistoryView(viewsets.ModelViewSet):
    serializer_class = MatchHistorySerializer

    def get_queryset(self):
        matchId = self.request.query_params.get('matchId', None)
        if matchId is not None:
            return MatchHistory.objects.filter(match__id=matchId).order_by('timestamp')
        return MatchHistory.objects.all().order_by('timestamp')
    
class UserDriveStatsList(generics.ListAPIView):
    serializer_class = DriveStatSerializer

    def get_queryset(self):
        userId = self.kwargs['userId']
        return DriveStat.objects.filter(user=userId)

class UserType2StatsList(generics.ListAPIView):
    serializer_class = Type2StatSerializer

    def get_queryset(self):
        userId = self.kwargs['userId']
        return Type2Stat.objects.filter(user=userId)

class UserServiceStatsList(generics.ListAPIView):
    serializer_class = ServiceStatSerializer

    def get_queryset(self):
        userId = self.kwargs['userId']
        return ServiceStat.objects.filter(user=userId)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        if serializer.validated_data.get('is_professor', False):
            Professor.objects.create(user=user)
        else:
            Student.objects.create(user=user)

    def perform_update(self, serializer):
        user = serializer.save()

        if serializer.validated_data.get('is_professor', False) and not Professor.objects.filter(user=user).exists():
            Professor.objects.create(user=user)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    
class DriveStatViewSet(viewsets.ModelViewSet):
    serializer_class = DriveStatSerializer

    def get_queryset(self):
        matchId = self.kwargs.get('matchId')
        userId = self.kwargs.get('userId')
        name = self.kwargs.get('name')

        queryset = DriveStat.objects.all()

        if matchId is not None:
            queryset = queryset.filter(match__id=matchId)

        if userId is not None:
            queryset = queryset.filter(user__id=userId)

        if name is not None:
            queryset = queryset.filter(name=name)

        return queryset

class Type2StatViewSet(viewsets.ModelViewSet):
    serializer_class = Type2StatSerializer

    def get_queryset(self):
        matchId = self.kwargs.get('matchId')
        userId = self.kwargs.get('userId')
        name = self.kwargs.get('name')

        queryset = Type2Stat.objects.all()

        if matchId is not None:
            queryset = queryset.filter(match__id=matchId)

        if userId is not None:
            queryset = queryset.filter(user__id=userId)

        if name is not None:
            queryset = queryset.filter(name=name)

        return queryset

class ServiceStatViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceStatSerializer

    def get_queryset(self):
        matchId = self.kwargs.get('matchId')
        userId = self.kwargs.get('userId')
        name = self.kwargs.get('name')

        queryset = ServiceStat.objects.all()

        if matchId is not None:
            queryset = queryset.filter(match__id=matchId)

        if userId is not None:
            queryset = queryset.filter(user__id=userId)

        if name is not None:
            queryset = queryset.filter(name=name)

        return queryset
