
export interface MonthlyMetrics {
  month: string; // Format: 'MMM' for chart display
  dioceses: number;
  churches: number;
  members: number;
}

export interface RawMonthlyData {
  month_key: string; // Format: 'YYYY-MM'
  count: number;
}

export interface BackendGrowthResponse {
  success: boolean;
  data: {
    dioceses: RawMonthlyData[];
    churches: RawMonthlyData[];
    users: RawMonthlyData[];
  };
  message?: string;
}

export interface GrowthMetricsResponse {
  success: boolean;
  data: MonthlyMetrics[];
  message?: string;
}

export interface FamilyMemberGrowthResponse {
  success: boolean;
  data: {
    families: RawMonthlyData[];
    users: RawMonthlyData[];
  };
  message?: string;
}

export interface IncomeExpenseGrowthData {
  month: string;
  income: number;
  expense: number;
}

export interface IncomeExpenseGrowthResponse {
  success: boolean;
  data: IncomeExpenseGrowthData[];
  message?: string;
}

