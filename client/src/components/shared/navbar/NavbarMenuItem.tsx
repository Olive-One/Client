import React, { useCallback } from 'react';
import { NavLink, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { NavbarRoute } from '@/types/navbar.types';
import type { CustomIconProps } from '@/types/icon.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

type MenuItemProps = {
	route: NavbarRoute;
};

const SubMenuItems: React.FC<{ 
	subRoutes: NavbarRoute['subRoutes']; 
	basePath: string; 
}> = ({ subRoutes, basePath }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPathname = location.pathname;
	const { t } = useTranslation();

	const handleSubMenuClick = useCallback(
		(subRoutePath: string) => {
			navigate(`${basePath}${subRoutePath}`);
		},
		[navigate, basePath],
	);

	return (
		<DropdownMenuContent 
			className="ml-2 mt-1 px-4 pb-4 max-h-96 overflow-y-auto rounded-lg border"
			align="start"
			side="right"
		>
			{subRoutes?.map((subRoute) => {
				const isActiveSubRoute = currentPathname === `${basePath}${subRoute.path}`;
				const IconComponent = subRoute.icon;
				
				return (
					<DropdownMenuItem
						key={subRoute.path}
						onClick={() => handleSubMenuClick(subRoute.path)}
						className={cn(
							"relative cursor-pointer rounded-lg font-semibold flex items-center space-x-2 p-3",
							isActiveSubRoute 
								? "bg-primary/10 text-primary" 
								: "hover:bg-accent hover:text-accent-foreground"
						)}
					>
						{IconComponent && <IconComponent />}
						<span>{t(subRoute.title)}</span>
					</DropdownMenuItem>
				);
			})}
		</DropdownMenuContent>
	);
};

const NavbarMenuItem: React.FC<MenuItemProps> = ({ route }) => {
	const { title, icon, path, subRoutes } = route;
	const pattern = `${path}/*`;
	const match = useMatch(pattern);
	const isMenuActive = !!match;
	const { t } = useTranslation();
	const IconComponent = icon;

	// Base styling for sidebar menu items
	const baseItemClasses = cn(
		"flex items-center space-x-3 rounded-lg py-3 px-4 font-semibold w-full transition-colors",
		isMenuActive 
			? "bg-primary/10 text-primary border-l-4 border-primary" 
			: "text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
	);

	if (subRoutes && subRoutes.length > 0) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className={cn(baseItemClasses, "cursor-pointer justify-between")}>
						<div className="flex items-center space-x-3">
							{IconComponent && React.createElement(IconComponent as React.ComponentType<CustomIconProps>, { className: "w-5 h-5" })}
							<span>{t(title)}</span>
						</div>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</DropdownMenuTrigger>
				<SubMenuItems subRoutes={subRoutes} basePath={path} />
			</DropdownMenu>
		);
	}

	return (
		<NavLink to={path} className={baseItemClasses}>
			{IconComponent && React.createElement(IconComponent as React.ComponentType<CustomIconProps>, { className: "w-5 h-5" })}
			<span>{t(title)}</span>
		</NavLink>
	);
};

export default NavbarMenuItem;