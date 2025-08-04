import React, { useMemo } from "react";
import { type UseFormReturn } from "react-hook-form";
import { TextField } from "@/components/shared/Form/TextField";
import { AsyncSelectDropdownField } from "@/components/shared/Form/AsyncSelectDropdownField";
import { PhoneInputField } from "@/components/shared/Form/PhoneInputField";
import { Gender, type UserFormData } from "@/types/user.types";
import {
  EMAIL_REGEX,
  EMAIL_ERROR_MESSAGE,
  NAME_REGEX,
  NAME_ERROR_MESSAGE,
  AGE_MIN,
  AGE_MAX,
} from "@/constants/validation.constants";
import {
  useContextChurchDropdown,
  useContextDioceseDropdown,
  useUserChildRoles,
} from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/shared/usePermissions";
import { useAsyncDropdownLoadOptions } from "@/hooks/shared/useDropdownData";

interface UserFormContainerProps {
  methods: UseFormReturn<UserFormData>;
  isEdit?: boolean;
}

export const UserFormContainer: React.FC<UserFormContainerProps> = ({
  methods,
  isEdit = false,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = methods;

  // Get current user's permissions
  const { isDioceseAdmin, isChurchAdmin } = usePermissions();

  const { data: roleOption } = useUserChildRoles();
  const roleLoadOptions = useAsyncDropdownLoadOptions("role");

  // Filter role options based on current user's role
  const filteredRoleOptions = useMemo(() => {
    if (!roleOption?.data) return [];

    if (isDioceseAdmin) {
      // Diocese admin can only create Church Admin users
      return roleOption.data.filter((role) => role.label === "Church Admin");
    }

    if (isChurchAdmin) {
      // Church admin can only create Church Member users
      return roleOption.data.filter((role) => role.label === "Church Member");
    }

    // Super admin can create any role
    return roleOption.data;
  }, [roleOption?.data, isDioceseAdmin, isChurchAdmin]);

  const selectedRole = watch("roleOption");

  const roleLabel = selectedRole?.label || "";

  const selectedDiocese = watch("dioceseId");

  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(selectedDiocese?.id);

  // Gender options for dropdown
  const genderOptions = [
    { id: Gender.MALE, label: "Male" },
    { id: Gender.FEMALE, label: "Female" },
    { id: Gender.OTHERS, label: "Others" },
  ];

  // Helper functions to check role requirements
  const needsChurch = roleLabel === "Church Admin";

  const needDiocese =
    roleLabel === "Diocese Admin" || roleLabel === "Church Admin";

  // Determine if context fields should be disabled
  const isDioceseFieldDisabled = isDioceseAdmin || isChurchAdmin;
  const isChurchFieldDisabled = isChurchAdmin;

  return (
    <div className="space-y-10 px-2">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            name="firstName"
            label="First Name"
            register={register}
            validation={{
              required: "First name is required",
              pattern: {
                value: NAME_REGEX,
                message: NAME_ERROR_MESSAGE,
              },
            }}
            error={errors.firstName}
          />

          <TextField
            name="lastName"
            label="Last Name"
            register={register}
            validation={{
              required: "Last name is required",
              pattern: {
                value: NAME_REGEX,
                message: NAME_ERROR_MESSAGE,
              },
            }}
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            name="email"
            label="Email Address"
            type="email"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message: EMAIL_ERROR_MESSAGE,
              },
            }}
            error={errors.email}
          />

          <PhoneInputField
            name="phoneNo"
            label="Phone Number"
            control={control}
            error={errors.phoneNo}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AsyncSelectDropdownField
            name="gender"
            label="Gender"
            control={control}
            validation={{}}
            error={errors.gender?.id}
            defaultOptions={genderOptions}
            loadOptions={() => Promise.resolve(genderOptions)}
            placeholder="Select gender"
          />

          <TextField
            name="age"
            label="Age"
            type="number"
            register={register}
            validation={{
              min: {
                value: AGE_MIN,
                message: `Age must be at least ${AGE_MIN}`,
              },
              max: {
                value: AGE_MAX,
                message: `Age must not exceed ${AGE_MAX}`,
              },
            }}
            error={errors.age}
          />
        </div>
      </div>

      {/* Role and Organization */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          Role & Organization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AsyncSelectDropdownField
            name="roleOption"
            label="Role"
            control={control}
            validation={{ required: " " }}
            error={errors.roleOption?.id}
            defaultOptions={filteredRoleOptions || []}
            loadOptions={roleLoadOptions}
            isDisabled={isEdit}
          />

          {needDiocese && (
            <AsyncSelectDropdownField
              name="dioceseId"
              label="Diocese *"
              control={control}
              validation={{ required: "Diocese is required" }}
              error={errors.dioceseId?.id}
              defaultOptions={dioceseOptions?.data || []}
              loadOptions={() => Promise.resolve(dioceseOptions?.data || [])}
              isDisabled={isDioceseFieldDisabled}
            />
          )}

          {needsChurch && (
            <AsyncSelectDropdownField
              name="churchId"
              label="Church *"
              control={control}
              validation={{ required: "Church is required" }}
              error={errors.churchId?.id}
              defaultOptions={churchOptions?.data || []}
              loadOptions={() => Promise.resolve(churchOptions?.data || [])}
              isDisabled={isChurchFieldDisabled || !selectedDiocese}
            />
          )}
        </div>
      </div>
    </div>
  );
};
