

import AdminIcon from '@/components/shared/icon/AdminIcon';
import DashboardIcon from '@/components/shared/icon/DashboardIcon';
import RolesIcon from '@/components/shared/icon/RolesIcon';
import UsersIcon from '@/components/shared/icon/UsersIcon';
import type { NavbarRouteMap } from '@/types/navbar.types';

const navbarRoutesMap: { [key: string]: NavbarRouteMap } = {
  menu_dashboard: {
    title: 'navMenu.dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    type: 'menu_dashboard',
  },

  menu_diocese: {
    title: 'navMenu.dioceses',
    icon: UsersIcon,
    path: '/diocese',
    type: 'menu_dioceses',
    subRoutes: {
      menu_manage_dioceses: {
        title: 'navMenu.dioceses',
        icon: UsersIcon,
        path: '/manage-dioceses',
        type: 'menu_manage_dioceses',
      },
    },
  },
  menu_churches: {
    title: 'navMenu.churches',
    icon: UsersIcon,
    path: '/churches',
    type: 'menu_churches',
  },
  menu_users: {
    title: 'navMenu.admin.subRoutes.users',
    icon: AdminIcon,
    path: '/users',
    type: 'menu_users',
  },
  menu_families: {
    title: 'navMenu.families',
    icon: UsersIcon,
    path: '/families',
    type: 'menu_families',
  },
  menu_organizations: {
    title: 'navMenu.organizations',
    icon: UsersIcon,
    path: '/organizations',
    type: 'menu_organizations',
  },
  menu_admin: {
    title: 'navMenu.admin.title',
    icon: AdminIcon,
    path: '/admin',
    type: 'menu_admin',
    subRoutes: {
      menu_users: {
        title: 'navMenu.admin.subRoutes.users',
        icon: UsersIcon,
        path: '/users',
        type: 'menu_users',
      },
      menu_roles: {
        title: 'navMenu.admin.subRoutes.roles',
        icon: RolesIcon,
        path: '/roles',
        type: 'menu_roles',
      },
    },
  },
};

export { navbarRoutesMap };
