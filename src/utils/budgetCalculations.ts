import { MonthlyForecast, BudgetImpact, CustomerItemForecast } from '../types/forecast';

// Monthly budget targets (example data - would come from database)
const MONTHLY_BUDGET_TARGETS = {
  'Jan': 150000,
  'Feb': 160000,
  'Mar': 170000,
  'Apr': 165000,
  'May': 175000,
  'Jun': 180000,
  'Jul': 185000,
  'Aug': 190000,
  'Sep': 175000,
  'Oct': 180000,
  'Nov': 200000,
  'Dec': 220000
};

const YEARLY_BUDGET_TARGET = Object.values(MONTHLY_BUDGET_TARGETS).reduce((sum, budget) => sum + budget, 0);

export const calculateMonthlyBudgetImpact = (
  monthlyForecasts: MonthlyForecast[]
): { [month: string]: number } => {
  const monthlyImpacts: { [month: string]: number } = {};
  
  monthlyForecasts.forEach(forecast => {
    const month = forecast.month;
    if (!monthlyImpacts[month]) {
      monthlyImpacts[month] = 0;
    }
    monthlyImpacts[month] += forecast.totalValue;
  });
  
  return monthlyImpacts;
};

export const calculateYearlyBudgetImpact = (
  customerForecasts: CustomerItemForecast[]
): number => {
  return customerForecasts.reduce((total, forecast) => {
    return total + forecast.yearlyTotal;
  }, 0);
};

export const calculateBudgetVariance = (
  forecastValue: number,
  budgetTarget: number
): { variance: number; variancePercentage: number } => {
  const variance = forecastValue - budgetTarget;
  const variancePercentage = budgetTarget !== 0 ? (variance / budgetTarget) * 100 : 0;
  
  return { variance, variancePercentage };
};

export const getBudgetImpactAnalysis = (
  customerForecasts: CustomerItemForecast[]
): {
  monthly: BudgetImpact[];
  yearly: BudgetImpact;
  summary: {
    totalForecast: number;
    totalBudget: number;
    overallVariance: number;
    overallVariancePercentage: number;
    monthsOverBudget: number;
    monthsUnderBudget: number;
  };
} => {
  // Calculate monthly impacts
  const monthlyTotals: { [month: string]: number } = {};
  
  customerForecasts.forEach(forecast => {
    forecast.monthlyForecasts.forEach(monthlyForecast => {
      const month = monthlyForecast.month;
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += monthlyForecast.totalValue;
    });
  });
  
  // Create monthly budget impact analysis
  const monthlyImpacts: BudgetImpact[] = Object.keys(MONTHLY_BUDGET_TARGETS).map(month => {
    const forecastValue = monthlyTotals[month] || 0;
    const budgetTarget = MONTHLY_BUDGET_TARGETS[month as keyof typeof MONTHLY_BUDGET_TARGETS];
    const { variance, variancePercentage } = calculateBudgetVariance(forecastValue, budgetTarget);
    
    return {
      month,
      year: new Date().getFullYear(),
      originalBudget: budgetTarget,
      forecastImpact: forecastValue,
      newProjectedBudget: budgetTarget + variance,
      variance,
      variancePercentage
    };
  });
  
  // Calculate yearly impact
  const totalForecast = calculateYearlyBudgetImpact(customerForecasts);
  const { variance: yearlyVariance, variancePercentage: yearlyVariancePercentage } = 
    calculateBudgetVariance(totalForecast, YEARLY_BUDGET_TARGET);
  
  const yearlyImpact: BudgetImpact = {
    month: 'YEARLY',
    year: new Date().getFullYear(),
    originalBudget: YEARLY_BUDGET_TARGET,
    forecastImpact: totalForecast,
    newProjectedBudget: YEARLY_BUDGET_TARGET + yearlyVariance,
    variance: yearlyVariance,
    variancePercentage: yearlyVariancePercentage
  };
  
  // Calculate summary statistics
  const monthsOverBudget = monthlyImpacts.filter(impact => impact.variance > 0).length;
  const monthsUnderBudget = monthlyImpacts.filter(impact => impact.variance < 0).length;
  
  return {
    monthly: monthlyImpacts,
    yearly: yearlyImpact,
    summary: {
      totalForecast,
      totalBudget: YEARLY_BUDGET_TARGET,
      overallVariance: yearlyVariance,
      overallVariancePercentage: yearlyVariancePercentage,
      monthsOverBudget,
      monthsUnderBudget
    }
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};

export const getVarianceColor = (variance: number): string => {
  if (variance > 0) return 'text-red-600 bg-red-50';
  if (variance < 0) return 'text-green-600 bg-green-50';
  return 'text-gray-600 bg-gray-50';
};

export const getConfidenceColor = (confidence: string): string => {
  switch (confidence) {
    case 'high': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Get current year remaining months for forecast
export const getRemainingMonths = (): string[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.slice(currentMonth);
};

// Convert month name to number (0-11)
export const getMonthNumber = (monthName: string): number => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.indexOf(monthName);
};

// Check if a month is in the future
export const isMonthInFuture = (monthName: string, year: number = new Date().getFullYear()): boolean => {
  const currentDate = new Date();
  const monthIndex = getMonthNumber(monthName);
  const monthDate = new Date(year, monthIndex, 1);
  return monthDate >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};
