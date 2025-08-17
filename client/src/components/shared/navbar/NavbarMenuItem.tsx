import React, { useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import type { NavbarRoute } from '@/types/navbar.types';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

type MenuItemProps = {
	route: NavbarRoute;
};

const NavbarMenuItem: React.FC<MenuItemProps> = ({ route }) => {
	const { title, icon, path, subRoutes } = route;
	const pattern = `${path}/*`;
	const match = useMatch(pattern);
	const isMenuActive = !!match;
	const location = useLocation();
	const { t } = useTranslation();
	const IconComponent = icon;
	const [isOpen, setIsOpen] = useState(isMenuActive);

	// Handle main route active state
	const isMainRouteActive = location.pathname === path;

	if (subRoutes && subRoutes.length > 0) {
		return (
			<Collapsible
				asChild
				open={isOpen}
				onOpenChange={setIsOpen}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton
							tooltip={t(title)}
							isActive={isMenuActive}
							className="group-data-[collapsible=icon]:!p-0"
						>
							{IconComponent && <IconComponent />}
							<span>{t(title)}</span>
							<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{subRoutes.map((subRoute) => {
								const subRoutePath = `${path}${subRoute.path}`;
								const isSubRouteActive = location.pathname === subRoutePath;
								const SubIcon = subRoute.icon;
								
								return (
									<SidebarMenuSubItem key={subRoute.path}>
										<SidebarMenuSubButton
											asChild
											isActive={isSubRouteActive}
										>
											<Link to={subRoutePath}>
												{SubIcon && <SubIcon />}
												<span>{t(subRoute.title)}</span>
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								);
							})}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				tooltip={t(title)}
				isActive={isMainRouteActive}
			>
				<Link to={path}>
					{IconComponent && <IconComponent />}
					<span>{t(title)}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

export default NavbarMenuItem;