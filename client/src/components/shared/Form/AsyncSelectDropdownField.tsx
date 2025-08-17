import React from 'react';
import { Controller, type Control, type FieldError, type RegisterOptions, type FieldValues, type Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import AsyncSelectDropdown, { type MultiSelectOption } from '../AsyncSelectDropdown/AsyncSelectDropDown';

type AsyncSelectFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  defaultOptions: MultiSelectOption[];
  control: Control<TFieldValues>;
  error?: FieldError;
  validation?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  isMulti?: boolean;
  placeholder?: string;
  defaultValue?: MultiSelectOption | MultiSelectOption[];
  loadOptions: (inputValue: string) => Promise<MultiSelectOption[]>;
  isDisabled?: boolean;
  cacheOptions?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  className?: string;
  maxMenuHeight?: number;
};

export const AsyncSelectDropdownField = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  defaultOptions,
  control,
  validation,
  isMulti = false,
  placeholder,
  defaultValue,
  loadOptions,
  isDisabled = false,
  cacheOptions = true,
  isClearable = true,
  isRequired = false,
  className = '',
  maxMenuHeight = 240,
}: AsyncSelectFieldProps<TFieldValues>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Controller
        control={control}
        name={name}
        rules={validation}
        render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
          <>
            <Label htmlFor={name} className="text-sm font-medium text-foreground">
              {label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <AsyncSelectDropdown
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              defaultOptions={defaultOptions}
              placeholder={placeholder || ''}
              isMulti={isMulti}
              defaultValue={defaultValue}
              loadOptions={loadOptions}
              isDisabled={isDisabled}
              cacheOptions={cacheOptions}
              isClearable={isClearable}
              maxMenuHeight={maxMenuHeight}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export { type MultiSelectOption };