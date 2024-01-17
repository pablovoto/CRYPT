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
        fields = ['name','match', 'player', 'total_drives', 'cross_wins', 'parallel_wins', 'cross_inverted_wins', 'parallel_inverted_wins']

class Type2StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type2Stat
        fields = ['name','match', 'player', 'total_backhands', 'cross_wins', 'parallel_wins']

class ServiceStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceStat
        fields = ['name','match', 'player', 'total_services', 'to_the_t', 'open', 'middle', 'ace']