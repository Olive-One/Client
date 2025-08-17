import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type UseFormRegister, type FieldError, type RegisterOptions, type Path, type FieldValues } from 'react-hook-form';

interface PasswordInputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldError;
  validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const PasswordInputField = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  register,
  error,
  validation = {},
  placeholder,
  className = '',
  isRequired = false,
  isDisabled = false,
}: PasswordInputFieldProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={isDisabled}
          className={`pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          {...register(name, validation)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isDisabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};