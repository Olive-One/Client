import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomModal from '@/components/shared/customModal/CustomModal';
import { TextField } from '@/components/shared/Form/TextField';
import { type CreateRoleType } from '@/types/role.types';
import { useGetPermissions, useGetChildRoles } from '@/hooks/useRoles';
import UserPermissions from './UserPermissions';
import ChildRoles from './ChildRoles';

type RoleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  formData: CreateRoleType | null;
  submitHandler: (data: CreateRoleType) => void;
  title: string;
};

const RoleForm: React.FC<RoleFormProps> = ({ 
  isOpen, 
  onClose, 
  formData, 
  isLoading, 
  submitHandler, 
  title 
}) => {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [selectedChildRoleIds, setSelectedChildRoleIds] = useState<string[]>([]);

  const {
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleType>();

  const { data: permissionsList } = useGetPermissions();
  const { data: childRolesList } = useGetChildRoles();
  const watchedPermissions = watch('permissions');

  const onFormSubmit = (data: CreateRoleType) => {
    submitHandler(data);
  };

  const handleClose = () => {
    reset();
    setSelectedPermissionIds([]);
    setSelectedChildRoleIds([]);
    onClose();
  };

  useEffect(() => {
    setValue('permissions', selectedPermissionIds);
    setValue('childRoles', selectedChildRoleIds);
  }, [selectedPermissionIds, selectedChildRoleIds, setValue]);

  useEffect(() => {
    if (formData) {
      reset(formData);
      setSelectedPermissionIds(formData.permissions || []);
      setSelectedChildRoleIds(formData.childRoles || []);
    }
  }, [formData, reset]);



  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="4xl"
      footer={
        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!watchedPermissions?.length || isLoading}
            onClick={handleSubmit(onFormSubmit)}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            name="name"
            label="Name"
            register={register}
            validation={{
              required: "Name is required",
            }}
            error={errors?.name}
          />
          
          <TextField
            name="displayName"
            label="Display Name"
            register={register}
            validation={{
              required: "Display name is required",
            }}
            error={errors?.displayName}
          />
          
          <TextField
            name="description"
            label="Description"
            register={register}
            validation={{
              required: "Description is required",
            }}
            error={errors?.description}
          />
        </div>

        {/* Permissions Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            {Object.entries(permissionsList?.data || []).map(([category, permissions]) => (
              <UserPermissions
                key={category}
                permissions={permissions}
                category={category}
                selectedIds={selectedPermissionIds}
                setSelectedIds={setSelectedPermissionIds}
              />
            ))}
          </CardContent>
        </Card>

        {/* Child Roles Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Child Roles</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto">
            <ChildRoles
              childRoles={childRolesList?.data || []}
              selectedIds={selectedChildRoleIds}
              setSelectedIds={setSelectedChildRoleIds}
            />
          </CardContent>
        </Card>
      </form>
    </CustomModal>
  );
};

export default RoleForm;