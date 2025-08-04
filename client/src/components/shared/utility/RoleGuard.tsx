import React from 'react';
import { UserPermissions } from '@/constants/role.constants';
import useStateStore from '@/store/store-index';
import AppLoader from '../AppLoader';
import useHasRole from '@/hooks/shared/useHasRole';

interface RoleGuardProps {
	role: UserPermissions;
	children: React.ReactNode;
	redirectTo?: string;
	enableRedirect?: boolean;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role, children }) => {
	const { isRolesLoading } = useStateStore();
	const { hasRole } = useHasRole();
	if (isRolesLoading) {
		return (
			<AppLoader/>
		);
	}
	return hasRole(role) ? <>{children}</> : null;
};

export default RoleGuard;
