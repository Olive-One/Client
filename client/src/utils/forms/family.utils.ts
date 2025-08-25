import { type FamilyFormData, type FamilyPayload, type FamilyMemberAPI } from '@/types/family.types';

export const prepareCreateFamilyPayload = (data: FamilyFormData): FamilyPayload => {
  console.log("data for create family", data)
  
  // Transform members to ensure age is a number and gender is a string
  const transformedMembers: FamilyMemberAPI[] = data.members.map(member => ({
    ...member,
    gender: member.gender?.value || '', // Extract string value from MultiSelectOption
    age: member.age ? Number(member.age) : 0, // Convert string to number, default to 0 if empty
    email: member.email && member.email.trim() !== '' ? member.email : null,
  }));
  
  return {
    name: data.name,
    churchId: data.church?.id || data.churchId || '',
    dioceseId: data.diocese?.id || data.dioceseId || '',
    headOfFamilyId: data.members.find((member) => member.isHeadOfFamily)?.id || '',
    firstLine: data.firstLine,
    secondLine: data.secondLine,
    postCode: data.postCode,
    city: data.city,
    district: data.district,
    state: data.state,
    contactNo: data.contactNo,
    members: transformedMembers,
  };
};

export const prepareUpdateFamilyPayload = (data: FamilyFormData): FamilyFormData => {
  
  return {
    ...data,
    dioceseId: data.diocese?.id || data.dioceseId,
    churchId: data.church?.id || data.churchId,
    members: data.members,
  };
};

export const transformFamilyToFormData = (family: any): FamilyFormData => {
  return {
    id: family.id,
    name: family.name || '',
    contactNo: family.contactNo || '',
    email: family.email || '',
    diocese: family.diocese ? {
      id: family.diocese.id,
      label: family.diocese.name,
      value: family.diocese.id,
    } : undefined,
    church: family.church ? {
      id: family.church.id,
      label: family.church.name,
      value: family.church.id,
    } : undefined,
    dioceseId: family.diocese?.id || '',
    churchId: family.church?.id || '',
    // Address fields
    firstLine: family.address?.firstLine || '',
    secondLine: family.address?.secondLine || '',
    city: family.address?.city || '',
    district: family.address?.district || '',
    state: family.address?.state || '',
    postCode: family.address?.postCode || '',
    // Members
    members: family.members || [],
  };
};