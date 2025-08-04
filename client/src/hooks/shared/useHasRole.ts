import { UserPermissions } from '@/constants/role.constants';
import useStateStore from '../../store/store-index';

type UseHasRoleReturnType = {
	hasRole: (role: UserPermissions) => boolean;
};

const useHasRole = (): UseHasRoleReturnType => {
	const { roles } = useStateStore();

	// Function to check if the user has a specific role
	const hasRole = (role: UserPermissions): boolean => {
		return roles ? roles[role] : false;
	};
	return {
		hasRole,
	};
};

export default useHasRole;
