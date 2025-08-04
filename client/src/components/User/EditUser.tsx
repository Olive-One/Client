import React from 'react';
import { UserForm } from './UserForm';
import { transformToUserPayload, transformUserDataToFormData } from '@/utils/userFormUtils';
import { type EditUserProps, type UserFormData } from '@/types/user.types';
import { useUserDetails, useUserUpdate } from '@/hooks/useUsers';

export const EditUser: React.FC<EditUserProps> = ({ isOpen, onClose, userId }) => {
  const { mutate: updateUser, isPending } = useUserUpdate();
  
  const { data: userData, isLoading } = useUserDetails(userId);
  const handleSubmit = (data: UserFormData) => {
    const payload = transformToUserPayload(data);
    updateUser(
      { id: userId, ...payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const defaultValues = userData ? transformUserDataToFormData(userData?.data) : undefined;

  if (isLoading) {
    return null; // Or loading spinner
  }

  return (
    <UserForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitLoading={isPending}
      defaultValues={defaultValues}
      isEditMode={true}
    />
  );
};