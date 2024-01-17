from django.db import models

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

class Match(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    sets_won = models.IntegerField()
    games_won = models.IntegerField()
    points_won = models.IntegerField()

    def __str__(self):
        return self.user.username

class DriveStat(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    player = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    total_drives = models.IntegerField()

    def __str__(self):
        return f"{self.match} - {self.player}"


class DriveDetailStat(models.Model):
    drive_stat = models.ForeignKey(DriveStat, on_delete=models.CASCADE)
    cross_winners = models.IntegerField()
    cross_inverted_winners = models.IntegerField()
    parallel_winners = models.IntegerField()
    parallel_inverted_winners = models.IntegerField()

    def __str__(self):
        return f"{self.drive_stat}"
    