from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

User = get_user_model()


class BudgetPeriod(models.Model):
    """Budget period (e.g., monthly, quarterly, yearly)"""
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"


class BudgetCategory(models.Model):
    """Budget categories (e.g., Sales, Marketing, Operations)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Budget categories"

    def __str__(self):
        return self.name


class Budget(models.Model):
    """Main budget model"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    period = models.ForeignKey(BudgetPeriod, on_delete=models.CASCADE, related_name='budgets')
    category = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='budgets')
    department = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Budget amounts
    total_budget = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    allocated_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    spent_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    remaining_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    approval_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='approved_budgets'
    )
    
    # Metadata
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    def save(self, *args, **kwargs):
        # Auto-calculate remaining amount
        self.remaining_amount = self.total_budget - self.spent_amount
        super().save(*args, **kwargs)

    @property
    def utilization_percentage(self):
        """Calculate budget utilization percentage"""
        if self.total_budget > 0:
            return (self.spent_amount / self.total_budget) * 100
        return 0

    @property
    def is_over_budget(self):
        """Check if budget is over allocated"""
        return self.spent_amount > self.total_budget


class BudgetItem(models.Model):
    """Individual budget line items"""
    ITEM_TYPE_CHOICES = [
        ('revenue', 'Revenue'),
        ('expense', 'Expense'),
        ('investment', 'Investment'),
    ]

    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default='expense')
    
    # Amounts
    planned_amount = models.DecimalField(max_digits=15, decimal_places=2)
    actual_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    variance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    
    # Tracking
    is_recurring = models.BooleanField(default=False)
    frequency = models.CharField(max_length=20, blank=True)  # monthly, quarterly, etc.
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Metadata
    vendor = models.CharField(max_length=200, blank=True)
    account_code = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.budget.title}"

    def save(self, *args, **kwargs):
        # Auto-calculate variance
        self.variance = self.actual_amount - self.planned_amount
        super().save(*args, **kwargs)

    @property
    def variance_percentage(self):
        """Calculate variance percentage"""
        if self.planned_amount > 0:
            return (self.variance / self.planned_amount) * 100
        return 0


class BudgetTransaction(models.Model):
    """Track individual budget transactions"""
    TRANSACTION_TYPE_CHOICES = [
        ('allocation', 'Allocation'),
        ('expense', 'Expense'),
        ('adjustment', 'Adjustment'),
        ('transfer', 'Transfer'),
    ]

    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='transactions')
    budget_item = models.ForeignKey(BudgetItem, on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    
    # Tracking
    transaction_date = models.DateField()
    reference_number = models.CharField(max_length=100, blank=True)
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='approved_transactions'
    )
    
    # Metadata
    receipt_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-transaction_date', '-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.budget.title}"


class BudgetTemplate(models.Model):
    """Reusable budget templates"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(BudgetCategory, on_delete=models.CASCADE, related_name='templates')
    
    # Template structure
    default_amount = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    items_structure = models.JSONField(default=list)  # Store template item structure
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_templates')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class BudgetApproval(models.Model):
    """Track budget approval workflow"""
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('requested_changes', 'Requested Changes'),
    ]

    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='approvals')
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='approvals')
    
    status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    comments = models.TextField(blank=True)
    
    # Tracking
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-requested_at']
        unique_together = ['budget', 'approver']

    def __str__(self):
        return f"{self.budget.title} - {self.approver.username} - {self.status}" 