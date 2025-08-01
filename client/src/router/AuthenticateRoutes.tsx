import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/authentication/useAuth';
import { RoutePaths } from '@/constants/routePaths.constants';

export default function AuthenticateRoutes() {
    const { accessToken } = useAuth();
    const location = useLocation();
    
    // Only redirect if we're not already on the login page
    if (!accessToken && location.pathname !== RoutePaths.LOGIN) {
        return <Navigate to={RoutePaths.LOGIN} state={{ from: location }} replace />;
    }
    
    // If we're on the login page but have a token, redirect to dashboard
    if (accessToken && location.pathname === RoutePaths.LOGIN) {
        return <Navigate to={RoutePaths.DASHBOARD} replace />;
    }
    
    return <Outlet />;
}