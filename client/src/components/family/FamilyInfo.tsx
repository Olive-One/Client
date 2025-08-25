import { type UseFormReturn } from 'react-hook-form';
import { TextField } from '@/components/shared/Form/TextField';
import { NAME_ERROR_MESSAGE, NAME_REGEX } from '@/constants/validation.constants';
import { type FamilyFormData } from '@/types/family.types';
import { AsyncSelectDropdownField } from '../shared/Form/AsyncSelectDropdownField';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { useContextDioceseDropdown, useContextChurchDropdown } from '@/hooks/shared/useDropdownData';
import { usePermissions } from '@/hooks/shared/usePermissions';
import { useFamilyMembers } from '@/hooks/useFamilies';
import { PhoneInputField } from '../shared/Form/PhoneInputField';

interface FamilyInfoProps {
  isEdit?: boolean;
  methods: UseFormReturn<FamilyFormData>;
  familyId?: string;
}

const FamilyInfo: React.FC<FamilyInfoProps> = ({ methods, isEdit, familyId }) => {
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
  const selectedDiocese = watch('diocese');

  // Use context-aware dropdown for diocese and church
  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(selectedDiocese?.id);

  // Fetch family members for head of family dropdown (only in edit mode when familyId is available)
  const { data: familyMembersResponse } = useFamilyMembers(familyId, isEdit && !!familyId);

  // Create load options function for family members
  const loadFamilyMembers = useCallback(() => {
    return Promise.resolve(familyMembersResponse?.data || []);
  }, [familyMembersResponse]);

  // Auto-select diocese for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && dioceseOptions?.data?.length === 1) {
      const selectedDiocese = dioceseOptions?.data[0];
      setValue('diocese', selectedDiocese);
      setValue('dioceseId', selectedDiocese?.id as string);
    }
  }, [isDioceseAdmin, isEdit, dioceseOptions, setValue]);

  // Auto-select church for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && churchOptions?.data?.length === 1) {
      const selectedChurch = churchOptions?.data[0];
      setValue('church', selectedChurch);
      setValue('churchId', selectedChurch?.id as string);
      setValue('dioceseId', selectedChurch?.dioceseId as string);
    }
  }, [isChurchAdmin, isEdit, churchOptions, setValue]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {t('family.info.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <TextField
            name="name"
            label={t('family.info.name')}
            register={register}
            validation={{ required: true, pattern: { value: NAME_REGEX, message: NAME_ERROR_MESSAGE } }}
            error={errors.name}
            isMandatory={true}
          />
        </div>
        <div>
          <AsyncSelectDropdownField
            name="diocese"
            label={t('family.info.diocese')}
            defaultOptions={dioceseOptions?.data || []}
            validation={{ required: true }}
            control={control}
            loadOptions={() => Promise.resolve(dioceseOptions?.data || [])}
            isDisabled={isEdit || isDioceseAdmin || isChurchAdmin}
            isRequired={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <AsyncSelectDropdownField
            name="church"
            label={t('family.info.church')}
            defaultOptions={churchOptions?.data || []}
            validation={{ required: true }}
            control={control}
            loadOptions={() => Promise.resolve(churchOptions?.data || [])}
            isDisabled={isEdit || isChurchAdmin}
            isRequired={true}
          />
        </div>
        <div>
          <PhoneInputField
            name="contactNo"
            label={t('family.info.contactNo')}
            control={control}
            validation={{ required: true }}
            error={errors?.contactNo}
            isRequired={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyInfo;