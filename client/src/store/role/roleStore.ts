import { produce } from 'immer';
import type { StateCreator } from 'zustand';
import type { UserRolePermissions } from '@/types/role.types';
import type { UserMenuData } from '@/types/user.types';
import type { UserData } from '@/types/user.types';

export interface UserRolesState {
	isRolesLoading: boolean;
	roles: UserRolePermissions | null;
	menu: UserMenuData[] | null;
	profile: UserData | null;
	timezone: string | null;
	countryCode: string | null;
	setRoles: (roles: UserRolePermissions) => void;
	setMenu: (menu: UserMenuData[]) => void;
	setProfile: (profile: UserData | null) => void;
	setRolesLoading: (isLoading: boolean) => void;
	setTimezone: (timezone: string | null) => void;
	setCountryCode: (countryCode: string | null) => void;
}

const createUserRoleStore: StateCreator<UserRolesState> = (set) => ({
	isRolesLoading: true,
	roles: null,
	menu: null,
	profile: null,
	timezone: null,
	countryCode: null,
	setRoles: (roles: UserRolePermissions | null) => {
		set(
			produce((state: UserRolesState) => {
				state.roles = roles;
			}),
		);
	},
	setMenu: (menu: UserMenuData[] | null) => {
		set(
			produce((state: UserRolesState) => {
				state.menu = menu;
			}),
		);
	},
	setProfile: (profile: UserData | null) => {
		set(
			produce((state: UserRolesState) => {
				state.profile = profile;
			}),
		);
	},
	setRolesLoading: (isLoading: boolean) => {
		set(
			produce((state: UserRolesState) => {
				state.isRolesLoading = isLoading;
			}),
		);
	},
	setTimezone: (timezone: string | null) => {
		set(
			produce((state: UserRolesState) => {
				state.timezone = timezone;
			}),
		);
	},
	setCountryCode: (countryCode: string | null) => {
		set(
			produce((state: UserRolesState) => {
				state.countryCode = countryCode;
			}),
		);
	},
});

export default createUserRoleStore;
