import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { TextField } from "@/components/shared/Form/TextField";
import {
  type FamilyFormData,
  RELATIONSHIP_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/types/family.types";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  useContextDioceseDropdown,
  useContextChurchDropdown,
} from "@/hooks/shared/useDropdownData";
import { usePermissions } from "@/hooks/shared/usePermissions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AsyncSelectDropdownField } from "../shared/Form/AsyncSelectDropdownField";
import { PhoneInputField } from "../shared/Form/PhoneInputField";
import { GenderSelectField } from "../shared/Form/GenderSelectField";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatePicker } from "../shared/date-picker/DatePicker";

interface FamilyMembersFormProps {
  isEdit?: boolean;
  methods: UseFormReturn<FamilyFormData>;
  familyId?: string;
  onValidationChange?: (isValid: boolean) => void;
}

const FamilyMembersForm: React.FC<FamilyMembersFormProps> = ({
  methods,
  isEdit,
  familyId,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const {
    formState: { errors },
    register,
    control,
    setValue,
    watch,
  } = methods;

  const { isDioceseAdmin, isChurchAdmin } = usePermissions();

  // Watch for dioceseId changes to filter churches
  const selectedDiocese = watch("diocese");

  // Use context-aware dropdown for diocese and church
  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(selectedDiocese?.id);

  // Use field array for dynamic members
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  // Watch members to handle head of family logic
  const members = watch("members") || [];

  // Notify parent component when validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [members, onValidationChange]);

  // Check if current member form is completely filled
  const isCurrentMemberFormComplete = (index: number) => {
    const member = members[index];
    if (!member) return false;

    // Required fields for any member
    const hasFirstName = member.firstName && member.firstName.trim() !== "";

    // If this member is head of family, email is also required
    if (member.isHeadOfFamily) {
      const hasEmail = member.email && member.email.trim() !== "";
      return hasFirstName && hasEmail;
    }

    return hasFirstName;
  };

  // Check if the last member form is complete (to enable adding new member)
  const canAddNewMember = () => {
    if (fields.length === 0) return true; // Can always add first member
    return isCurrentMemberFormComplete(fields.length - 1);
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (fields.length === 0) return false; // Must have at least one member

    // Check if exactly one member is head of family
    const headOfFamilyCount = members.filter(
      (member) => member?.isHeadOfFamily
    ).length;
    if (headOfFamilyCount !== 1) return false;

    // Check if all members have required fields
    return members.every((member, index) => isCurrentMemberFormComplete(index));
  };

  // Handle head of family toggle
  const handleHeadOfFamilyToggle = (index: number, isChecked: boolean) => {
    if (isChecked) {
      // Turn off all other head of family toggles
      members.forEach((_, memberIndex) => {
        if (memberIndex !== index) {
          setValue(`members.${memberIndex}.isHeadOfFamily`, false);
        }
      });
    }
    setValue(`members.${index}.isHeadOfFamily`, isChecked);
  };

  // Add new member
  const addMember = () => {
    append({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      age: 0,
      gender: "",
      isHeadOfFamily: false,
      relationshipToHead: "",
      dateOfBirth: "",
      occupation: "",
      maritalStatus: "",
    });
  };

  // Remove member
  const removeMember = (index: number) => {
    // Don't allow removing if it's the only member
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Auto-select diocese for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && dioceseOptions?.data?.length === 1) {
      const selectedDiocese = dioceseOptions?.data[0];
      setValue("diocese", selectedDiocese);
      setValue("dioceseId", selectedDiocese?.id as string);
    }
  }, [isDioceseAdmin, isEdit, dioceseOptions, setValue]);

  // Auto-select church for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && churchOptions?.data?.length === 1) {
      const selectedChurch = churchOptions?.data[0];
      setValue("church", selectedChurch);
      setValue("churchId", selectedChurch?.id as string);
      setValue("dioceseId", selectedChurch?.dioceseId as string);
    }
  }, [isChurchAdmin, isEdit, churchOptions, setValue]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{t("family.info.title")}</h3>

      {/* Family Basic Info */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("family.info.name")}
            </p>
            <p className="text-md">{watch("name") || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("family.info.diocese")}
            </p>
            <p className="text-md">{watch("diocese")?.label || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {t("family.info.church")}
            </p>
            <p className="text-md">{watch("church")?.label || "-"}</p>
          </div>
        </div>
      </div>

      {/* Family Members Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium">
            {t("family.familyMembers.title") || "Family Members"}
          </h4>
          <Button
            type="button"
            onClick={addMember}
            disabled={!canAddNewMember()}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("family.familyMembers.addMember") || "Add Member"}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Validation Error Messages */}
          {fields.length > 0 && (
            <>
              {members.filter((member) => member?.isHeadOfFamily).length ===
                0 && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200">
                  <p className="text-sm text-red-700">
                    {t("family.familyMembers.noHeadOfFamily") ||
                      "Please designate one member as head of family."}
                  </p>
                </div>
              )}
              {members.filter((member) => member?.isHeadOfFamily).length >
                1 && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200">
                  <p className="text-sm text-red-700">
                    {t("family.familyMembers.multipleHeadOfFamily") ||
                      "Only one member can be designated as head of family."}
                  </p>
                </div>
              )}
            </>
          )}

          {fields.map((field, index) => {
            const isHeadOfFamily = members[index]?.isHeadOfFamily;
            const memberErrors = errors.members?.[index] as any;

            return (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">
                    {t("family.familyMembers.member") || "Member"} {index + 1}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor={`head-of-family-${index}`}
                        className="text-sm"
                      >
                        {t("family.familyMembers.headOfFamily") ||
                          "Head of Family"}
                      </Label>
                      <Switch
                        id={`head-of-family-${index}`}
                        checked={isHeadOfFamily}
                        onCheckedChange={(checked) =>
                          handleHeadOfFamilyToggle(index, checked)
                        }
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <TextField
                      name={`members.${index}.firstName`}
                      label={
                        t("family.familyMembers.firstName") || "First Name"
                      }
                      register={register}
                      validation={{ required: true }}
                      error={memberErrors?.firstName}
                    />
                  </div>
                  <div>
                    <TextField
                      name={`members.${index}.lastName`}
                      label={t("family.familyMembers.lastName") || "Last Name"}
                      register={register}
                      validation={{ required: false }}
                      error={memberErrors?.lastName}
                    />
                  </div>
                  <div>
                    <TextField
                      name={`members.${index}.email`}
                      label={t("family.familyMembers.email") || "Email"}
                      register={register}
                      validation={{
                        required: isHeadOfFamily,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      error={memberErrors?.email}
                    />
                  </div>
                  <div>
                    <PhoneInputField
                      name={`members.${index}.phoneNo`}
                      label={
                        t("family.familyMembers.phoneNo") || "Phone Number"
                      }
                      control={control}
                      validation={{ required: false }}
                      error={memberErrors?.phoneNo}
                      isRequired={false}
                    />
                  </div>
                  <div>
                    <TextField
                      name={`members.${index}.age`}
                      label={t("family.familyMembers.age") || "Age"}
                      register={register}
                      validation={{
                        required: false,
                        min: {
                          value: 1,
                          message:
                            t("validation.age.min") || "Age must be at least 1",
                        },
                        max: {
                          value: 150,
                          message:
                            t("validation.age.max") || "Age cannot exceed 150",
                        },
                      }}
                      type="number"
                      error={memberErrors?.age}
                    />
                  </div>
                  <div>
                    <GenderSelectField
                      name={`members.${index}.gender`}
                      label={t("family.familyMembers.gender") || "Gender"}
                      control={control}
                      validation={{ required: false }}
                      error={memberErrors?.gender}
                      isRequired={false}
                    />
                  </div>
                  <div className="relative z-10">
                    <DatePicker 
                      label={t("family.familyMembers.dateOfBirth") || "Date of Birth"} 
                      isRequired={false}
                      selected={(() => {
                        const dateValue = watch(`members.${index}.dateOfBirth`)
                        console.log("Current dateOfBirth value:", dateValue)
                        if (!dateValue) return undefined
                        try {
                          const parsedDate = new Date(dateValue)
                          return isNaN(parsedDate.getTime()) ? undefined : parsedDate
                        } catch {
                          return undefined
                        }
                      })()}
                      onSelect={(date) => {
                        console.log("DatePicker onSelect called with:", date)
                        setValue(
                          `members.${index}.dateOfBirth`, 
                          date ? date.toISOString() : '',
                          { shouldValidate: true, shouldDirty: true }
                        )
                      }}
                    />
                  </div>
                  <div>
                    <AsyncSelectDropdownField
                      name={`members.${index}.maritalStatus`}
                      label={
                        t("family.familyMembers.maritalStatus") ||
                        "Marital Status"
                      }
                      defaultOptions={MARITAL_STATUS_OPTIONS}
                      validation={{ required: false }}
                      control={control}
                      loadOptions={() =>
                        Promise.resolve(MARITAL_STATUS_OPTIONS)
                      }
                      isRequired={false}
                    />
                  </div>
                </div>

                {isHeadOfFamily && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-700">
                      {t("family.familyMembers.headOfFamilyNote") ||
                        "This member will be the head of family and will receive login credentials."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              {t("family.familyMembers.noMembers") ||
                "No family members added yet."}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={!canAddNewMember()}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("family.familyMembers.addFirst") || "Add First Member"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMembersForm;
