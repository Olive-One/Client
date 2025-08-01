import type { UserMenuPermissionsConfig } from "./user.types";

export interface LoginData {
  email: string;
  password: string;
}

export type LoginApiResponse = {
	success: boolean;
	data: {
		accessToken?: string;
		config: UserMenuPermissionsConfig;
		status: string;
	};
};

export interface UserStatus {
  TEMPORARY: string;
  ACTIVE: string;
}

export const UserStatus: UserStatus = {
  TEMPORARY: 'TEMPORARY',
  ACTIVE: 'ACTIVE',
}; 