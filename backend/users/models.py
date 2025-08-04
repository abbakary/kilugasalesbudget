from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserType(models.IntegerChoices):
    ADMIN = 1, _('Administrator')
    SALESMAN = 2, _('Salesman')
    MANAGER = 3, _('Manager')
    SUPPLY_CHAIN = 4, _('Supply Chain')
    BRANCH_MANAGER = 5, _('Branch Manager')


class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class User(AbstractUser):
    user_type = models.IntegerField(
        choices=UserType.choices,
        default=UserType.SALESMAN
    )
    department = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    budget_id = models.IntegerField(null=True, blank=True)
    permissions = models.ManyToManyField(Permission, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['username']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"

    @property
    def full_name(self):
        return self.get_full_name() or self.username

    def has_permission(self, permission_name):
        return self.permissions.filter(name=permission_name).exists()

    def can_access_user_types(self, user_types):
        return self.user_type in user_types

    def get_access_pattern(self):
        """Get access pattern based on user type"""
        patterns = {
            UserType.ADMIN: {
                'canAccessFullSystem': True,
                'canAccessDepartmentData': True,
                'canAccessLocationData': True,
                'canAccessOwnData': True,
                'canManageUsers': True,
                'canManageBudgets': True,
                'canViewReports': True,
                'canExportData': True,
                'canManageInventory': True,
                'canViewAnalytics': True,
            },
            UserType.SALESMAN: {
                'canAccessFullSystem': False,
                'canAccessDepartmentData': False,
                'canAccessLocationData': False,
                'canAccessOwnData': True,
                'canManageUsers': False,
                'canManageBudgets': True,
                'canViewReports': True,
                'canExportData': True,
                'canManageInventory': False,
                'canViewAnalytics': True,
            },
            UserType.MANAGER: {
                'canAccessFullSystem': False,
                'canAccessDepartmentData': True,
                'canAccessLocationData': False,
                'canAccessOwnData': True,
                'canManageUsers': False,
                'canManageBudgets': True,
                'canViewReports': True,
                'canExportData': True,
                'canManageInventory': False,
                'canViewAnalytics': True,
            },
            UserType.SUPPLY_CHAIN: {
                'canAccessFullSystem': False,
                'canAccessDepartmentData': False,
                'canAccessLocationData': False,
                'canAccessOwnData': True,
                'canManageUsers': False,
                'canManageBudgets': False,
                'canViewReports': True,
                'canExportData': True,
                'canManageInventory': True,
                'canViewAnalytics': True,
            },
            UserType.BRANCH_MANAGER: {
                'canAccessFullSystem': False,
                'canAccessDepartmentData': False,
                'canAccessLocationData': True,
                'canAccessOwnData': True,
                'canManageUsers': False,
                'canManageBudgets': True,
                'canViewReports': True,
                'canExportData': True,
                'canManageInventory': False,
                'canViewAnalytics': True,
            },
        }
        return patterns.get(self.user_type, {})


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}" 