import type { MultiSelectOption } from '@/components/shared/Form/AsyncSelectDropdownField';
import type { UserRolePermissions } from './role.types';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TEMPORARY = 'TEMPORARY',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export type UserFilterCriteria = {
  search?: string;
};

export type UserMenuData = {
  type: string;
  order: number;
  sub?: UserMenuData[];
};

export interface PhoneNo {
  countryCode: string;
  number: string;
}

export type UserMenuPermissionsConfig = {
  menu: UserMenuData[];
  permissions: UserRolePermissions;
  profile: UserData;
};

export type UserMenuPermissionsApiResponse = {
  success: boolean;
  data: UserMenuPermissionsConfig;
};

export type UserProfileApiResponse = {
  success: boolean;
  data: UserData;
};

export type Profile = {
  firstName: string;
  lastName: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  roleManagers: object;
};

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: PhoneNo;
  roles: Role[];
  status: UserStatus;
  gender?: Gender;
  age?: number;
  createdAt: string;
  dioceseId?: string;
  churchId?: string;
  familyId?: string;
  diocese?: { id: string; name: string };
  church?: { id: string; name: string };
  family?: { id: string; name: string };
};

export type UserListApiResponse = {
  success: boolean;
  data: {
    rows: UserData[];
    totalCount: number;
  };
};

export type UserDetailsResponse = {
  success: boolean;
  data: UserData;
};

export type User = {
  email: string;
  userId: string;
  isSuperAdmin: string;
};

export type UserUpsertData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  phoneNo: PhoneNo;
  gender?: Gender;
  age?: number;
  dioceseId?: string;
  churchId?: string;
  familyId?: string;
};

export type UserFormData = {
  id?: string;
  firstName: string;
  lastName: string;
  roleOption: MultiSelectOption;
  email: string;
  phoneNo: string;
  gender?: MultiSelectOption;
  age?: number;
  dioceseId?: MultiSelectOption;
  churchId?: MultiSelectOption;
  familyId?: MultiSelectOption;
};

export interface UserDeletePayload {
  id: string;
}

export type UserEnableDisablePayload = {
  userId: string;
};

export type UserPasswordChangePayload = {
  email: string;
  password: string;
  newPassword: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

// Form-specific types for create/edit user flow
export interface CreateUserFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roleOption: MultiSelectOption;
  phoneNumber: string;
  gender?: MultiSelectOption;
  age?: number;
  diocese?: MultiSelectOption;
  church?: MultiSelectOption;
  familyId?: string;
}

export interface CreateUserPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  phoneNo: PhoneNo;
  gender?: Gender;
  age?: number;
  dioceseId?: string;
  churchId?: string;
  familyId?: string;
}



export interface CreateUserProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export enum UserRole {
  DIOCESE_ADMIN = 'DIOCESE_ADMIN',
  CHURCH_ADMIN = 'CHURCH_ADMIN',
  CHURCH_MEMBER = 'CHURCH_MEMBER',
}

export const USER_ROLE_LABELS = {
  [UserRole.DIOCESE_ADMIN]: 'Diocese Admin',
  [UserRole.CHURCH_ADMIN]: 'Church Admin', 
  [UserRole.CHURCH_MEMBER]: 'Church Member',
};

export const GENDER_OPTIONS = [
  { id: 'MALE', label: 'Male' },
  { id: 'FEMALE', label: 'Female' },
  { id: 'OTHERS', label: 'Others' },
];
