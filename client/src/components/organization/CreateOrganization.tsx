import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationForm from '@/components/organization/OrganizationForm';
import { type OrganizationFormData } from '@/types/organization.types';
import { useCreateOrganization } from '@/hooks/useOrganizations';
import { prepareCreateOrganizationPayload } from '@/utils/forms/organization.utils';

type CreateOrganizationProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateOrganization: FC<CreateOrganizationProps> = ({ isOpen, onClose }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: createOrganization } = useCreateOrganization();

  const handleSubmit = (data: OrganizationFormData) => {
    setLoading(true);
    const payload = prepareCreateOrganizationPayload(data);
    createOrganization(payload, {
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
    <OrganizationForm
      isLoading={isLoading}
      isOpen={isOpen}
      title={t('organizations.createOrganization')}
      onClose={onClose}
      handleFormSubmit={handleSubmit}
      formData={null}
    />
  );
};

export default CreateOrganization;