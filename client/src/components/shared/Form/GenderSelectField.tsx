import React from 'react';
import { Controller, type Control, type FieldError, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import AsyncSelectDropdown, { type MultiSelectOption } from '../AsyncSelectDropdown/AsyncSelectDropDown';
import { GENDER_OPTIONS } from '@/types/family.types';

type GenderSelectFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  error?: FieldError;
  validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  defaultValue?: MultiSelectOption;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
};

export const GenderSelectField = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  control,
  validation,
  error,
  placeholder = 'Select gender...',
  defaultValue,
  isDisabled = false,
  isRequired = false,
  className = '',
}: GenderSelectFieldProps<TFieldValues>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={validation}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, onBlur } }) => (
          <AsyncSelectDropdown
            name={name}
            placeholder={placeholder}
            defaultOptions={GENDER_OPTIONS}
            value={value}
            loadOptions={() => Promise.resolve(GENDER_OPTIONS)}
            onChange={onChange}
            onBlur={onBlur}
            isDisabled={isDisabled}
            isClearable={!isRequired}
          />
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};