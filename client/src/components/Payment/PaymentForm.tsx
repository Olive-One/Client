import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { MultiStepForm } from '@/components/shared/Form/MultiStepForm';
import { IncomePaymentForm } from './IncomePaymentForm';
import type { PaymentFormData } from '@/types/payments.types';
import type { FormStep } from '@/types/form.types';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitLoading?: boolean;
  defaultValues?: PaymentFormData;
  isEditMode?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitLoading = false,
  defaultValues,
  isEditMode = false,
}) => {
  const steps: FormStep<PaymentFormData>[] = [
    {
      title: isEditMode ? 'Edit Payment' : 'Create New Payment',
      subtitle: 'Please fill in the payment information below',
      component: (methods: UseFormReturn<PaymentFormData>) => (
        <IncomePaymentForm 
          methods={methods} 
          isEdit={isEditMode}
        />
      ),
      submitButtonText: isEditMode ? 'Update Payment' : 'Create Payment',
      modalSize: '3xl',
      isStepValid: (methods: UseFormReturn<PaymentFormData>) => {
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
      title={isEditMode ? 'Edit Payment' : 'Create New Payment'}
      steps={steps}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      isSubmitLoading={isSubmitLoading}
    />
  );
};