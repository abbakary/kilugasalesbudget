# Sales Budget Backend

A comprehensive Django REST API backend for the Sales Budgeting & Rolling Forecast System.

## 🚀 Features

### Authentication & Authorization
- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control** with 5 user types:
  - Administrator (Full access)
  - Salesman (Own data access)
  - Manager (Department access)
  - Supply Chain (Inventory management)
  - Branch Manager (Location-based access)
- **Custom Permissions** for granular access control
- **User Management** with profiles and preferences

### Budget Management
- **Budget Creation & Tracking** with approval workflows
- **Budget Categories** and line items
- **Transaction Tracking** with receipts and approvals
- **Budget Templates** for reusable structures
- **Variance Analysis** and reporting
- **Department & Location-based** budget access

### Data Sources & Analytics
- **Multiple Data Source Types** (SQL, NoSQL, APIs, Files)
- **Data Quality Checks** and validation
- **Scheduled Data Sync** with Celery
- **Advanced Analytics** and insights
- **Report Generation** and export

### Inventory Management
- **Stock Tracking** with real-time updates
- **Supplier Management** and relationships
- **Inventory Alerts** and notifications
- **Location-based** inventory access

## 🛠️ Technology Stack

- **Django 5.0.2** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database
- **Redis** - Caching and Celery broker
- **Celery** - Background tasks
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL
- Redis
- Virtual environment (recommended)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=sales_budget_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/1
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### 3. Database Setup

```bash
# Create database
createdb sales_budget_db

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Start Services

```bash
# Start Redis (if not running)
redis-server

# Start Celery worker (in new terminal)
celery -A sales_budget_backend worker -l info

# Start Celery beat (in new terminal, for scheduled tasks)
celery -A sales_budget_backend beat -l info

# Start Django development server
python manage.py runserver
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/token/          # Login
POST /api/auth/token/refresh/  # Refresh token
POST /api/auth/token/verify/   # Verify token
```

### User Management

```
GET    /api/users/users/                    # List users
POST   /api/users/users/                    # Create user
GET    /api/users/users/{id}/               # Get user details
PUT    /api/users/users/{id}/               # Update user
DELETE /api/users/users/{id}/               # Delete user
GET    /api/users/users/me/                 # Get current user
POST   /api/users/users/login/              # Custom login
POST   /api/users/users/logout/             # Logout
POST   /api/users/users/{id}/change_password/  # Change password
```

### Budget Management

```
GET    /api/budgets/budgets/                # List budgets
POST   /api/budgets/budgets/                # Create budget
GET    /api/budgets/budgets/{id}/           # Get budget details
PUT    /api/budgets/budgets/{id}/           # Update budget
DELETE /api/budgets/budgets/{id}/           # Delete budget
GET    /api/budgets/items/                  # List budget items
POST   /api/budgets/items/                  # Create budget item
GET    /api/budgets/transactions/           # List transactions
POST   /api/budgets/transactions/           # Create transaction
```

### Data Sources

```
GET    /api/data-sources/connections/       # List data sources
POST   /api/data-sources/connections/       # Create data source
GET    /api/data-sources/connections/{id}/  # Get data source details
PUT    /api/data-sources/connections/{id}/  # Update data source
DELETE /api/data-sources/connections/{id}/  # Delete data source
POST   /api/data-sources/connections/{id}/test/  # Test connection
POST   /api/data-sources/connections/{id}/sync/  # Sync data
```

### Analytics

```
GET    /api/analytics/dashboard/            # Dashboard data
GET    /api/analytics/reports/              # List reports
POST   /api/analytics/reports/              # Create report
GET    /api/analytics/reports/{id}/         # Get report details
GET    /api/analytics/insights/             # Get insights
GET    /api/analytics/alerts/               # List alerts
```

## 🔐 Role-Based Access Control

### Administrator
- Full system access
- User management
- All budgets and reports
- System configuration

### Salesman
- Own budget management
- Personal reports and analytics
- Limited data access

### Manager
- Department-level access
- Department budgets and reports
- Team management

### Supply Chain
- Inventory management
- Stock tracking
- Supply chain analytics

### Branch Manager
- Location-based access
- Location budgets and reports
- Branch-specific data

## 📊 Data Models

### Core Models
- **User** - Custom user model with roles
- **UserProfile** - Extended user information
- **Permission** - Granular permissions

### Budget Models
- **Budget** - Main budget entity
- **BudgetItem** - Individual line items
- **BudgetTransaction** - Transaction tracking
- **BudgetCategory** - Budget categorization
- **BudgetPeriod** - Time periods
- **BudgetTemplate** - Reusable templates
- **BudgetApproval** - Approval workflow

### Data Source Models
- **DataConnection** - Data source connections
- **DataSchema** - Schema information
- **DataQuery** - Saved queries
- **DataSyncJob** - Synchronization jobs
- **DataQualityCheck** - Quality validation

### Analytics Models
- **BiReport** - Business intelligence reports
- **DataInsight** - Automated insights
- **DataAlert** - Monitoring alerts
- **Visualization** - Chart configurations

## 🔧 Development

### Running Tests

```bash
python manage.py test
```

### Code Quality

```bash
# Install development dependencies
pip install flake8 black isort

# Format code
black .
isort .

# Lint code
flake8
```

### Database Management

```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database
python manage.py flush

# Load sample data
python manage.py loaddata sample_data.json
```

## 🚀 Deployment

### Production Settings

1. Set `DEBUG=False`
2. Configure production database
3. Set up static file serving
4. Configure Redis for production
5. Set up Celery workers
6. Configure logging

### Environment Variables

```env
# Production settings
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com

# Database
DB_NAME=production_db
DB_USER=production_user
DB_PASSWORD=secure_password
DB_HOST=your-db-host
DB_PORT=5432

# Redis
REDIS_URL=redis://your-redis-host:6379/1
CELERY_BROKER_URL=redis://your-redis-host:6379/0
CELERY_RESULT_BACKEND=redis://your-redis-host:6379/0
```

## 📝 API Usage Examples

### Authentication

```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/token/', {
    'email': 'admin@example.com',
    'password': 'admin123'
})

tokens = response.json()
headers = {'Authorization': f"Bearer {tokens['access']}"}

# Use authenticated requests
response = requests.get('http://localhost:8000/api/users/users/me/', headers=headers)
```

### Create Budget

```python
# Create budget
budget_data = {
    'title': 'Q1 Sales Budget',
    'description': 'First quarter sales budget',
    'period': 1,
    'category': 1,
    'total_budget': '50000.00',
    'department': 'Sales',
    'location': 'New York'
}

response = requests.post(
    'http://localhost:8000/api/budgets/budgets/',
    json=budget_data,
    headers=headers
)
```

### Get Analytics

```python
# Get dashboard data
response = requests.get(
    'http://localhost:8000/api/analytics/dashboard/',
    headers=headers
)

dashboard_data = response.json()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Django REST Framework** 