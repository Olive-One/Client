import { Gender, type CreateUserFormData, type CreateUserPayload, type PhoneNo, type UserData, type UserFormData, type UserUpsertData } from '@/types/user.types';
import { type CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

type PhoneNumberInput = {
	countryCode: string;
	number: string;
};

export const formatPhoneNumber = (phoneNumber: PhoneNumberInput): string => {
	if (!phoneNumber?.number) return '';
	const parsedPhoneNumber = parsePhoneNumberFromString(`${phoneNumber.number}`, phoneNumber.countryCode as CountryCode);
	return parsedPhoneNumber ? parsedPhoneNumber.format('E.164') : '';
};

const parsePhoneNumber = (phoneNumber: string): PhoneNo => {
	try {
		const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
		if (parsedPhoneNumber) {
			return {
				countryCode: parsedPhoneNumber.country || '',
				number: parsedPhoneNumber.nationalNumber || '',
			};
		}
	} catch (error) {
		console.error('Error in parsing phone number', error);
	}
	return {
		countryCode: '',
		number: '',
	};
};

export const transformToUserPayload = (data: UserFormData): CreateUserPayload => {
	const { firstName, lastName, roleOption, email, phoneNo, id, dioceseId, churchId, familyId, gender, age } = data;
	const parsedPhoneNo = parsePhoneNumber(phoneNo);
	
	// Convert age to number if it exists and is valid
	let validAge: number | undefined;
	if (age) {
		const parsedAge = Number(age);
		validAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 150 ? parsedAge : undefined;
	}
	
	const payload: UserUpsertData = {
		id,
		firstName,
		lastName,
		userRole: roleOption.id,
		email,
		phoneNo: parsedPhoneNo,
		gender: gender?.id as Gender,
		age: validAge,
		dioceseId: dioceseId?.id,
		churchId: churchId?.id,
		familyId: familyId?.id,
	};
	return payload;
};



export const transformUserDataToFormData = (data: UserData | null): UserFormData => {
	if (!data) {
		return {} as UserFormData;
	}
	try {
		const { id, email, firstName, lastName, phoneNo, roles, diocese, church, family, gender, age } = data;

		let validAge: number | undefined;
	if (age) {
		const parsedAge = Number(age);
		validAge = !isNaN(parsedAge) && parsedAge > 0 && parsedAge <= 150 ? parsedAge : undefined;
	}
		const formattedPhoneNumber = formatPhoneNumber({
			number: phoneNo?.number,
			countryCode: phoneNo?.countryCode as CountryCode,
		});
		const formData: UserFormData = {
			id,
			firstName: firstName,
			lastName: lastName,
			roleOption: {
				id: roles[0].id,
				label: roles[0].displayName,
			},
			phoneNo: formattedPhoneNumber,
			email,
			gender: gender ? { id: gender, label: gender === Gender.MALE ? 'Male' : gender === Gender.FEMALE ? 'Female' : 'Others' } : undefined,
			age: validAge,
			dioceseId: diocese ? { id: diocese.id, label: diocese.name, value: diocese.id } : undefined,
			churchId: church ? { id: church.id, label: church.name, value: church.id } : undefined,
			familyId: family ? { id: family.id, label: family.name, value: family.id } : undefined,
		};

		return formData;
	} catch (error) {
		console.error(error);
		return {} as UserFormData;
	}
};

/**
 * Validate form data before submission
 */
export const validateUserFormData = (formData: CreateUserFormData): string[] => {
  const errors: string[] = [];

  // Required field validation
  if (!formData.firstName.trim()) {
    errors.push('First name is required');
  }

  if (!formData.lastName.trim()) {
    errors.push('Last name is required');
  }

  if (!formData.email.trim()) {
    errors.push('Email is required');
  }

  if (!formData.roleOption.id) {
    errors.push('Role is required');
  }

  // Age validation
  if (formData.age !== undefined && formData.age !== null) {
    const age = Number(formData.age);
    if (isNaN(age) || age < 1 || age > 150) {
      errors.push('Age must be between 1 and 150');
    }
  }

  return errors;
};