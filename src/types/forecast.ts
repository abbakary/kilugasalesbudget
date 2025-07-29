export interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  region: string;
  segment: string;
  creditLimit: number;
  currency: string;
  active: boolean;
  createdAt: string;
  lastActivity: string;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unitPrice: number;
  costPrice: number;
  currency: string;
  unit: string;
  active: boolean;
  description?: string;
}

export interface MonthlyForecast {
  month: string;
  year: number;
  monthIndex: number; // 0-11 for Jan-Dec
  quantity: number;
  unitPrice: number;
  totalValue: number;
  notes?: string;
}

export interface CustomerItemForecast {
  id: string;
  customerId: string;
  itemId: string;
  customer: Customer;
  item: Item;
  monthlyForecasts: MonthlyForecast[];
  yearlyTotal: number;
  yearlyBudgetImpact: number;
  monthlyBudgetImpact: { [month: string]: number };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'revised';
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface ForecastSummary {
  customerId: string;
  customerName: string;
  totalItems: number;
  totalYearlyValue: number;
  totalMonthlyValues: { [month: string]: number };
  lastUpdated: string;
  status: 'draft' | 'submitted' | 'approved' | 'revised';
}

export interface BudgetImpact {
  month: string;
  year: number;
  originalBudget: number;
  forecastImpact: number;
  newProjectedBudget: number;
  variance: number;
  variancePercentage: number;
}

export interface ForecastFormData {
  customerId: string;
  itemId: string;
  forecasts: {
    [month: string]: {
      quantity: number;
      unitPrice: number;
      notes?: string;
    };
  };
  confidence: 'low' | 'medium' | 'high';
  notes?: string;
}
