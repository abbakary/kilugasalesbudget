from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import User, UserProfile, Permission, UserType
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer, UserListSerializer,
    LoginSerializer, ChangePasswordSerializer, PermissionSerializer,
    PermissionAssignmentSerializer, UserProfileSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin, CanManageUsers


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('profile').prefetch_related('permissions')
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'department', 'location', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'department', 'location']
    ordering_fields = ['username', 'email', 'created_at', 'user_type']
    ordering = ['username']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif self.action == 'list':
            return UserListSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        elif self.action in ['retrieve']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [CanManageUsers]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        
        # Filter based on user permissions
        if user.user_type == UserType.ADMIN:
            return queryset
        elif user.user_type == UserType.MANAGER:
            # Managers can see users in their department
            return queryset.filter(department=user.department)
        else:
            # Other users can only see themselves
            return queryset.filter(id=user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Custom login endpoint"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout endpoint"""
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        """Change user password"""
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_permissions(self, request, pk=None):
        """Assign permissions to user"""
        user = self.get_object()
        serializer = PermissionAssignmentSerializer(data=request.data)
        
        if serializer.is_valid():
            permission_ids = serializer.validated_data['permission_ids']
            permissions = Permission.objects.filter(id__in=permission_ids)
            user.permissions.set(permissions)
            return Response({'message': 'Permissions assigned successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def permissions(self, request, pk=None):
        """Get user permissions"""
        user = self.get_object()
        serializer = PermissionSerializer(user.permissions.all(), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user_types(self, request):
        """Get available user types"""
        user_types = [
            {'value': choice[0], 'label': choice[1]} 
            for choice in UserType.choices
        ]
        return Response(user_types)

    @action(detail=False, methods=['get'])
    def departments(self, request):
        """Get unique departments"""
        departments = User.objects.exclude(
            department__isnull=True
        ).exclude(
            department__exact=''
        ).values_list('department', flat=True).distinct()
        return Response(list(departments))

    @action(detail=False, methods=['get'])
    def locations(self, request):
        """Get unique locations"""
        locations = User.objects.exclude(
            location__isnull=True
        ).exclude(
            location__exact=''
        ).values_list('location', flat=True).distinct()
        return Response(list(locations))

    @action(detail=True, methods=['get', 'put', 'patch'])
    def profile(self, request, pk=None):
        """Manage user profile"""
        user = self.get_object()
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(user.profile)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserProfileSerializer(user.profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        users_by_type = {}
        
        for choice in UserType.choices:
            users_by_type[choice[1]] = User.objects.filter(user_type=choice[0]).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'users_by_type': users_by_type
        })


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == UserType.ADMIN:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=user) 