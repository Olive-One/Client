import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FamilyForm from '@/components/family/FamilyForm';
import { type FamilyFormData } from '@/types/family.types';
import { useCreateFamily } from '@/hooks/useFamilies';
import { prepareCreateFamilyPayload } from '@/utils/forms/family.utils';

type CreateFamilyProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFamily: FC<CreateFamilyProps> = ({ isOpen, onClose }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: createFamily } = useCreateFamily();

  const handleSubmit = (data: FamilyFormData) => {
    setLoading(true);
    const payload = prepareCreateFamilyPayload(data);
    createFamily(payload, {
      onSuccess: () => {
        setLoading(false);
        onClose();
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  return (
    <FamilyForm
      isLoading={isLoading}
      isOpen={isOpen}
      title={t('families.createFamily')}
      onClose={onClose}
      handleFormSubmit={handleSubmit}
      formData={null}
    />
  );
};

export default CreateFamily;