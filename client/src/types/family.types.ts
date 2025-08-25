import type { MultiSelectOption } from '@/components/shared/AsyncSelectDropdown/AsyncSelectDropDown';

export enum FamilyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface FamilyAddress {
  firstLine: string;
  secondLine: string;
  city: string;
  district: string;
  state: string;
  postCode: string;
}

export interface FamilyMember {
  id?: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNo: string;
  age: number;
  gender: MultiSelectOption;
  isHeadOfFamily: boolean;
  relationshipToHead: string;
  dateOfBirth: string;
  occupation?: string;
  maritalStatus?: string;
}

export interface FamilyMemberAPI {
  id?: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNo: string;
  age: number;
  gender: string; // String for API instead of MultiSelectOption
  isHeadOfFamily: boolean;
  relationshipToHead: string;
  dateOfBirth: string;
  occupation?: string;
  maritalStatus?: string;
}

export interface Family {
  id: string;
  name: string;
  contactNo: string;
  email: string;
  status: FamilyStatus;
  memberCount: number;
  headOfFamily?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  address: FamilyAddress;
  diocese: {
    id: string;
    name: string;
  };
  church: {
    id: string;
    name: string;
    dioceseId: string;
  };
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyFormData {
  id?: string;
  name: string;
  contactNo: string;
  email: string;
  diocese?: MultiSelectOption;
  church?: MultiSelectOption;
  dioceseId?: string;
  churchId?: string;
  // Address fields
  firstLine: string;
  secondLine: string;
  city: string;
  district: string;
  state: string;
  postCode: string;
  // Members
  members: FamilyMember[];
}

export interface FamilyPayload {
  id?: string;
  name : string;
  churchId : string,
  dioceseId : string,
  headOfFamilyId : string,
  firstLine : string,
  secondLine : string,
  postCode : string,
  city : string,
  district : string,
  state : string,
  contactNo : string,
  members : FamilyMemberAPI[], // Use API version with string gender
}

export interface FamilyFilterCriteria {
  search?: string;
  dioceseId?: string | null;
  churchId?: string | null;
  status?: FamilyStatus | null;
}

export interface FamilyListApiResponse {
  success: boolean;
  data: {
    rows: Family[];
    totalCount: number;
    sortEnabledColumns?: string[];
  };
}

export interface FamilyDetailsApiResponse {
  success: boolean;
  data: Family;
}

export interface CreateFamilyProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditFamilyProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFamilyId: string;
}

export const RELATIONSHIP_OPTIONS = [
  { id: 'SPOUSE', label: 'Spouse', value: 'SPOUSE' },
  { id: 'CHILD', label: 'Child', value: 'CHILD' },
  { id: 'PARENT', label: 'Parent', value: 'PARENT' },
  { id: 'SIBLING', label: 'Sibling', value: 'SIBLING' },
  { id: 'GRANDPARENT', label: 'Grandparent', value: 'GRANDPARENT' },
  { id: 'GRANDCHILD', label: 'Grandchild', value: 'GRANDCHILD' },
  { id: 'OTHER', label: 'Other', value: 'OTHER' },
];

export const MARITAL_STATUS_OPTIONS = [
  { id: 'SINGLE', label: 'Single', value: 'SINGLE' },
  { id: 'MARRIED', label: 'Married', value: 'MARRIED' },
  { id: 'DIVORCED', label: 'Divorced', value: 'DIVORCED' },
  { id: 'WIDOWED', label: 'Widowed', value: 'WIDOWED' },
];

export const GENDER_OPTIONS = [
  { id: 'MALE', label: 'Male', value: 'MALE' },
  { id: 'FEMALE', label: 'Female', value: 'FEMALE' },
  { id: 'OTHER', label: 'Other', value: 'OTHER' },
];