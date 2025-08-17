import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import type {
  CreatePaymentPayload,
  CreateExpensePayload,
  PaymentCategory,
  PaymentSource,
  Currency,
  IncomePaymentsListByChurchApiResponse,
  IncomeOverviewByChurchApiResponse,
  ExpensePaymentsListByChurchApiResponse,
  ExpenseOverviewByChurchApiResponse,
  ExportFormData,
  ExportPaymentsResponse,
} from '@/types/payments.types';
import { PaymentType } from '@/types/payments.types';
import { deleteData, fetchData, postData, putData } from '@/services/api';
import API_URLS from '@/services/apiUrls';
import { useCustomToast } from './useToastHelper';
import { type DropdownResponse } from '@/types/dropDown.types';
import { type PaginationState } from '@tanstack/react-table';
import { createQueryString } from '@/utils/queryString.utils';

export function useIncomePaymentsListByChurch(fetchDataOptions: Record<string, any> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.PAYMENTS.INCOME.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getUserRoles', fetchDataOptions],
    queryFn: () => fetchData<IncomePaymentsListByChurchApiResponse>(fullUrl, authAxiosInstance),
    retry: false,
  });
}

export function useIncomeOverviewByChurch() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getIncomeOverviewByChurch'],
    queryFn: () => fetchData<IncomeOverviewByChurchApiResponse>(API_URLS.PAYMENTS.INCOME.OVERVIEW, authAxiosInstance),
    retry: false,
  });
}

export function useExpensePaymentsListByChurch(fetchDataOptions: Record<string, any> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.PAYMENTS.EXPENSE.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getExpensePaymentsByChurch', fetchDataOptions],
    queryFn: () => fetchData<ExpensePaymentsListByChurchApiResponse>(fullUrl, authAxiosInstance),
    retry: false,
  });
}

export function useExpenseOverviewByChurch() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getExpenseOverviewByChurch'],
    queryFn: () => fetchData<ExpenseOverviewByChurchApiResponse>(API_URLS.PAYMENTS.EXPENSE.OVERVIEW, authAxiosInstance),
    retry: false,
  });
}

/**
 * Hook to fetch all payments with pagination and filtering
 */
export function useFetchAllPayments(fetchDataOptions: Record<string, unknown> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.PAYMENTS.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  
  return useQuery({
    queryKey: ['getPayments', fetchDataOptions],
    queryFn: () => fetchData<any>(fullUrl, authAxiosInstance),
    retry: true,
  });
}

/**
 * Hook to fetch payment details by ID
 */
export function useFetchPaymentDetails(paymentId: string) {
  const authAxiosInstance = useAxiosPrivate();
  
  return useQuery({
    queryKey: ['paymentDetails', paymentId],
    queryFn: () => fetchData<any>(`${API_URLS.PAYMENTS.LIST}/${paymentId}`, authAxiosInstance),
    retry: true,
    enabled: !!paymentId,
  });
}

/**
 * Hook to create a new payment
 */
export function useCreatePayment() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentPayload) => postData(API_URLS.PAYMENTS.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Payment created successfully');
      queryClient.invalidateQueries({ queryKey: ['createPayment'] });
      queryClient.invalidateQueries({ queryKey: ['getPayments'] });
    },
    onError: () => {
      showErrorToast('Failed to create payment');
    },
  });
}

/**
 * Hook to create a new expense
 */
export function useCreateExpense() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateExpensePayload) => postData(API_URLS.PAYMENTS.EXPENSE.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Expense created successfully');
      queryClient.invalidateQueries({ queryKey: ['getExpensePaymentsByChurch'] });
      queryClient.invalidateQueries({ queryKey: ['getExpenseOverviewByChurch'] });
    },
    onError: () => {
      showErrorToast('Failed to create expense');
    },
  });
}

/**
 * Hook to update an existing payment
 */
export function useUpdatePayment() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentPayload) => 
      putData(API_URLS.PAYMENTS.UPDATE.replace(':id', data.id!), data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Payment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['getPayments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentDetails'] });
    },
    onError: () => {
      showErrorToast('Failed to update payment');
    },
  });
}

/**
 * Hook to delete a payment
 */
export function useDeletePayment() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentId: string) => 
      deleteData(API_URLS.PAYMENTS.DELETE.replace(':id', paymentId), authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Payment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['getPayments'] });
    },
    onError: () => {
      showErrorToast('Failed to delete payment');
    },
  });
}

/**
 * Hook to fetch payment categories
 */
export function usePaymentCategories() {
  const authAxiosInstance = useAxiosPrivate();
  
  return useQuery({
    queryKey: ['paymentCategories'],
    queryFn: () => fetchData<DropdownResponse<PaymentCategory>>(API_URLS.PAYMENTS.CATEGORIES, authAxiosInstance),
    retry: false,
  });
}

export function useIncomePaymentCategories(churchId?: string) {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['incomePaymentCategories', churchId],
    queryFn: () => fetchData<DropdownResponse<PaymentCategory>>(`${API_URLS.PAYMENTS.CATEGORIES}?churchId=${churchId}`, authAxiosInstance),
    retry: false,
  });
}

export function useExpensePaymentCategories(churchId?: string) {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['expensePaymentCategories', churchId],
    queryFn: () => fetchData<DropdownResponse<PaymentCategory>>(`${API_URLS.PAYMENTS.CATEGORIES}?churchId=${churchId}&type=EXPENSE`, authAxiosInstance),
    retry: false,
  });
}

/**
 * Hook to fetch payment sources
 */
export function usePaymentSources() {
  const authAxiosInstance = useAxiosPrivate();
  
  return useQuery({
    queryKey: ['paymentSources'],
    queryFn: () => fetchData<DropdownResponse<PaymentSource>>(API_URLS.PAYMENTS.SOURCES, authAxiosInstance),
    retry: false,
  });
}

/**
 * Hook to fetch available currencies
 */
export function useCurrencies() {
  const authAxiosInstance = useAxiosPrivate();
  
  return useQuery({
    queryKey: ['currencies'],
    queryFn: () => fetchData<DropdownResponse<Currency>>(API_URLS.PAYMENTS.CURRENCIES, authAxiosInstance),
    retry: false,
  });
}

/**
 * Hook to get dropdown options for payment categories
 */
export function usePaymentCategoryDropdown() {
  const { data: categories } = usePaymentCategories();
  
  return {
    data: categories?.data?.map(category => ({
      id: category.id,
      label: category.name,
      value: category.id,
    })) || []
  };
}

/**
 * Hook to get dropdown options for payment sources
 */
export function usePaymentSourceDropdown() {
  const { data: sources } = usePaymentSources();
  
  return {
    data: sources?.data?.map(source => ({
      id: source.id,
      label: source.name,
      value: source.id,
    })) || []
  };
}

/**
 * Hook to get dropdown options for currencies
 */
export function useCurrencyDropdown() {
  const { data: currencies } = useCurrencies();
  
  return {
    data: currencies?.data?.map(currency => ({
      id: currency.id,
      label: `${currency.name} (${currency.symbol})`,
      value: currency.id,
    })) || []
  };
}

/**
 * Hook to export payments data
 */
export function useExportPayments() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  
  return useMutation({
    mutationFn: async (data: ExportFormData): Promise<ExportPaymentsResponse> => {
      const endpoint = data.paymentType === PaymentType.INCOME 
        ? API_URLS.PAYMENTS.INCOME.EXPORT 
        : API_URLS.PAYMENTS.EXPENSE.EXPORT;
      
      const response = await postData<ExportPaymentsResponse>(endpoint, data, authAxiosInstance);
      return response;
    },
    retry: false,
    onSuccess: (data) => {
      if (data.success) {
        showSuccessToast('Export completed successfully');
      }
    },
    onError: (error) => {
      console.error('Export failed:', error);
      showErrorToast('Export failed. Please try again.');
    },
  });
}

/**
 * Hook to export income payments specifically
 */
export function useExportIncomePayments() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  
  return useMutation({
    mutationFn: (data: ExportFormData) => 
      postData<ExportPaymentsResponse>(API_URLS.PAYMENTS.INCOME.EXPORT, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Income export completed successfully');
    },
    onError: () => {
      showErrorToast('Income export failed. Please try again.');
    },
  });
}

/**
 * Hook to export expense payments specifically
 */
export function useExportExpensePayments() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  
  return useMutation({
    mutationFn: (data: ExportFormData) => 
      postData<ExportPaymentsResponse>(API_URLS.PAYMENTS.EXPENSE.EXPORT, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Expense export completed successfully');
    },
    onError: () => {
      showErrorToast('Expense export failed. Please try again.');
    },
  });
}