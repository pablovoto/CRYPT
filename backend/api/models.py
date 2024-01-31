from django.db import models
from django.contrib.auth.models import AbstractBaseUser


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

class User(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_professor = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username
class Match(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)    
    total = models.IntegerField()
    cross = models.IntegerField(default=0)
    parallel = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"

class ServiceStat(models.Model):
    name = models.CharField(max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_services = models.IntegerField()
    to_the_t = models.IntegerField(default=0)
    open = models.IntegerField(default=0)
    middle = models.IntegerField(default=0)
    ace = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"
    
