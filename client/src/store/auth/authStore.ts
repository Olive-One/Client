import { produce } from 'immer';
import type { StateCreator } from 'zustand';

export interface AuthStatesInf {
	isLoginExpired: boolean;
	isLogoutLoading: boolean;
	setLoginExpiredState: (newState: boolean) => void;
	forwardedLink: string;
	clearForwardedLink: VoidFunction;
	setForwardedLink: (newLink: string) => void;
	email: string;
	setEmail: (newEmail: string) => void;
	setLogoutLoadingState: (newState: boolean) => void;
}

const createAuthStore: StateCreator<AuthStatesInf> = (set) => ({
	isLoginExpired: false,
	isLogoutLoading: false,
	setLoginExpiredState: (newState) => {
		set(
			produce((draft: AuthStatesInf) => {
				draft.isLoginExpired = newState;
			}),
		);
	},
	forwardedLink: '',
	clearForwardedLink: () => {
		set(
			produce((draft: AuthStatesInf) => {
				draft.forwardedLink = '';
			}),
		);
	},
	setForwardedLink: (newLink: string) => {
		set(
			produce((draft: AuthStatesInf) => {
				draft.forwardedLink = newLink;
			}),
		);
	},
	email: '',
	setEmail: (newEmail: string) => {
		set(
			produce((draft: AuthStatesInf) => {
				draft.email = newEmail;
			}),
		);
	},
	setLogoutLoadingState: (newState: boolean) => {
		set(
			produce((draft: AuthStatesInf) => {
				draft.isLogoutLoading = newState;
			}),
		);
	},
});

export default createAuthStore;
