import type { UserPermissions } from "@/constants/role.constants";

export type UserRolePermissions = {
  [key in UserPermissions]: boolean;
};

export type RoleManagers = {
  SuperAdmin: boolean;
};

export type Permissions = {
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRoles = {
  id: string;
  name: string;
  description: string;
  displayName: string;
  roleManagers: RoleManagers;
  createdAt: string;
  updatedAt: string;
};
export type UserRolesListApiResponse = {
  success: string;
  data: {
    rows: UserRoles[];
    totalCount: number;
    pageSize: number | null;
    pageIndex: number | null;
    sortEnabledColumns: string[];
  };
};

export type UserRolesDetailsResp = {
  success: string;
  data: {
    id: string;
    name: string;
    description: string;
    displayName: string;
    roleManagers: RoleManagers;
    createdAt: string;
    updatedAt: string;
    permissions: Permissions[];
    childRoles?: string[];
  };
};

export type UserRolesUpdatePayload = {
  id?: string;
  displayName: string;
  description: string;
  permissions: string[];
  childRoles?: string[];
};

export type CreateUserRolePayload = {
  displayName: string;
  name: string;
  permissions: string[];
  childRoles?: string[];
  description?: string | undefined;
};

export type CreateRoleType = {
  id?: string | undefined;
  name: string;
  displayName: string;
  role: string;
  description: string;
  permissions: string[];
  childRoles?: string[];
};

export type GetPermissionsApiResp = {
  success: string;
  data: {
    permissions: Permissions[];
  };
};

export type UserRoleFilterCriteria = {
  search?: string;
};
