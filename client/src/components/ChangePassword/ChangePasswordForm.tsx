import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, X } from 'lucide-react';
import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
  type UseFormWatch,
} from 'react-hook-form';
import {
  EMAIL_ERROR_MESSAGE,
  EMAIL_REGEX,
  PASSWORD_REQUIREMENTS,
} from '@/constants/validation.constants';
import { type ChangeTempPasswordData } from '@/types/changePassword.types';
import { TextField } from '@/components/shared/Form/TextField';
import { PasswordInputField } from '@/components/shared/Form/PasswordInputField';

interface ChangePasswordFormProps {
  control: Control<ChangeTempPasswordData>;
  register: UseFormRegister<ChangeTempPasswordData>;
  watch: UseFormWatch<ChangeTempPasswordData>;
  errors: FieldErrors<ChangeTempPasswordData>;
  isLoading?: boolean;
  email: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  errors,
  watch,
  register,
  isLoading,
  email,
}) => {
  const newPasswordValue = watch('newPassword');

  const validateConfirmPassword = (val: string) => {
    const newPasswordValue = watch('newPassword');
    if (newPasswordValue !== val) {
      return 'Your passwords do not match';
    }
  };

  const validatePasswordStrength = (password: string) => {
    if (!password) return 'Password is required';
    
    const failedRequirements = PASSWORD_REQUIREMENTS.filter(
      req => !req.regex.test(password)
    );
    
    if (failedRequirements.length > 0) {
      return 'Password does not meet all requirements';
    }
    
    return true;
  };

  return (
    <div className="space-y-6 w-full">
      <TextField
        name="email"
        label="Email"
        register={register}
        validation={{
          required: 'Email is required',
          value: email,
          pattern: {
            value: EMAIL_REGEX,
            message: EMAIL_ERROR_MESSAGE,
          },
        }}
        error={errors.email}
        placeholder="E-mail"
      />

      <PasswordInputField
        name="newPassword"
        label="New Password"
        register={register}
        validation={{
          required: 'Password is required',
          validate: validatePasswordStrength,
        }}
        error={errors.newPassword}
        placeholder="Your new Password"
      />

      {newPasswordValue && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-foreground mb-3">
              Password Requirements:
            </p>
            <div className="space-y-2">
              {PASSWORD_REQUIREMENTS.map((requirement, index) => {
                const isValid = requirement.regex.test(newPasswordValue);
                return (
                  <div key={index} className="flex items-center gap-2">
                    {isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        isValid ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {requirement.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <PasswordInputField
        name="confirmPassword"
        label="Confirm Password"
        register={register}
        validation={{
          required: 'Confirmation is required',
          validate: validateConfirmPassword,
        }}
        error={errors.confirmPassword}
        placeholder="Type new password once again"
        isRequired
      />

      <Button
        type="submit"
        className="w-full min-w-[200px]"
        disabled={!!Object.keys(errors).length || isLoading}
      >
        {isLoading ? 'Loading...' : 'Update password'}
      </Button>
    </div>
  );
};

export default ChangePasswordForm;