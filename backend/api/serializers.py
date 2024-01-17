from rest_framework import serializers
from .models import * 

class ProjectSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Project
        fields = ('id','name','projectmanager', 'start_date', 'end_date', 'comments', 'status')


class ProjectManagerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ProjectManager
        fields = ('name', 'id')
 
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['sets_won', 'games_won', 'points_won']

class DriveStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveStat
        fields = '__all__'


class DriveDetailStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveDetailStat
        fields = '__all__'
        
