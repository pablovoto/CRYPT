from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User
class ProjectSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Project
        fields = ('id','name','projectmanager', 'start_date', 'end_date', 'comments', 'status')


class ProjectManagerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ProjectManager
        fields = ('name', 'id')
 
class MatchSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = Match
        fields = ['user', 'sets_won', 'games_won', 'points_won']

class DriveStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    match = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all())
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
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    match = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all())
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
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    match = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all())
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
    
class MatchHistorySerializer(serializers.ModelSerializer):
    match = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all())
    class Meta:
        model = MatchHistory
        fields = ['id', 'match', 'player1_score', 'player2_score', 'player1_games', 'player2_games', 'player1_sets', 'player2_sets', 'is_tiebreaker', 'timestamp']

class UserSerializer(serializers.ModelSerializer):
    is_professor = serializers.BooleanField(write_only=True, default=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'is_professor']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        is_professor = validated_data.pop('is_professor')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if is_professor:
            Professor.objects.create(user=user)
        else:
            Student.objects.create(user=user)

        return user
    def update(self, instance, validated_data):
        is_professor = validated_data.pop('is_professor', False)
        instance = super().update(instance, validated_data)

        if is_professor and not Professor.objects.filter(user=instance).exists():
            Professor.objects.create(user=instance)

        return instance
    
class StudentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Student
        fields = ['user']

class ProfessorSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Professor
        fields = ['user']
        
        