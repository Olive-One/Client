import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import { useCustomToast } from './useToastHelper';
import { useTranslation } from 'react-i18next';
import { 
  type FamilyDetailsApiResponse, 
  type FamilyFormData, 
  type FamilyListApiResponse, 
  type FamilyPayload 
} from '@/types/family.types';
import { deleteData, fetchData, patchData, postData, putData } from '@/services/api';
import API_URLS from '@/services/apiUrls';
import { type PaginationState } from '@tanstack/react-table';
import { createQueryString } from '@/utils/queryString.utils';

export function useFetchAllFamilies(fetchDataOptions: Record<string, unknown> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.FAMILY.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getFamilies', fetchDataOptions],
    queryFn: () => fetchData<FamilyListApiResponse>(fullUrl, authAxiosInstance),
    retry: true,
  });
}

export function useFamilyDetails(id: string) {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.FAMILY.DETAILS.replace(':id', id);
  return useQuery({
    queryKey: ['FamilyDetails', id],
    queryFn: () => fetchData<FamilyDetailsApiResponse>(url, authAxiosInstance),
    retry: false,
    enabled: !!id,
  });
}

export function useCreateFamily() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: FamilyPayload) => postData(API_URLS.FAMILY.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('families.FamilyCreateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['createFamily'] });
      queryClient.invalidateQueries({ queryKey: ['getFamilies'] });
    },
    onError: () => {
      showErrorToast(t('families.FamilyCreateErrorMsg'));
    },
  });
}

export function useFamilyUpdate() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: { id: string; data: FamilyFormData }) =>
      putData(`${API_URLS.FAMILY.UPDATE.replace(':id', data.id)}`, data.data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('families.FamilyUpdateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['updateFamily'] });
      queryClient.invalidateQueries({ queryKey: ['getFamilies'] });
    },
    onError: () => {
      showErrorToast(t('families.FamilyUpdateErrorMsg'));
    },
  });
}

export function useDeleteFamily() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteData(`${API_URLS.FAMILY.DELETE.replace(':id', id)}`, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('families.FamilyDeleteSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['deleteFamily'] });
      queryClient.invalidateQueries({ queryKey: ['getFamilies'] });
    },
    onError: () => {
      showErrorToast(t('families.FamilyDeleteErrorMsg'));
    },
  });
}

export function useActivateFamily() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchData(API_URLS.FAMILY.ENABLE.replace(':id', id), id, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('families.FamilyEnableSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['activateFamily'] });
      queryClient.invalidateQueries({ queryKey: ['getFamilies'] });
    },
    onError: () => {
      showErrorToast(t('families.FamilyEnableErrorMsg'));
    },
  });
}

export function useDisableFamily() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchData(API_URLS.FAMILY.DISABLE.replace(':id', id), id, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('families.FamilyDisableSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['disableFamily'] });
      queryClient.invalidateQueries({ queryKey: ['getFamilies'] });
    },
    onError: () => {
      showErrorToast(t('families.FamilyDisableErrorMsg'));
    },
  });
}

export function useFamilyMembers(familyId: string | undefined, enabled: boolean = true) {
  const authAxiosInstance = useAxiosPrivate();
  const url = familyId ? API_URLS.FAMILY.MEMBERS.replace(':familyId', familyId) : '';
  
  return useQuery({
    queryKey: ['familyMembers', familyId],
    queryFn: () => fetchData<{ success: boolean; data: Array<{ id: string; label: string; value: string }> }>(url, authAxiosInstance),
    retry: false,
    enabled: !!familyId && enabled,
  });
}