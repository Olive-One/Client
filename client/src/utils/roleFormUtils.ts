import { type CreateRoleType, type UserRolesDetailsResp } from "@/types/role.types";

const convertRoleDetailsApiResposeToFormData = (res: UserRolesDetailsResp | undefined): CreateRoleType | null => {
  if (res) {
    const permissionsId = res.data?.permissions.map((permission) => permission.id);
    return {
      name: res.data?.name,
      displayName: res.data?.displayName,
      description: res.data?.description,
      role: '',
      permissions: permissionsId,
      childRoles: res.data?.childRoles || [],
    };
  }
  return null;
};

export { convertRoleDetailsApiResposeToFormData };