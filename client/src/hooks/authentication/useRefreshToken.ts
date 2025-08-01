import API_URLS from '@/services/apiUrls';
import useAuth from './useAuth';
import { axiosPrivateRefreshInstance } from '@/services/axios';
import useStateStore from '@/store/store-index';

const useRefreshToken = () => {
	const { setToken } = useAuth();
    const { setLoginExpiredState } = useStateStore();


	const refresh = async () => {
		try {
			const response = await axiosPrivateRefreshInstance.get(API_URLS.AUTHENTICATION.REFRESH, {
				withCredentials: true,
			});
			const newAccessToken = response?.data?.data?.accessToken;
			
			if (!newAccessToken) {
				console.error('No access token received in refresh response');
				throw new Error('Invalid refresh response');
			}
			setLoginExpiredState(false);
			setToken(newAccessToken);
			return true;
		} catch (error) {
			console.error('Failed to refresh auth token:', error);
			setLoginExpiredState(true);
			setToken(''); // Clear the token on refresh failure
			return false;
		}
	};

	return refresh;
};

export default useRefreshToken;
