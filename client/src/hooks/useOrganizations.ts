import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import { useCustomToast } from './useToastHelper';
import { useTranslation } from 'react-i18next';
import { 
  type OrganizationDetailsApiResponse, 
  type OrganizationFormData, 
  type OrganizationListApiResponse, 
  type OrganizationPayload 
} from '@/types/organization.types';
import { deleteData, fetchData, patchData, postData, putData } from '@/services/api';
import API_URLS from '@/services/apiUrls';
import { type PaginationState } from '@tanstack/react-table';
import { createQueryString } from '@/utils/queryString.utils';

export function useFetchAllOrganizations(fetchDataOptions: Record<string, unknown> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.ORGANIZATION.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getOrganizations', fetchDataOptions],
    queryFn: () => fetchData<OrganizationListApiResponse>(fullUrl, authAxiosInstance),
    retry: true,
  });
}

export function useOrganizationDetails(id: string) {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.ORGANIZATION.DETAILS.replace(':id', id);
  return useQuery({
    queryKey: ['OrganizationDetails', id],
    queryFn: () => fetchData<OrganizationDetailsApiResponse>(url, authAxiosInstance),
    retry: false,
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: OrganizationPayload) => postData(API_URLS.ORGANIZATION.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('organizations.OrganizationCreateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['createOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['getOrganizations'] });
    },
    onError: () => {
      showErrorToast(t('organizations.OrganizationCreateErrorMsg'));
    },
  });
}

export function useOrganizationUpdate() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: { id: string; data: OrganizationFormData }) =>
      putData(`${API_URLS.ORGANIZATION.UPDATE.replace(':id', data.id)}`, data.data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('organizations.OrganizationUpdateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['updateOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['getOrganizations'] });
    },
    onError: () => {
      showErrorToast(t('organizations.OrganizationUpdateErrorMsg'));
    },
  });
}

export function useDeleteOrganization() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteData(`${API_URLS.ORGANIZATION.DELETE.replace(':id', id)}`, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('organizations.OrganizationDeleteSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['deleteOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['getOrganizations'] });
    },
    onError: () => {
      showErrorToast(t('organizations.OrganizationDeleteErrorMsg'));
    },
  });
}

export function useActivateOrganization() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchData(API_URLS.ORGANIZATION.ENABLE.replace(':id', id), id, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('organizations.OrganizationEnableSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['activateOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['getOrganizations'] });
    },
    onError: () => {
      showErrorToast(t('organizations.OrganizationEnableErrorMsg'));
    },
  });
}

export function useDisableOrganization() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchData(API_URLS.ORGANIZATION.DISABLE.replace(':id', id), id, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('organizations.OrganizationDisableSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['disableOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['getOrganizations'] });
    },
    onError: () => {
      showErrorToast(t('organizations.OrganizationDisableErrorMsg'));
    },
  });
}

export function useOrganizationMembers(organizationId: string | undefined, enabled: boolean = true) {
  const authAxiosInstance = useAxiosPrivate();
  const url = organizationId ? API_URLS.ORGANIZATION.ADD_MEMBER.replace(':id', organizationId) : '';
  
  return useQuery({
    queryKey: ['organizationMembers', organizationId],
    queryFn: () => fetchData<{ success: boolean; data: Array<{ id: string; label: string; value: string }> }>(url, authAxiosInstance),
    retry: false,
    enabled: !!organizationId && enabled,
  });
}