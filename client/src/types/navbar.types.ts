export type NavbarRouteMap = {
	title: string;
	icon: React.ComponentType;
	path: string;
	subRoutes?: { [key: string]: NavbarRouteMap };
	type: string;
};

export type NavbarRoute = {
	title: string;
	icon: React.ComponentType;
	path: string;
	subRoutes?: NavbarRoute[];
	type: string;
};