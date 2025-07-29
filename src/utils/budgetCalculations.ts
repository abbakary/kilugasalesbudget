import { MonthlyForecast, BudgetImpact, CustomerItemForecast, BudgetHistory, YearlyForecastSummary, CustomerAnalytics } from '../types/forecast';

// Budget targets by year (example data - would come from database)
const BUDGET_TARGETS_BY_YEAR: { [year: number]: { [month: string]: number } } = {
  2021: {
    'Jan': 120000, 'Feb': 125000, 'Mar': 130000, 'Apr': 128000, 'May': 135000, 'Jun': 140000,
    'Jul': 145000, 'Aug': 148000, 'Sep': 142000, 'Oct': 145000, 'Nov': 155000, 'Dec': 170000
  },
  2022: {
    'Jan': 130000, 'Feb': 135000, 'Mar': 140000, 'Apr': 138000, 'May': 145000, 'Jun': 150000,
    'Jul': 155000, 'Aug': 158000, 'Sep': 152000, 'Oct': 155000, 'Nov': 165000, 'Dec': 180000
  },
  2023: {
    'Jan': 140000, 'Feb': 145000, 'Mar': 150000, 'Apr': 148000, 'May': 155000, 'Jun': 160000,
    'Jul': 165000, 'Aug': 168000, 'Sep': 162000, 'Oct': 165000, 'Nov': 175000, 'Dec': 190000
  },
  2024: {
    'Jan': 150000, 'Feb': 160000, 'Mar': 170000, 'Apr': 165000, 'May': 175000, 'Jun': 180000,
    'Jul': 185000, 'Aug': 190000, 'Sep': 175000, 'Oct': 180000, 'Nov': 200000, 'Dec': 220000
  },
  2025: {
    'Jan': 160000, 'Feb': 170000, 'Mar': 180000, 'Apr': 175000, 'May': 185000, 'Jun': 190000,
    'Jul': 195000, 'Aug': 200000, 'Sep': 185000, 'Oct': 190000, 'Nov': 210000, 'Dec': 230000
  }
};

const getYearlyBudgetTarget = (year: number): number => {
  const monthlyTargets = BUDGET_TARGETS_BY_YEAR[year];
  return monthlyTargets ? Object.values(monthlyTargets).reduce((sum, budget) => sum + budget, 0) : 0;
};

const getMonthlyBudgetTarget = (month: string, year: number): number => {
  return BUDGET_TARGETS_BY_YEAR[year]?.[month] || 0;
};

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
  customerForecasts: CustomerItemForecast[],
  year: number = new Date().getFullYear()
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
  const monthlyTargets = BUDGET_TARGETS_BY_YEAR[year] || {};
  const monthlyImpacts: BudgetImpact[] = Object.keys(monthlyTargets).map(month => {
    const forecastValue = monthlyTotals[month] || 0;
    const budgetTarget = getMonthlyBudgetTarget(month, year);
    const { variance, variancePercentage } = calculateBudgetVariance(forecastValue, budgetTarget);

    return {
      month,
      year,
      originalBudget: budgetTarget,
      forecastImpact: forecastValue,
      newProjectedBudget: budgetTarget + variance,
      variance,
      variancePercentage
    };
  });
  
  // Calculate yearly impact
  const totalForecast = calculateYearlyBudgetImpact(customerForecasts);
  const yearlyBudgetTarget = getYearlyBudgetTarget(year);
  const { variance: yearlyVariance, variancePercentage: yearlyVariancePercentage } =
    calculateBudgetVariance(totalForecast, yearlyBudgetTarget);

  const yearlyImpact: BudgetImpact = {
    month: 'YEARLY',
    year,
    originalBudget: yearlyBudgetTarget,
    forecastImpact: totalForecast,
    newProjectedBudget: yearlyBudgetTarget + yearlyVariance,
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
      totalBudget: yearlyBudgetTarget,
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
