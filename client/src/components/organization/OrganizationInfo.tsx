import { type UseFormReturn } from 'react-hook-form';
import { TextField } from '@/components/shared/Form/TextField';
import { NAME_ERROR_MESSAGE, NAME_REGEX } from '@/constants/validation.constants';
import { type OrganizationFormData, ORGANIZATION_TYPE_OPTIONS } from '@/types/organization.types';
import { AsyncSelectDropdownField } from '../shared/Form/AsyncSelectDropdownField';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { useContextDioceseDropdown, useContextChurchDropdown } from '@/hooks/shared/useDropdownData';
import { usePermissions } from '@/hooks/shared/usePermissions';
import { useOrganizationMembers } from '@/hooks/useOrganizations';
import { PhoneInputField } from '../shared/Form/PhoneInputField';
import { DatePicker } from '../shared/date-picker/DatePicker';

interface OrganizationInfoProps {
  isEdit?: boolean;
  methods: UseFormReturn<OrganizationFormData>;
  organizationId?: string;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ methods, isEdit, organizationId }) => {
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

  // Fetch organization members for leader dropdown (only in edit mode when organizationId is available)
  const { data: organizationMembersResponse } = useOrganizationMembers(organizationId, isEdit && !!organizationId);

  // Create load options function for organization members
  const loadOrganizationMembers = useCallback(() => {
    return Promise.resolve(organizationMembersResponse?.data || []);
  }, [organizationMembersResponse]);

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
      <h2 className="text-lg font-medium mb-4">
        {t('organization.info.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <TextField
            name="name"
            label={t('organization.info.name')}
            register={register}
            validation={{ required: true, pattern: { value: NAME_REGEX, message: NAME_ERROR_MESSAGE } }}
            error={errors.name}
            isMandatory={true}
          />
        </div>
        <div>
          <AsyncSelectDropdownField
            name="type"
            label={t('organization.info.type')}
            defaultOptions={ORGANIZATION_TYPE_OPTIONS}
            validation={{ required: true }}
            control={control}
            loadOptions={() => Promise.resolve(ORGANIZATION_TYPE_OPTIONS)}
            isRequired={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <AsyncSelectDropdownField
            name="diocese"
            label={t('organization.info.diocese')}
            defaultOptions={dioceseOptions?.data || []}
            validation={{ required: true }}
            control={control}
            loadOptions={() => Promise.resolve(dioceseOptions?.data || [])}
            isDisabled={isEdit || isDioceseAdmin || isChurchAdmin}
            isRequired={true}
          />
        </div>

        <div>
          <AsyncSelectDropdownField
            name="church"
            label={t('organization.info.church')}
            defaultOptions={churchOptions?.data || []}
            validation={{ required: true }}
            control={control}
            loadOptions={() => Promise.resolve(churchOptions?.data || [])}
            isDisabled={isEdit || isChurchAdmin}
            isRequired={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <DatePicker
            selected={new Date(watch('establishedDate'))}
            onSelect={(date) => setValue('establishedDate', date ? date.toISOString() : '')}
          />
        </div>

        <div>
          <PhoneInputField
            name="contactNo"
            label={t('organization.info.contactNo')}
            control={control}
            validation={{ required: true }}
            error={errors?.contactNo}
            countryCode="IN"
            isRequired={true}
          />
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <TextField
            name="email"
            label={t('organization.info.email')}
            register={register}
            validation={{
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            error={errors.email}
            isMandatory={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <TextField
            name="description"
            label={t('organization.info.description')}
            register={register}
            validation={{ required: true }}
            error={errors.description}
            isMandatory={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;