export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const EMAIL_ERROR_MESSAGE = 'Please enter a valid email address';

export const PHONE_REGEX = /^[+]?[1-9][\d\s\-\(\)]{7,15}$/;
export const PHONE_ERROR_MESSAGE = 'Please enter a valid phone number';

export const NAME_REGEX = /^[a-zA-Z\s]+$/;
export const NAME_ERROR_MESSAGE = 'Name should only contain letters and spaces';

export const AGE_MIN = 1;
export const AGE_MAX = 150;

// Password validation requirements
export const PASSWORD_REQUIREMENTS = [
  {
    regex: /.{8,}/,
    message: 'At least 8 characters long'
  },
  {
    regex: /[A-Z]/,
    message: 'Contains at least one uppercase letter'
  },
  {
    regex: /[a-z]/,
    message: 'Contains at least one lowercase letter'
  },
  {
    regex: /\d/,
    message: 'Contains at least one number'
  },
  {
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    message: 'Contains at least one special character'
  }
];