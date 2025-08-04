from rest_framework import permissions
from .models import UserType


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == UserType.ADMIN


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admin users.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users can access everything
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Check if the object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if the object is the user itself
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class CanManageUsers(permissions.BasePermission):
    """
    Custom permission to allow admin and manager users to view users.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin can manage all users
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Manager can view users in their department
        if request.user.user_type == UserType.MANAGER:
            return True
        
        # Other users can only view themselves
        return True


class CanManageBudgets(permissions.BasePermission):
    """
    Custom permission to allow users to manage budgets based on their role.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin can manage all budgets
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Salesman, Manager, and Branch Manager can manage budgets
        allowed_types = [UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]
        return request.user.user_type in allowed_types


class CanManageInventory(permissions.BasePermission):
    """
    Custom permission to allow users to manage inventory based on their role.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin and Supply Chain can manage inventory
        allowed_types = [UserType.ADMIN, UserType.SUPPLY_CHAIN]
        return request.user.user_type in allowed_types


class CanViewAnalytics(permissions.BasePermission):
    """
    Custom permission to allow users to view analytics based on their role.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # All user types can view analytics (with different scopes)
        return True


class CanExportData(permissions.BasePermission):
    """
    Custom permission to allow users to export data based on their role.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # All user types can export data (with different scopes)
        return True


class DepartmentAccessPermission(permissions.BasePermission):
    """
    Custom permission to allow access based on department.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin has access to everything
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Manager has access to their department
        if request.user.user_type == UserType.MANAGER:
            return True
        
        # Other users have limited access
        return True

    def has_object_permission(self, request, view, obj):
        # Admin has access to everything
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Manager has access to their department
        if request.user.user_type == UserType.MANAGER:
            if hasattr(obj, 'department'):
                return obj.department == request.user.department
            if hasattr(obj, 'user') and hasattr(obj.user, 'department'):
                return obj.user.department == request.user.department
        
        # Users can access their own data
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class LocationAccessPermission(permissions.BasePermission):
    """
    Custom permission to allow access based on location.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admin has access to everything
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Branch Manager has access to their location
        if request.user.user_type == UserType.BRANCH_MANAGER:
            return True
        
        # Other users have limited access
        return True

    def has_object_permission(self, request, view, obj):
        # Admin has access to everything
        if request.user.user_type == UserType.ADMIN:
            return True
        
        # Branch Manager has access to their location
        if request.user.user_type == UserType.BRANCH_MANAGER:
            if hasattr(obj, 'location'):
                return obj.location == request.user.location
            if hasattr(obj, 'user') and hasattr(obj.user, 'location'):
                return obj.user.location == request.user.location
        
        # Users can access their own data
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False 