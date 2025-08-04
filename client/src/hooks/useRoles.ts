import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import { deleteData, fetchData, postData, putData } from '@/services/api';
import API_URLS from '@/services/apiUrls';
import { useCustomToast } from './useToastHelper';
import {
  type CreateUserRolePayload,
  type GetPermissionsApiResp,
  type UserRoles,
  type UserRolesDetailsResp,
  type UserRolesListApiResponse,
  type UserRolesUpdatePayload,
} from '@/types/role.types';
import { useTranslation } from 'react-i18next';
import { type PaginationState } from '@tanstack/react-table';
import { createQueryString } from '@/utils/queryString.utils';

export function useFetchAllUserRoles(fetchDataOptions: Record<string, any> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.ROLES.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getUserRoles', fetchDataOptions],
    queryFn: () => fetchData<UserRolesListApiResponse>(fullUrl, authAxiosInstance),
    retry: true,
  });
}

export function useUserRoleDetails(id: string) {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.ROLES.DETAILS.replace(':id', id);
  return useQuery({
    queryKey: ['userRoleDetails', id],
    queryFn: () => fetchData<UserRolesDetailsResp>(url, authAxiosInstance),
    retry: false,
    enabled: !!id,
  });
}

export function useUserRoleUpdate() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: UserRolesUpdatePayload) => putData(`${API_URLS.ROLES.UPDATE.replace(':id', data.id!)}`, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('roles.userRolesUpdateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['updateUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['getUserRoles'] });
    },
    onError: () => {
      showErrorToast(t('roles.userRolesUpdateErrorMsg'));
    },
  });
}

export function useCreateUserRole() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (data: CreateUserRolePayload) => postData(API_URLS.ROLES.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('roles.userRolesCreateSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['createUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['getUserRoles'] });
    },
    onError: () => {
      showErrorToast(t('roles.userRolesCreateErrorMsg'));
    },
  });
}

export function useDeleteUserRole() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteData(`${API_URLS.ROLES.DELETE.replace(':id', id)}`, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast(t('roles.userRolesDeleteSuccessMsg'));
      queryClient.invalidateQueries({ queryKey: ['deleteUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['getUserRoles'] });
    },
    onError: () => {
      showErrorToast(t('roles.userRolesDeleteErrorMsg'));
    },
  });
}

export function useGetPermissions() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['all-permissions'],
    queryFn: () => fetchData<GetPermissionsApiResp>(API_URLS.ROLES.PERMISSIONS, authAxiosInstance),
    retry: true,
  });
}

export function useGetChildRoles() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['child-roles'],
    queryFn: () => fetchData<{ success: string; data: UserRoles[] }>(API_URLS.ROLES.ALL_ROLES, authAxiosInstance),
    retry: true,
  });
}