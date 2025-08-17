import { type BackendGrowthResponse, type IncomeExpenseGrowthResponse } from '@/types/growthMetrics.types.ts';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '@/services/api';
import API_URLS from '@/services/apiUrls';

export function useGrowthMetrics() {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.DASHBOARD.APP_GROWTH_METRICS;
  return useQuery({
    queryKey: ['app-growth-metrics'],
    queryFn: () => fetchData<BackendGrowthResponse>(url, authAxiosInstance),
    retry: false,
  });
}

export function useCombinedFinancialMetrics() {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.DASHBOARD.INCOME_EXPENSE_TRENDS;
  return useQuery({
    queryKey: ['combined-financial-metrics'],
    queryFn: () => fetchData<IncomeExpenseGrowthResponse>(url, authAxiosInstance),
    retry: false,
  });
}