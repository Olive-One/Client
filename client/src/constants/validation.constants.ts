export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const EMAIL_ERROR_MESSAGE = 'Please enter a valid email address';

export const PHONE_REGEX = /^[+]?[1-9][\d\s\-\(\)]{7,15}$/;
export const PHONE_ERROR_MESSAGE = 'Please enter a valid phone number';

export const NAME_REGEX = /^[a-zA-Z\s]+$/;
export const NAME_ERROR_MESSAGE = 'Name should only contain letters and spaces';

export const AGE_MIN = 1;
export const AGE_MAX = 150;