# Django imports
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model, login, authenticate, logout

# Third-party imports
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

# Local imports
from .models import *
from .serializers import *
from .serializers import MatchSerializer


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
        user_id = self.request.data.get('user')
        user = Student.objects.get(id=user_id)
        serializer.save(user=user)
    
    
class MatchHistoryView(viewsets.ModelViewSet):
    serializer_class = MatchHistorySerializer

    def get_queryset(self):
        matchId = self.request.query_params.get('matchId', None)
        if matchId is not None:
            return MatchHistory.objects.filter(match__id=matchId).order_by('timestamp')
        return MatchHistory.objects.all().order_by('timestamp')
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        if serializer.validated_data.get('is_professor', True):
            Professor.objects.create(user=user)
        else:
            Student.objects.create(user=user)

    def perform_update(self, serializer):
        user = serializer.save()

        if serializer.validated_data.get('is_professor', True) and not Professor.objects.filter(user=user).exists():
            Professor.objects.create(user=user)
        elif not serializer.validated_data.get('is_professor', True) and not Student.objects.filter(user=user).exists():
            Student.objects.create(user=user)

class UsernameOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            try:
                user = UserModel.objects.get(username=username)
            except UserModel.DoesNotExist:
                print(f"No user found with username/email: {username}")  # Print statement
                return None

        if user.check_password(password):
            print(f"Authenticated user: {user.username}")  # Print statement
            return user
        else:
            print(f"Failed password check for user: {user.username}")  # Print statement

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
class LoginView(APIView):
    def post(self, request, format=None):
        data = request.data
        username_or_email = data.get('username_or_email', None)
        password = data.get('password', None)

        user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            login(request, user)
            user_role = 'professor' if (user.is_professor) else 'student'
            student_id = user.student.id if user_role == 'student' else None
            return Response({'success': True, 'user_id': user.id, 'user_role': user_role, 'student_id': student_id})
        else:
            return Response({'success': False, 'error': 'Invalid username or password'}, status=400)

class LogoutView(APIView):
    def get(self, request):
        logout(request)
        return Response({'success': True}, status=status.HTTP_200_OK)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    
class DriveStatViewSet(viewsets.ModelViewSet):
    serializer_class = DriveStatSerializer

    def get_queryset(self):
        userId = self.request.query_params.get('userId', None)
        if userId is not None:
            return DriveStat.objects.filter(userId=userId)
        return DriveStat.objects.all()

class Type2StatViewSet(viewsets.ModelViewSet):
    serializer_class = Type2StatSerializer

    def get_queryset(self):
        userId = self.request.query_params.get('userId', None)
        if userId is not None:
            return Type2Stat.objects.filter(userId=userId)
        return Type2Stat.objects.all()

class ServiceStatViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceStatSerializer

    def get_queryset(self):
        userId = self.request.query_params.get('userId', None)
        if userId is not None:
            return ServiceStat.objects.filter(userId=userId)
        return ServiceStat.objects.all()

class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)