from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden
from rest_framework import viewsets, permissions,generics,status
from .serializers import *
from rest_framework.response import Response
from .models import *
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.views import View
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.views import View
from django.http import HttpResponse
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.utils.encoding import force_str
from django.contrib.auth.views import LogoutView as AuthLogoutView

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
    queryset = MatchHistory.objects.all()
    serializer_class = MatchHistorySerializer

class LoginView(View):
    def post(self, request):
        if request.user.is_authenticated:
            return HttpResponseForbidden('You are already logged in')
        username_or_email = request.POST['username_or_email']
        password = request.POST['password']

        User = get_user_model()

        # Check if the input is an email
        if '@' in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
            except User.DoesNotExist:
                return HttpResponse('Invalid credentials', status=401)
        else:
            user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            if user.check_password(password):
                login(request, user)
                
                # Determine if the user is a Student or Professor
                user_type = 'student' if Student.objects.filter(user=user).exists() else 'professor'
                
                # Include the user type in the response
                return HttpResponse(f'Logged in as {user_type}')
            else:
                return HttpResponse('Invalid credentials', status=401)
        else:
            return HttpResponse('Invalid credentials', status=401)
        
class RegisterView(View):
    def post(self, request):
        if request.user.is_authenticated:
            return HttpResponseForbidden('You are already logged in')
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        user_type = request.POST['user_type']  # 'student' or 'teacher'
        user = User.objects.create_user(username, email, password)
        user.is_active = False
        user.save()

        # Create a Student or Teacher instance based on the user's selection
        if user_type == 'student':
            Student.objects.create(user=user)
        elif user_type == 'teacher':
            Professor.objects.create(user=user)
        else:
            return HttpResponse('Invalid user type', status=400)
        # Generate a one-time use token and an email message body
        token = default_token_generator.make_token(user)
        email_body = render_to_string('activation_email.html', {
            'user': user,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': token,
        })

        send_mail('Verify your email address', email_body, 'webmaster@localhost', [email])

        return HttpResponse('User created, verification email sent')        
@method_decorator(login_required, name='dispatch')
class LogoutView(AuthLogoutView):
    next_page = '/login/'  # or wherever you want to redirect to
    
class DriveStatViewSet(viewsets.ModelViewSet):
    queryset = DriveStat.objects.all()
    serializer_class = DriveStatSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists():
                return DriveStat.objects.all()
            elif Student.objects.filter(user=self.request.user).exists():
                return DriveStat.objects.filter(player__user=self.request.user)
            else:
                return DriveStat.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.validated_data['player'].user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to add this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            instance = self.get_object()
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                serializer = self.get_serializer(instance)
                return Response({'message': 'ServiceStat Retrieved', 'data': serializer.data})
            else:
                raise PermissionDenied({'message': 'You do not have permission to retrieve this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.instance.player.user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to update this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                instance.delete()
            else:
                raise PermissionDenied({'message': 'You do not have permission to delete this stat.'}, code=status.HTTP_403_FORBIDDEN)


class Type2StatViewSet(viewsets.ModelViewSet):
    queryset = Type2Stat.objects.all()
    serializer_class = Type2StatSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists():
                return Type2Stat.objects.all()
            elif Student.objects.filter(user=self.request.user).exists():
                return Type2Stat.objects.filter(player__user=self.request.user)
            else:
                return Type2Stat.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.validated_data['player'].user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to add this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            instance = self.get_object()
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                serializer = self.get_serializer(instance)
                return Response({'message': 'ServiceStat Retrieved', 'data': serializer.data})
            else:
                raise PermissionDenied({'message': 'You do not have permission to retrieve this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.instance.player.user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to update this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                instance.delete()
            else:
                raise PermissionDenied({'message': 'You do not have permission to delete this stat.'}, code=status.HTTP_403_FORBIDDEN)

class ServiceStatViewSet(viewsets.ModelViewSet):
    queryset = ServiceStat.objects.all()
    serializer_class = ServiceStatSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists():
                return ServiceStat.objects.all()
            elif Student.objects.filter(user=self.request.user).exists():
                return ServiceStat.objects.filter(player__user=self.request.user)
            else:
                return ServiceStat.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.validated_data['player'].user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to add this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            instance = self.get_object()
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                serializer = self.get_serializer(instance)
                return Response({'message': 'ServiceStat Retrieved', 'data': serializer.data})
            else:
                raise PermissionDenied({'message': 'You do not have permission to retrieve this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and serializer.instance.player.user == self.request.user):
                serializer.save()
            else:
                raise PermissionDenied({'message': 'You do not have permission to update this stat.'}, code=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            if Professor.objects.filter(user=self.request.user).exists() or \
            (Student.objects.filter(user=self.request.user).exists() and instance.player.user == self.request.user):
                instance.delete()
            else:
                raise PermissionDenied({'message': 'You do not have permission to delete this stat.'}, code=status.HTTP_403_FORBIDDEN)
            
            
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

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