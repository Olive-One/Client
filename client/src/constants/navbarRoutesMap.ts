import { RoutePaths } from './routePaths.constants';

export const navbarRoutesMap: Record<string, { path: string }> = {
  menu_dashboard: { path: RoutePaths.DASHBOARD },
  MEMBERS: { path: '/members' },
  EVENTS: { path: '/events' },
  DONATIONS: { path: '/donations' },
  REPORTS: { path: '/reports' },
  SETTINGS: { path: '/settings' },
}; 