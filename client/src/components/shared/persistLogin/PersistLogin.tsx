import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/authentication/useAuth';
import useRefreshToken from '@/hooks/authentication/useRefreshToken';
import useStateStore from '@/store/store-index';
import AppLoader from '../AppLoader';

const PersistLogin = () => {
    const refresh = useRefreshToken();
    const { accessToken, setToken } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const refreshAttempted = useRef(false);
    const { setForwardedLink } = useStateStore();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const result = await refresh();
                if (!result) {
                    throw new Error('Refresh token failed');
                }
            } catch (error) {
                console.error('Error while refreshing token:', error);
                setToken('');
                setForwardedLink(location?.pathname + location?.search);
                navigate('/login', { replace: true });
            } finally {
                setIsLoading(false);
            }
        };
    
        // Only try refreshing once if there's no token
        if (!accessToken && !refreshAttempted.current) {
            refreshAttempted.current = true;
            verifyRefreshToken();
        } else if (accessToken) {
            setIsLoading(false);
        }
    }, [accessToken, refresh, setToken, location, navigate, setForwardedLink]);
    
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <AppLoader />
            </div>
        );
    }
    
    return <Outlet />;
};

export default PersistLogin;