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
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = Match
        fields = ['id','user', 'sets_won', 'games_won', 'points_won']

class DriveStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    match = serializers.PrimaryKeyRelatedField(queryset=Match.objects.all())
    class Meta:
        model = DriveStat
        fields = ['cross', 'cross_inverted', 'match', 'name', 'parallel', 'parallel_inverted','total',  'user' ]
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
        fields = ['cross', 'match', 'name', 'parallel', 'total', 'user']
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
        model = Usuario
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'is_professor']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        is_professor = validated_data.pop('is_professor')
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
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
    def get(self, request):
        user = request.user
        return user
    
    
class StudentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    class Meta:
        model = Student
        fields = ['user']
    

class ProfessorSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    class Meta:
        model = Professor
        fields = ['user']
        
class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'image', 'image_url']

    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            return obj.image.url
        else:
            return None