import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { MultiStepForm } from '@/components/shared/Form/MultiStepForm';
import { UserFormContainer } from './UserFormContainer';
import type { UserFormData } from '@/types/user.types';
import type { FormStep } from '@/types/form.types';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isSubmitLoading?: boolean;
  defaultValues?: UserFormData;
  currentUserRole?: string;
  isEditMode?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitLoading = false,
  defaultValues,
  isEditMode = false,
}) => {
  const steps: FormStep<UserFormData>[] = [
    {
      title: isEditMode ? 'Edit User' : 'Create New User',
      subtitle: 'Please fill in the user information below',
      component: (methods: UseFormReturn<UserFormData>) => (
        <UserFormContainer 
          methods={methods} 
          isEdit={isEditMode}
        />
      ),
      submitButtonText: isEditMode ? 'Update User' : 'Create User',
      modalSize: '3xl',
      isStepValid: (methods: UseFormReturn<UserFormData>) => {
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
      title={isEditMode ? 'Edit User' : 'Create New User'}
      steps={steps}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      isSubmitLoading={isSubmitLoading}
    />
  );
};