import React, { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import RoleForm from './RoleForm';
import { useCreateUserRole } from '@/hooks/useRoles';
import { type CreateRoleType } from '@/types/role.types';

type CreateRoleProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateRole: React.FC<CreateRoleProps> = ({ isOpen, onClose }) => {
  const [isLoading, setLoading] = useState(false);
  const { mutateAsync: addRole } = useCreateUserRole();

  const handleSubmit: SubmitHandler<CreateRoleType> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        permissions: data.permissions,
        childRoles: data.childRoles,
      };
      
      await addRole(payload);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Error creating role:', error);
    }
  };

  return (
    <RoleForm
      isLoading={isLoading}
      formData={null}
      isOpen={isOpen}
      onClose={onClose}
      submitHandler={handleSubmit}
      title="Create Role"
    />
  );
};

export default CreateRole;