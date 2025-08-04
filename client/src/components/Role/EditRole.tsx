import RoleForm from './RoleForm';
import { useUserRoleDetails, useUserRoleUpdate } from '@/hooks/useRoles';
import { type CreateRoleType } from '@/types/role.types';
import { convertRoleDetailsApiResposeToFormData } from '@/utils/roleFormUtils';
import React, { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';

type EditRoleProps = {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
};

const EditRole: React.FC<EditRoleProps> = ({ isOpen, onClose, roleId }) => {
  const [isLoading, setLoading] = useState(false);
  const { mutateAsync: editRole } = useUserRoleUpdate();

  const { data: roleDetails, isLoading: isRoleDetailsLoading } = useUserRoleDetails(roleId);

  const formData = convertRoleDetailsApiResposeToFormData(roleDetails);

  const handleSubmit: SubmitHandler<CreateRoleType> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        id: roleId,
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        permissions: data.permissions,
        childRoles: data.childRoles,
      };
      
      await editRole(payload);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Error updating role:', error);
    }
  };

  return (
    <RoleForm
      isLoading={isLoading || isRoleDetailsLoading}
      formData={formData}
      isOpen={isOpen}
      onClose={onClose}
      submitHandler={handleSubmit}
      title="Edit Role"
    />
  );
};

export default EditRole;