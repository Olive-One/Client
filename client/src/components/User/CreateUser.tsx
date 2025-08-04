import React from 'react';
import { UserForm } from './UserForm';
import { transformToUserPayload } from '@/utils/userFormUtils';
import { type CreateUserProps, type UserFormData } from '@/types/user.types';
import { useCreateUser } from '@/hooks/useUsers';

export const CreateUser: React.FC<CreateUserProps> = ({ isOpen, onClose }) => {
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data: UserFormData) => {
    const payload = transformToUserPayload(data);
    createUser(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <UserForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitLoading={isPending}
      isEditMode={false}
    />
  );
};