import type { NavbarRoute, NavbarRouteMap } from '@/types/navbar.types';
import type { UserMenuData } from '@/types/user.types';

function filterAndOrderNavbarRoutes(serverConfig: UserMenuData[], navbarRoutesMap: { [key: string]: NavbarRouteMap }): NavbarRoute[] {
	// Filter the routes based on server config
	const filteredRoutes = serverConfig
		.map((config) => {
			const route = navbarRoutesMap[config.type];
			if (!route) {
				return null;
			}

			const filteredRoute: NavbarRoute = {
				...route,
				subRoutes: route.subRoutes ? filterAndOrderSubRoutes(config.sub, route.subRoutes) : undefined,
			};

			return filteredRoute;
		})
		.filter((route) => route !== null) as NavbarRoute[];

	// Sort the routes based on the order specified in the server config

	return filteredRoutes.sort((a, b) => {
		const orderA = serverConfig.find((config) => config.type === a.type)?.order || 0;
		const orderB = serverConfig.find((config) => config.type === b.type)?.order || 0;
		return orderA - orderB;
	});
}

function filterAndOrderSubRoutes(
	serverSubConfig: UserMenuData[] | undefined,
	subRoutesMap: { [key: string]: NavbarRouteMap },
): NavbarRoute[] | undefined {
	if (!serverSubConfig) {
		return undefined;
	}

	const filteredSubRoutes = serverSubConfig
		.map((config) => {
			const subRoute = subRoutesMap[config.type];
			return subRoute ? { ...subRoute } : null;
		})
		.filter((subRoute) => subRoute !== null) as NavbarRoute[];

	// Sort the sub-routes based on order
	return filteredSubRoutes.sort((a, b) => {
		const orderA = serverSubConfig.find((config) => config.type === a.type)?.order || 0;
		const orderB = serverSubConfig.find((config) => config.type === b.type)?.order || 0;
		return orderA - orderB;
	});
}

export { filterAndOrderNavbarRoutes };
