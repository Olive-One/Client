import { type OrganizationFormData, type OrganizationPayload, type OrganizationType } from '@/types/organization.types';

export const prepareCreateOrganizationPayload = (data: OrganizationFormData): OrganizationPayload => {
  return {
    name: data.name,
    description: data.description,
    type: data.type.value as OrganizationType,
    establishedDate: data.establishedDate,
    contactNo: data.contactNo,
    email: data.email,
    dioceseId: data.diocese?.id || data.dioceseId || '',
    churchId: data.church?.id || data.churchId || '',
    address: {
      firstLine: data.firstLine,
      secondLine: data.secondLine,
      city: data.city,
      district: data.district,
      state: data.state,
      postCode: data.postCode,
    },
    members: data.members || [],
  };
};

export const prepareUpdateOrganizationPayload = (data: OrganizationFormData): OrganizationFormData => {
  return {
    ...data,
    dioceseId: data.diocese?.id || data.dioceseId,
    churchId: data.church?.id || data.churchId,
  };
};

export const transformOrganizationToFormData = (organization: any): OrganizationFormData => {
  return {
    id: organization.id,
    name: organization.name || '',
    description: organization.description || '',
    type: organization.type ? { 
      id: organization.type, 
      label: organization.type, 
      value: organization.type 
    } : { id: '', label: '', value: '' },
    establishedDate: organization.establishedDate || '',
    contactNo: organization.contactNo || '',
    email: organization.email || '',
    diocese: organization.diocese ? {
      id: organization.diocese.id,
      label: organization.diocese.name,
      value: organization.diocese.id,
    } : undefined,
    church: organization.church ? {
      id: organization.church.id,
      label: organization.church.name,
      value: organization.church.id,
    } : undefined,
    dioceseId: organization.diocese?.id || '',
    churchId: organization.church?.id || '',
    // Address fields
    firstLine: organization.address?.firstLine || '',
    secondLine: organization.address?.secondLine || '',
    city: organization.address?.city || '',
    district: organization.address?.district || '',
    state: organization.address?.state || '',
    postCode: organization.address?.postCode || '',
    // Members
    members: organization.members || [],
  };
};