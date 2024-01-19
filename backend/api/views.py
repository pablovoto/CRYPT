from django.shortcuts import render
from django.http import HttpResponse, HttpResponseForbidden
from rest_framework import viewsets, permissions,filters,status
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

class MatchView(viewsets.ViewSet):
    def post(self, request, format=None):
        serializer = MatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MatchHistoryView(viewsets.ViewSet):
    filter_backends = [filters.SearchFilter]
    search_fields = ['sets_won', 'games_won', 'points_won']

    def list(self, request, user_id=None):
        user = get_object_or_404(User, pk=user_id)
        queryset = Match.objects.filter(user=user)

        # Apply the filters
        queryset = self.filter_queryset(queryset)

        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set page size here
        result_page = paginator.paginate_queryset(queryset, request)
        serializer = MatchSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

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
                return HttpResponse('Logged in')
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
        user = User.objects.create_user(username, email, password)
        user.is_active = False
        user.save()

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
class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponse('Logged out')
class VerifyEmailView(View):
        def get(self, request, uidb64, token):
            User = get_user_model()

            try:
                # Decode the user's ID from the URL
                uid = force_text(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)

                # Check if the token is valid
                if default_token_generator.check_token(user, token):
                    # If the token is valid, activate the user's account
                    user.is_active = True
                    user.save()
                    return HttpResponse('Email verified, account activated')
                else:
                    return HttpResponse('Invalid token', status=400)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return HttpResponse('Invalid link', status=400)
            
        
class DriveStatViewSet(viewsets.ModelViewSet):
    queryset = DriveStat.objects.all()
    serializer_class = DriveStatSerializer
    
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


class Type2StatViewSet(viewsets.ModelViewSet):
    queryset = Type2Stat.objects.all()
    serializer_class = Type2StatSerializer

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
            
            
            
def home(request):
    return render(request, 'index.html')



