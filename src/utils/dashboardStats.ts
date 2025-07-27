import { PieChartIcon, TrendingUp, Clock, BarChart3, Target, AlertTriangle, Users, Package, MapPin, Building } from 'lucide-react';
import { UserType, User } from '../types/auth';

export const getRoleSpecificStats = (user: User | null) => {
  if (!user) return [];

  switch (user.user_type) {
    case UserType.ADMIN:
      return [
        {
          title: 'Total Users',
          value: '45',
          subtitle: 'Active system users',
          icon: Users,
          color: 'primary' as const,
          trend: { value: '+3', isPositive: true }
        },
        {
          title: 'Total Budget Units',
          value: '5,042',
          subtitle: 'System-wide budget',
          icon: PieChartIcon,
          color: 'primary' as const,
          trend: { value: '+12.5%', isPositive: true }
        },
        {
          title: 'Total Sales',
          value: '$2.4M',
          subtitle: 'Company-wide sales',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+18.3%', isPositive: true }
        },
        {
          title: 'System Health',
          value: '98.5%',
          subtitle: 'Overall system status',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+0.2%', isPositive: true }
        },
        {
          title: 'Active Departments',
          value: '8',
          subtitle: 'Operational departments',
          icon: Building,
          color: 'info' as const,
          trend: { value: '+1', isPositive: true }
        },
        {
          title: 'Stock Alerts',
          value: '23',
          subtitle: 'Items needing attention',
          icon: AlertTriangle,
          color: 'warning' as const,
          trend: { value: '-5', isPositive: true }
        }
      ];

    case UserType.SALESMAN:
      return [
        {
          title: 'My Budget Units',
          value: '342',
          subtitle: 'Personal budget allocation',
          icon: PieChartIcon,
          color: 'primary' as const,
          trend: { value: '+8.2%', isPositive: true }
        },
        {
          title: 'My Sales',
          value: '$45,600',
          subtitle: 'Current month performance',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+15.3%', isPositive: true }
        },
        {
          title: 'Target Achievement',
          value: '87%',
          subtitle: 'Monthly target progress',
          icon: Target,
          color: 'info' as const,
          trend: { value: '+5%', isPositive: true }
        },
        {
          title: 'Active Customers',
          value: '28',
          subtitle: 'Current customer base',
          icon: Users,
          color: 'info' as const,
          trend: { value: '+3', isPositive: true }
        }
      ];

    case UserType.MANAGER:
      return [
        {
          title: 'Department Budget',
          value: '1,240',
          subtitle: 'Department budget units',
          icon: PieChartIcon,
          color: 'primary' as const,
          trend: { value: '+10.2%', isPositive: true }
        },
        {
          title: 'Department Sales',
          value: '$480K',
          subtitle: 'Department performance',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+22.1%', isPositive: true }
        },
        {
          title: 'Team Performance',
          value: '92%',
          subtitle: 'Average team achievement',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+7%', isPositive: true }
        },
        {
          title: 'Team Members',
          value: '12',
          subtitle: 'Active sales team',
          icon: Users,
          color: 'info' as const,
          trend: { value: '+2', isPositive: true }
        }
      ];

    case UserType.SUPPLY_CHAIN:
      return [
        {
          title: 'Total Inventory',
          value: '15,420',
          subtitle: 'Items in stock',
          icon: Package,
          color: 'primary' as const,
          trend: { value: '+5.3%', isPositive: true }
        },
        {
          title: 'Goods in Transit',
          value: '850',
          subtitle: 'Items being shipped',
          icon: TrendingUp,
          color: 'info' as const,
          trend: { value: '+12', isPositive: true }
        },
        {
          title: 'Stock Alerts',
          value: '23',
          subtitle: 'Items below minimum',
          icon: AlertTriangle,
          color: 'warning' as const,
          trend: { value: '-5', isPositive: true }
        },
        {
          title: 'Supply Efficiency',
          value: '96.8%',
          subtitle: 'Overall efficiency rate',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+1.2%', isPositive: true }
        }
      ];

    case UserType.BRANCH_MANAGER:
      return [
        {
          title: 'Branch Budget',
          value: '2,180',
          subtitle: 'Location budget units',
          icon: PieChartIcon,
          color: 'primary' as const,
          trend: { value: '+14.7%', isPositive: true }
        },
        {
          title: 'Branch Sales',
          value: '$720K',
          subtitle: 'Location performance',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+19.4%', isPositive: true }
        },
        {
          title: 'Location Performance',
          value: '89%',
          subtitle: 'Branch target achievement',
          icon: Target,
          color: 'info' as const,
          trend: { value: '+6%', isPositive: true }
        },
        {
          title: 'Branch Staff',
          value: '18',
          subtitle: 'Active team members',
          icon: Users,
          color: 'info' as const,
          trend: { value: '+1', isPositive: true }
        },
        {
          title: 'Location',
          value: user?.location || 'Main',
          subtitle: 'Current branch',
          icon: MapPin,
          color: 'primary' as const,
          trend: { value: 'Active', isPositive: true }
        }
      ];

    default:
      return [];
  }
};
