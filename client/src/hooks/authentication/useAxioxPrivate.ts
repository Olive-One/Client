import { useEffect } from 'react';
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';
import { type AxiosRequestHeaders } from 'axios';
import { axiosPrivateInstance } from '@/services/axios';

const useAxiosPrivate = () => {
    const auth = useAuth();
    const refresh = useRefreshToken();
    useEffect(() => {
        const requestIntercept = axiosPrivateInstance.interceptors.request.use(
            (config) => {
                if (config.headers === undefined) {
                    config.headers = {} as AxiosRequestHeaders;
                }
                if (!config?.headers?.Authorization) {
                    config.headers.Authorization = `Bearer ${auth.accessToken}`;
                }
                return config;
            },
            (error) => {
                auth.setToken('');
                Promise.reject(error);
            }
        );
        const responseIntercept = axiosPrivateInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivateInstance(prevRequest);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosPrivateInstance.interceptors.request.eject(requestIntercept);
            axiosPrivateInstance.interceptors.response.eject(responseIntercept);
        };
    }, [auth, auth.accessToken, refresh]);
    return axiosPrivateInstance;
};

export default useAxiosPrivate;
