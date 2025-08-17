import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { MultiStepForm } from '@/components/shared/Form/MultiStepForm';
import { ExpensePaymentForm } from './ExpensePaymentForm';
import type { ExpenseFormData } from '@/types/payments.types';
import type { FormStep } from '@/types/form.types';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  isSubmitLoading?: boolean;
  defaultValues?: ExpenseFormData;
  isEditMode?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitLoading = false,
  defaultValues,
  isEditMode = false,
}) => {
  const steps: FormStep<ExpenseFormData>[] = [
    {
      title: isEditMode ? 'Edit Expense' : 'Create New Expense',
      subtitle: 'Please fill in the expense information below',
      component: (methods: UseFormReturn<ExpenseFormData>) => (
        <ExpensePaymentForm 
          methods={methods} 
          isEdit={isEditMode}
        />
      ),
      submitButtonText: isEditMode ? 'Update Expense' : 'Create Expense',
      modalSize: '3xl',
      isStepValid: (methods: UseFormReturn<ExpenseFormData>) => {
        const { formState } = methods;
        // Basic validation - all required fields must be valid
        return formState.isValid;
      },
    },
  ];

  return (
    <MultiStepForm
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Expense' : 'Create New Expense'}
      steps={steps}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      isSubmitLoading={isSubmitLoading}
    />
  );
};