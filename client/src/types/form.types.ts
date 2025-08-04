import type { UseFormReturn, FieldValues } from 'react-hook-form';

export interface FormStep<T extends FieldValues> {
  component: (methods: UseFormReturn<T, any, T>) => React.ReactNode;
  showAlert?: boolean;
  alertText?: string;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  isStepValid?: (methods: UseFormReturn<T, any, T>) => boolean;
}

export interface MultiSelectOption {
  id: string;
  label: string;
}