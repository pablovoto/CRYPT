from django.db import models
from django.contrib.auth.models import User


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

    def save(self, *args, **kwargs):
        if hasattr(self, 'request_user'):
            if Professor.objects.filter(user=self.request_user).exists() or \
               (Student.objects.filter(user=self.request_user).exists() and self.user == self.request_user):
                super().save(*args, **kwargs)
            else:
                raise PermissionError("You do not have permission to add this match.")
    
    def __str__(self):
        return self.user.username

class DriveStat(models.Model):
    name = models.CharField(unique=True, max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player = models.ForeignKey(Student, on_delete=models.CASCADE)
    total_drives = models.IntegerField()
    cross = models.IntegerField(default=0)
    parallel= models.IntegerField(default=0)
    cross_inverted = models.IntegerField(default=0)
    parallel_inverted= models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"

class Type2Stat(models.Model):
    name = models.CharField(unique=True, max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player = models.ForeignKey(Student, on_delete=models.CASCADE)
    total = models.IntegerField()
    cross = models.IntegerField(default=0)
    parallel = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"

class ServiceStat(models.Model):
    name = models.CharField(unique=True, max_length=100)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player = models.ForeignKey(Student, on_delete=models.CASCADE)
    total_services = models.IntegerField()
    to_the_t = models.IntegerField(default=0)
    open = models.IntegerField(default=0)
    middle = models.IntegerField(default=0)
    ace = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.match} - {self.player}"
    
