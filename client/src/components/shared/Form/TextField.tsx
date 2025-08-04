import { type UseFormRegister, type FieldError, type RegisterOptions, type Path, type FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextFieldProps<TFormValues extends FieldValues> {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  validation?: RegisterOptions<TFormValues, Path<TFormValues>>;
  isMandatory?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

export const TextField = <TFormValues extends FieldValues>({
  label,
  name,
  register,
  error,
  validation,
  isMandatory = false,
  type = 'text',
  placeholder,
  isDisabled = false,
  className = '',
}: TextFieldProps<TFormValues>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {isMandatory && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={isDisabled}
        className={`${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...register(name, validation)}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};