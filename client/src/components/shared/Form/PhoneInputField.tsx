import React from 'react';
import { Controller, type FieldError, type Control, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import PhoneInput, { type Country, isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  control: Control<TFieldValues>;
  validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: FieldError;
  countryCode?: Country;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const PhoneInputField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  validation = {},
  error,
  countryCode = 'GB',
  className = '',
  isRequired = false,
  isDisabled = false,
}: PhoneInputFieldProps<TFieldValues>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        rules={{
          ...validation,
          validate: (value) => {
            if (isRequired && value) {
              return isValidPhoneNumber(value) || 'Please enter a valid phone number';
            }
            if (isRequired && !value) {
              return 'Please enter a valid phone number';
            }
            return true;
          },
        }}
        render={({ field: { onChange, value, ref } }) => {
          return (
            <PhoneInput
              ref={ref}
              international
              defaultCountry={countryCode}
              value={value || ''}
              onChange={onChange}
              disabled={isDisabled}
              className={`
                flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
                file:border-0 file:bg-transparent file:text-sm file:font-medium 
                placeholder:text-muted-foreground 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:cursor-not-allowed disabled:opacity-50
                ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              `}
            />
          );
        }}
      />
      
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};