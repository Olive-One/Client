import React, { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/authentication/useAuth';
import Navbar from '../navbar/Navbar';
import Header from '../header/Header';
import useStateStore from '@/store/store-index';
import { setLanguage } from '@/translation/i18n';
import ScrollToTop from '@/components/scrollToTop/ScrollToTop';
import AppLoader from '../AppLoader';
import { useUserMenuConfig } from '@/hooks/useUsers';
import { useThemeConfig } from '@/hooks/useThemeConfig';
import { filterAndOrderNavbarRoutes } from '@/utils/menu.utils';
import { navbarRoutesMap } from '@/routes/menuConfig';

type LayoutProps = {
	children?: ReactNode;
};

const AppLayout: React.FC<LayoutProps> = () => {
	const scrollableDivRef = useRef<HTMLDivElement | null>(null);
	const { setRoles, setMenu, setRolesLoading, isLoginExpired, setTimezone, setCountryCode, setProfile } = useStateStore();
	const { data, isLoading, isError, isFetched } = useUserMenuConfig();
	const { data: themeData, isLoading: isThemeLoading, isFetched: isThemeFetched } = useThemeConfig();
	const navigate = useNavigate();
	const { accessToken } = useAuth();

	const routes = useMemo(() => {
		return filterAndOrderNavbarRoutes(data?.data?.menu || [], navbarRoutesMap);
	}, [data?.data?.menu]);

	useEffect(() => {
		if (isFetched && data?.data) {
			setMenu(data.data?.menu || null);
			setRoles(data.data?.permissions || null);
			setProfile(data.data?.profile || null);
			setRolesLoading(false);
		}
	}, [isFetched, setMenu, setTimezone, setRoles, data?.data, setRolesLoading, setCountryCode, setProfile]);

	useEffect(() => {
		if (isLoginExpired) {
			navigate('/login');
		}
	}, [isLoginExpired, navigate]);

	useEffect(() => {
		if (isThemeFetched && themeData) {
			const { translationConfig } = themeData;
			setLanguage(translationConfig?.activeLanguage || 'en', translationConfig?.translations);
		}
	}, [isThemeFetched, themeData]);

	// Only show loader if we're loading and don't have an access token
	if ((isLoading || isError) && !accessToken && !isThemeLoading) {
		return (
			<div className="w-screen h-screen bg-background text-foreground">
				<AppLoader containerClassName="w-screen h-screen" />
			</div>
		);
	}

	// If we have an access token but still loading menu data, show a minimal layout
	if (isLoading && accessToken) {
		return (
			<div className="h-screen overflow-hidden relative bg-background text-foreground">
				<Header />
				<div className="flex h-[calc(100vh-4rem)]">
					<div className="w-64 bg-card border-r border-border">
						<AppLoader />
					</div>
					<div className="flex-1 overflow-y-auto overflow-x-hidden">
						<AppLoader />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background text-foreground h-screen overflow-hidden relative">
			<Header />
			<div className="flex h-[calc(100vh-4rem)]">
				{/* Sidebar */}
				<div className="w-64 bg-card border-0 shadow-md flex-shrink-0">
					<Navbar routes={routes} />
				</div>
				{/* Main content area */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden">
					<div 
						className="h-full" 
						ref={scrollableDivRef}
					>
						<ScrollToTop scrollableDivRef={scrollableDivRef}>
							<Outlet />
						</ScrollToTop>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppLayout;