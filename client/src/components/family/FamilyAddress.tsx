import { type UseFormReturn } from 'react-hook-form';
import { TextField } from '@/components/shared/Form/TextField';
import { NAME_ERROR_MESSAGE, NAME_REGEX } from '@/constants/validation.constants';
import { type FamilyFormData } from '@/types/family.types';
import { useTranslation } from 'react-i18next';

interface FamilyAddressProps {
  isEdit?: boolean;
  methods: UseFormReturn<FamilyFormData>;
}

const FamilyAddress: React.FC<FamilyAddressProps> = ({ methods }) => {
  const {
    formState: { errors },
    register,
  } = methods;
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {t('family.familyAddress.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <TextField
            name="firstLine"
            label={t('family.familyAddress.firstLine')}
            register={register}
            validation={{ required: true }}
            error={errors.firstLine}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="secondLine"
            label={t('family.familyAddress.secondLine')}
            register={register}
            validation={{ required: true }}
            error={errors.secondLine}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="postCode"
            label={t('family.familyAddress.postCode')}
            register={register}
            validation={{ required: true}}
            error={errors.postCode}
            isMandatory={true}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <TextField
            name="city"
            label={t('family.familyAddress.city')}
            register={register}
            validation={{ required: true, pattern: { value: NAME_REGEX, message: NAME_ERROR_MESSAGE } }}
            error={errors.city}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="district"
            label={t('family.familyAddress.district')}
            register={register}
            validation={{ required: true }}
            error={errors.district}
            isMandatory={true}
          />
        </div>
        <div>
          <TextField
            name="state"
            label={t('family.familyAddress.state')}
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

export default FamilyAddress;