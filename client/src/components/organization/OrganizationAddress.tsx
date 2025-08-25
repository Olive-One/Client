import { type UseFormReturn } from 'react-hook-form';
import { TextField } from '@/components/shared/Form/TextField';
import { NAME_ERROR_MESSAGE, NAME_REGEX } from '@/constants/validation.constants';
import { type OrganizationFormData } from '@/types/organization.types';
import { useTranslation } from 'react-i18next';

interface OrganizationAddressProps {
  isEdit?: boolean;
  methods: UseFormReturn<OrganizationFormData>;
}

const OrganizationAddress: React.FC<OrganizationAddressProps> = ({ methods }) => {
  const {
    formState: { errors },
    register,
  } = methods;
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        {t('organization.organizationAddress.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <TextField
            name="firstLine"
            label={t('organization.organizationAddress.firstLine')}
            register={register}
            validation={{ required: true }}
            error={errors.firstLine}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="secondLine"
            label={t('organization.organizationAddress.secondLine')}
            register={register}
            validation={{ required: true }}
            error={errors.secondLine}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="postCode"
            label={t('organization.organizationAddress.postCode')}
            register={register}
            validation={{ required: true }}
            error={errors.postCode}
            isMandatory={true}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mb-4">
        <div>
          <TextField
            name="city"
            label={t('organization.organizationAddress.city')}
            register={register}
            validation={{ required: true, pattern: { value: NAME_REGEX, message: NAME_ERROR_MESSAGE } }}
            error={errors.city}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="district"
            label={t('organization.organizationAddress.district')}
            register={register}
            validation={{ required: true }}
            error={errors.district}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="state"
            label={t('organization.organizationAddress.state')}
            register={register}
            validation={{ required: true }}
            error={errors.state}
            isMandatory={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationAddress;