export interface ChangeTempPasswordData {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  email: string;
  password: string;
  newPassword: string;
}

export interface PasswordRequirement {
  regex: RegExp;
  message: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}