import { useMutation } from '@tanstack/react-query';
import type { LoginApiResponse } from '../types/auth.types';
import { postData } from '@/services/api';
import useAuth from './authentication/useAuth';
import API_URLS from '@/services/apiUrls';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import { RoutePaths } from '@/constants/routePaths.constants';
import useStateStore from '@/store/store-index';
// import useCustomToast from './useCustomToast';

export function useLogin() {
	// const { showErrorToast } = useCustomToast();
	const { setToken } = useAuth();

	return useMutation({
		mutationFn: async (data: { email: string; password: string }): Promise<LoginApiResponse> => {
			try {
				const response: LoginApiResponse = await postData(API_URLS.AUTHENTICATION.LOGIN, data);
				if (!response.success) {
					throw new Error('Login failed');
				}
				return response;
			} catch (error) {
				console.error('Error in mutation:', error);
				throw error;
			}
		},
		retry: false,
		onSuccess: (resp: LoginApiResponse) => {
			if (resp.success && resp.data.accessToken) {
                setToken(resp.data.accessToken);
				return resp;
			}
			throw new Error('Invalid response format');
		},
		onError: (error) => {
			console.error('Login error:', error);
			// showErrorToast('Error while logging in, please try again');
		},
	});
}

export function useLogout() {
	const navigate = useNavigate();
	// const { showErrorToast } = useCustomToast();
	const axios = useAxiosPrivate();
	const { setToken } = useAuth();
	const { setLogoutLoadingState } = useStateStore();
	return useMutation({
		mutationFn: () => postData(API_URLS.AUTHENTICATION.LOGOUT, {}, axios),
		retry: false,
		onSuccess: () => {
			setToken('');
			setLogoutLoadingState(false);
			navigate(RoutePaths.LOGIN, { replace: true });
		},
		onError: () => {
			setLogoutLoadingState(false);
			// showErrorToast('Error while logging out, please try again');
		},
	});
}