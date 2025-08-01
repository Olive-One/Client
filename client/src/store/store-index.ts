import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import createAuthStore, { type AuthStatesInf } from './auth/authStore';
import createUserRoleStore, { type UserRolesState } from './role/roleStore';

type CombinedState = AuthStatesInf & UserRolesState;

const useStateStore = create<CombinedState>()(
	devtools(
		persist(
			(...a) => ({
				...createAuthStore(...a),
                ...createUserRoleStore(...a),
			}),
			{
				name: 'app-state-store',
				storage: createJSONStorage(() => sessionStorage),
			},
		),
	),
);

export default useStateStore;
