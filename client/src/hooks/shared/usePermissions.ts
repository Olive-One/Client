import useStateStore from '@/store/store-index';
import { UserPermissions, UserRoles } from '@/constants/role.constants';
import type { Role } from '@/types/user.types';

export function usePermissions() {
  const { roles, profile } = useStateStore();

  // Check if user has specific permission
  const hasPermission = (permission: UserPermissions): boolean => {
    if (!roles) return false;
    return Boolean(roles[permission]);
  };

  // Check if user has specific role
  const hasRole = (role: UserRoles): boolean => {
    if (!profile?.roles) return false;
    return profile.roles.some((userRole: Role) => userRole.name === role);
  };
  // Role-based checks
  const isSuperAdmin = hasRole(UserRoles.SUPER_ADMIN);
  const isDioceseAdmin = hasRole(UserRoles.DIOCESE_ADMIN);
  const isChurchAdmin = hasRole(UserRoles.CHURCH_ADMIN);
  const isChurchMember = hasRole(UserRoles.CHURCH_MEMBER);

  // Hierarchical permission checks
  const canManageUsers = isSuperAdmin || isDioceseAdmin || isChurchAdmin;
  const canManageChurches = isSuperAdmin || isDioceseAdmin;
  const canManageDioceses = isSuperAdmin;

  // Context-based checks
  const getAccessibleDioceseIds = (): string[] => {
    if (isSuperAdmin) return []; // Super admin can access all
    if (isDioceseAdmin && profile?.dioceseId) return [profile.dioceseId];
    return [];
  };

  const getAccessibleChurchIds = (): string[] => {
    if (isSuperAdmin) return []; // Super admin can access all
    if (isDioceseAdmin) return []; // Diocese admin can access all in their diocese
    if ((isChurchAdmin || isChurchMember) && profile?.churchId) return [profile.churchId];
    return [];
  };

  // Check if user can access specific context
  const canAccessDiocese = (dioceseId: string): boolean => {
    if (isSuperAdmin) return true;
    if (isDioceseAdmin) return profile?.dioceseId === dioceseId;
    return false;
  };

  const canAccessChurch = (churchId: string): boolean => {
    if (isSuperAdmin) return true;
    if (isDioceseAdmin) {
      // Would need to check if church belongs to their diocese
      // This might require additional API call or pre-loaded data
      return true; // Simplified for now
    }
    if (isChurchAdmin || isChurchMember) return profile?.churchId === churchId;
    return false;
  };

  return {
    // Permission checks
    hasPermission,
    hasRole,
    
    // Role checks
    isSuperAdmin,
    isDioceseAdmin,
    isChurchAdmin,
    isChurchMember,
    
    // Capability checks
    canManageUsers,
    canManageChurches,
    canManageDioceses,
    
    // Context access
    getAccessibleDioceseIds,
    getAccessibleChurchIds,
    canAccessDiocese,
    canAccessChurch,
    
    // Profile data
    profile,
    roles,
  };
} 