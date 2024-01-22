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
    player = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = DriveStat
        fields = ['name','match', 'user', 'total', 'cross', 'parallel', 'cross_inverted', 'parallel_inverted']
    def validate_name(self, value):
        """
        Check that the name is not empty and meets any other validation requirements.
        """
        if not value:
            raise serializers.ValidationError("Name field cannot be empty.")
        # Add any other validation requirements here
        return value

class Type2StatSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = Type2Stat
        fields = ['name','match', 'user', 'total', 'cross', 'parallel']
    def validate_name(self, value):
        """
        Check that the name is not empty and meets any other validation requirements.
        """
        if not value:
            raise serializers.ValidationError("Name field cannot be empty.")
        # Add any other validation requirements here
        return value

class ServiceStatSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = ServiceStat
        fields = ['name','match', 'user', 'total_services', 'to_the_t', 'open', 'middle', 'ace']
    def validate_name(self, value):
        """
        Check that the name is not empty and meets any other validation requirements.
        """
        if not value:
            raise serializers.ValidationError("Name field cannot be empty.")
        # Add any other validation requirements here
        return value
    
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['user']

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ['user']

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = ['id', 'match', 'player1_score', 'player2_score', 'player1_games', 'player2_games', 'player1_sets', 'player2_sets', 'is_tiebreaker', 'timestamp']
