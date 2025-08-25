import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FamilyForm from '@/components/family/FamilyForm';
import { type FamilyFormData } from '@/types/family.types';
import { useFamilyDetails, useFamilyUpdate } from '@/hooks/useFamilies';
import { prepareUpdateFamilyPayload } from '@/utils/forms/family.utils';

type EditFamilyProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedFamilyId: string;
};

const EditFamily: FC<EditFamilyProps> = ({ isOpen, onClose, selectedFamilyId }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: updateFamily } = useFamilyUpdate();
  
  const { data: familyDetails } = useFamilyDetails(selectedFamilyId);

  const handleSubmit = (data: FamilyFormData) => {
    setLoading(true);
    const payload = prepareUpdateFamilyPayload(data);
    updateFamily({ id: selectedFamilyId, data: payload }, {
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
      title={t('families.editFamily')}
      onClose={onClose}
      handleFormSubmit={handleSubmit}
      formData={familyDetails?.data || null}
      familyId={selectedFamilyId}
    />
  );
};

export default EditFamily;