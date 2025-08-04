import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import type {
  UserDeletePayload,
  UserDetailsResponse,
  UserEnableDisablePayload,
  UserListApiResponse,
  UserMenuPermissionsApiResponse,
  UserPasswordChangePayload,
  UserProfileApiResponse,
  UserUpsertData,
  ChangePasswordPayload,
} from '@/types/user.types';
import { deleteData, fetchData, postData, putData } from '@/services/api';
import API_URLS from '@/services/apiUrls';
import { useCustomToast } from './useToastHelper';
import { type DropdownResponse } from '@/types/dropDown.types';
import { type PaginationState } from '@tanstack/react-table';
import { createQueryString } from '@/utils/queryString.utils';

export function useUserMenuConfig() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['userMenuConfig'],
    queryFn: () => fetchData<UserMenuPermissionsApiResponse>(API_URLS.USER.MENU_CONFIG, authAxiosInstance),
    retry: true,
    gcTime: 0,
    staleTime: 0,
  });
}

export function useCurrentUserProfile() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: () => fetchData<UserProfileApiResponse>(API_URLS.USER.PROFILE_ME, authAxiosInstance),
    retry: true,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useFetchAllUsers(fetchDataOptions: Record<string, unknown> & PaginationState) {
  const queryString = createQueryString(fetchDataOptions);
  const fullUrl = `${API_URLS.USER.LIST}?${queryString}`;
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['getUsers', fetchDataOptions],
    queryFn: () => fetchData<UserListApiResponse>(fullUrl, authAxiosInstance),
    retry: true,
  });
}

export function useUserDetails(id: string) {
  const authAxiosInstance = useAxiosPrivate();
  const url = API_URLS.USER.DETAILS.replace(':id', id);
  return useQuery({
    queryKey: ['userDetails', id],
    queryFn: () => fetchData<UserDetailsResponse>(url, authAxiosInstance),
    retry: false,
    enabled: !!id,
  });
}

export function useUserUpdate() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpsertData) => putData(`${API_URLS.USER.UPDATE.replace(':id', data.id!)}`, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['updateUser'] });
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
    onError: () => {
      showErrorToast('Failed to update user');
    },
  });
}

export function useUserChildRoles() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['userChildRoles'],
    queryFn: () => fetchData<DropdownResponse<any>>(API_URLS.USER.CHILD_ROLES, authAxiosInstance),
    retry: false,
  });
}

export function useCreateUser() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserUpsertData) => postData(API_URLS.USER.CREATE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['createUser'] });
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
    onError: () => {
      showErrorToast('Failed to create user');
    },
  });
}

export function useDeleteUser() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserDeletePayload) => deleteData(`${API_URLS.USER.DELETE.replace(':id', data.id)}`, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['deleteUser'] });
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
    onError: () => {
      showErrorToast('Failed to delete user');
    },
  });
}

export function useEnableUser() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserEnableDisablePayload) => postData(API_URLS.USER.ENABLE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('User activated successfully');
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
    onError: () => {
      showErrorToast('Failed to activate user');
    },
  });
}

export function useDisableUser() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserEnableDisablePayload) => postData(API_URLS.USER.DISABLE, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('User deactivated successfully');
      queryClient.invalidateQueries({ queryKey: ['getUsers'] });
    },
    onError: () => {
      showErrorToast('Failed to deactivate user');
    },
  });
}

export function useChangeTempPassword() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  return useMutation({
    mutationFn: (data: UserPasswordChangePayload) => postData(API_URLS.USER.CHANGE_TEMP_PASSWORD, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Temporary password changed successfully');
    },
    onError: () => {
      showErrorToast('Failed to change temporary password');
    },
  });
}

export function useChangePassword() {
  const authAxiosInstance = useAxiosPrivate();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => postData(API_URLS.USER.CHANGE_PASSWORD, data, authAxiosInstance),
    retry: false,
    onSuccess: () => {
      showSuccessToast('Password changed successfully!');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to change password. Please try again.';
      showErrorToast(errorMessage);
    },
  });
}

// Context-aware dropdown hooks for user management
type DropdownOption = {
	id: string;
	label: string;
	value: string;
};

export function useContextDioceseDropdown() {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-dioceses'],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.DIOCESES}`, {}, authAxiosInstance),
		retry: false,
	});
}

export function useContextChurchDropdown(dioceseId?: string) {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-churches', dioceseId],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.CHURCHES}`, { dioceseId }, authAxiosInstance),
		retry: false,
		enabled: !!dioceseId,
	});
}

export function useContextFamilyDropdown(churchId?: string, enabled: boolean = true) {
	const authAxiosInstance = useAxiosPrivate();
	return useQuery({
		queryKey: ['context-families', churchId],
		queryFn: () => postData<DropdownResponse<DropdownOption>>(`${API_URLS.DROPDOWN_CONTEXT.FAMILIES}`, { churchId }, authAxiosInstance),
		retry: false,
		enabled: !!churchId && enabled,
	});
}