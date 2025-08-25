import type { MultiSelectOption } from '@/components/shared/AsyncSelectDropdown/AsyncSelectDropDown';

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum OrganizationType {
  YOUTH = 'YOUTH',
  WOMEN = 'WOMEN',
  MEN = 'MEN',
  CHOIR = 'CHOIR',
  PRAYER_GROUP = 'PRAYER_GROUP',
  MINISTRY = 'MINISTRY',
  OTHER = 'OTHER',
}

export interface OrganizationAddress {
  firstLine: string;
  secondLine: string;
  city: string;
  district: string;
  state: string;
  postCode: string;
}

export interface OrganizationMember {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  position: string;
  isLeader: boolean;
  joinDate: string;
  status: OrganizationStatus;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  type: OrganizationType;
  status: OrganizationStatus;
  establishedDate: string;
  contactNo: string;
  email: string;
  address: OrganizationAddress;
  memberCount: number;
  leader?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  diocese: {
    id: string;
    name: string;
  };
  church: {
    id: string;
    name: string;
    dioceseId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFormData {
  id?: string;
  name: string;
  description: string;
  type: MultiSelectOption;
  establishedDate: string;
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
  members: OrganizationMember[];
}

export interface OrganizationPayload {
  id?: string;
  name: string;
  description: string;
  type: OrganizationType;
  establishedDate: string;
  contactNo: string;
  email: string;
  dioceseId: string;
  churchId: string;
  address: OrganizationAddress;
  members: OrganizationMember[];
}

export interface OrganizationFilterCriteria {
  search?: string;
  dioceseId?: string | null;
  churchId?: string | null;
  type?: OrganizationType | null;
  status?: OrganizationStatus | null;
}

export interface OrganizationListApiResponse {
  success: boolean;
  data: {
    rows: Organization[];
    totalCount: number;
    sortEnabledColumns?: string[];
  };
}

export interface OrganizationDetailsApiResponse {
  success: boolean;
  data: Organization;
}

export interface CreateOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrganizationId: string;
}

export const ORGANIZATION_TYPE_OPTIONS = [
  { id: 'YOUTH', label: 'Youth Group', value: 'YOUTH' },
  { id: 'WOMEN', label: 'Women Group', value: 'WOMEN' },
  { id: 'MEN', label: 'Men Group', value: 'MEN' },
  { id: 'CHOIR', label: 'Choir', value: 'CHOIR' },
  { id: 'PRAYER_GROUP', label: 'Prayer Group', value: 'PRAYER_GROUP' },
  { id: 'MINISTRY', label: 'Ministry', value: 'MINISTRY' },
  { id: 'OTHER', label: 'Other', value: 'OTHER' },
];

export const ORGANIZATION_STATUS_OPTIONS = [
  { id: 'ACTIVE', label: 'Active', value: 'ACTIVE' },
  { id: 'INACTIVE', label: 'Inactive', value: 'INACTIVE' },
];

export const MEMBER_POSITION_OPTIONS = [
  { id: 'PRESIDENT', label: 'President', value: 'PRESIDENT' },
  { id: 'VICE_PRESIDENT', label: 'Vice President', value: 'VICE_PRESIDENT' },
  { id: 'SECRETARY', label: 'Secretary', value: 'SECRETARY' },
  { id: 'TREASURER', label: 'Treasurer', value: 'TREASURER' },
  { id: 'MEMBER', label: 'Member', value: 'MEMBER' },
];