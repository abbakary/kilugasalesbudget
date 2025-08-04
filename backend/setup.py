#!/usr/bin/env python
"""
Setup script for Sales Budget Backend
Automates the initial configuration and setup
"""

import os
import sys
import subprocess
import secrets
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False


def create_env_file():
    """Create .env file with default configuration"""
    env_content = """# Django Settings
SECRET_KEY={secret_key}
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=sales_budget_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
""".format(secret_key=secrets.token_urlsafe(50))

    with open('.env', 'w') as f:
        f.write(env_content)
    print("✅ .env file created")


def create_directories():
    """Create necessary directories"""
    directories = ['logs', 'media', 'static', 'staticfiles']
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    print("✅ Directories created")


def install_dependencies():
    """Install Python dependencies"""
    return run_command("pip install -r requirements.txt", "Installing dependencies")


def setup_database():
    """Setup database and run migrations"""
    commands = [
        ("python manage.py makemigrations users", "Creating user migrations"),
        ("python manage.py makemigrations budgets", "Creating budget migrations"),
        ("python manage.py makemigrations forecasts", "Creating forecast migrations"),
        ("python manage.py makemigrations inventory", "Creating inventory migrations"),
        ("python manage.py makemigrations data_sources", "Creating data source migrations"),
        ("python manage.py makemigrations analytics", "Creating analytics migrations"),
        ("python manage.py migrate", "Applying migrations"),
    ]
    
    for command, description in commands:
        if not run_command(command, description):
            return False
    return True


def create_superuser():
    """Create a superuser account"""
    print("🔄 Creating superuser...")
    print("Please enter the following information:")
    
    username = input("Username (default: admin): ").strip() or "admin"
    email = input("Email (default: admin@example.com): ").strip() or "admin@example.com"
    password = input("Password (default: admin123): ").strip() or "admin123"
    
    # Create superuser using Django management command
    command = f"python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('{username}', '{email}', '{password}')\""
    
    if run_command(command, "Creating superuser"):
        print(f"✅ Superuser created: {username} ({email})")
        return True
    return False


def create_sample_data():
    """Create sample data for testing"""
    print("🔄 Creating sample data...")
    
    # Create sample permissions
    permissions_command = """python manage.py shell -c "
from users.models import Permission
permissions = [
    'manage_users', 'manage_system', 'manage_own_budget', 
    'manage_department_budgets', 'view_department_reports',
    'manage_inventory', 'view_stock_reports', 'manage_location_budgets',
    'view_location_reports'
]
for perm in permissions:
    Permission.objects.get_or_create(name=perm, defaults={'description': f'Permission to {perm.replace(\"_\", \" \")}'})
print('Sample permissions created')
"
"""
    
    # Create sample budget categories
    categories_command = """python manage.py shell -c "
from budgets.models import BudgetCategory
categories = [
    {'name': 'Sales', 'description': 'Sales related budgets', 'color': '#3B82F6'},
    {'name': 'Marketing', 'description': 'Marketing and advertising', 'color': '#10B981'},
    {'name': 'Operations', 'description': 'Operational expenses', 'color': '#F59E0B'},
    {'name': 'Technology', 'description': 'IT and technology', 'color': '#8B5CF6'},
    {'name': 'Administration', 'description': 'Administrative costs', 'color': '#EF4444'}
]
for cat in categories:
    BudgetCategory.objects.get_or_create(name=cat['name'], defaults=cat)
print('Sample budget categories created')
"
"""
    
    # Create sample budget periods
    periods_command = """python manage.py shell -c "
from budgets.models import BudgetPeriod
from datetime import date, timedelta
import calendar

# Create current year periods
current_year = date.today().year
periods = [
    {'name': f'Q1 {current_year}', 'start_date': date(current_year, 1, 1), 'end_date': date(current_year, 3, 31)},
    {'name': f'Q2 {current_year}', 'start_date': date(current_year, 4, 1), 'end_date': date(current_year, 6, 30)},
    {'name': f'Q3 {current_year}', 'start_date': date(current_year, 7, 1), 'end_date': date(current_year, 9, 30)},
    {'name': f'Q4 {current_year}', 'start_date': date(current_year, 10, 1), 'end_date': date(current_year, 12, 31)},
]
for period in periods:
    BudgetPeriod.objects.get_or_create(name=period['name'], defaults=period)
print('Sample budget periods created')
"
"""
    
    commands = [
        (permissions_command, "Creating sample permissions"),
        (categories_command, "Creating sample budget categories"),
        (periods_command, "Creating sample budget periods"),
    ]
    
    for command, description in commands:
        if not run_command(command, description):
            return False
    return True


def main():
    """Main setup function"""
    print("🚀 Sales Budget Backend Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ Error: Please run this script from the backend directory")
        sys.exit(1)
    
    # Create .env file
    if not os.path.exists('.env'):
        create_env_file()
    else:
        print("✅ .env file already exists")
    
    # Create directories
    create_directories()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("❌ Failed to setup database")
        sys.exit(1)
    
    # Create superuser
    create_superuser()
    
    # Create sample data
    create_sample_data()
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start Redis server: redis-server")
    print("2. Start Celery worker: celery -A sales_budget_backend worker -l info")
    print("3. Start Django server: python manage.py runserver")
    print("4. Access admin at: http://localhost:8000/admin/")
    print("5. API documentation at: http://localhost:8000/api/")


if __name__ == "__main__":
    main() 