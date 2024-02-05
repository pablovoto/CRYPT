from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager, PermissionsMixin


class ProjectManager(models.Model): 
    name = models.CharField(unique=True, max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Project(models.Model): 
    name = models.CharField(unique=True, max_length=100)
    projectmanager = models.ForeignKey(ProjectManager, on_delete=models.CASCADE, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    comments = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UsuarioManager(BaseUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_user(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(username, email, password, **extra_fields)
    
class Usuario(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_professor = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    objects = UsuarioManager()

    def __str__(self):
        return self.username
class Student(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Professor(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username
class Match(models.Model):
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    sets_won = models.IntegerField()
    games_won = models.IntegerField()
    points_won = models.IntegerField()
    
    def __str__(self):
        return self.user.username
class MatchHistory(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    player1_games = models.IntegerField()
    player2_games = models.IntegerField()
    player1_sets = models.IntegerField()
    player2_sets = models.IntegerField()
    is_tiebreaker = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
class DriveStat(models.Model):
    name = models.CharField(max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    total= models.IntegerField()
    cross = models.IntegerField(default=0)
    parallel= models.IntegerField(default=0)
    cross_inverted = models.IntegerField(default=0)
    parallel_inverted= models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"

class Type2Stat(models.Model):
    name = models.CharField(max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    user = models.ForeignKey(Student, on_delete=models.CASCADE)    
    total = models.IntegerField()
    cross = models.IntegerField(default=0)
    parallel = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"

class ServiceStat(models.Model):
    name = models.CharField(max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    total_services = models.IntegerField()
    to_the_t = models.IntegerField(default=0)
    open = models.IntegerField(default=0)
    middle = models.IntegerField(default=0)
    ace = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name