import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationForm from '@/components/organization/OrganizationForm';
import { type OrganizationFormData } from '@/types/organization.types';
import { useOrganizationDetails, useOrganizationUpdate } from '@/hooks/useOrganizations';
import { prepareUpdateOrganizationPayload } from '@/utils/forms/organization.utils';

type EditOrganizationProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedOrganizationId: string;
};

const EditOrganization: FC<EditOrganizationProps> = ({ isOpen, onClose, selectedOrganizationId }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { mutate: updateOrganization } = useOrganizationUpdate();
  
  const { data: organizationDetails } = useOrganizationDetails(selectedOrganizationId);

  const handleSubmit = (data: OrganizationFormData) => {
    setLoading(true);
    const payload = prepareUpdateOrganizationPayload(data);
    updateOrganization({ id: selectedOrganizationId, data: payload }, {
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
      title={t('organizations.editOrganization')}
      onClose={onClose}
      handleFormSubmit={handleSubmit}
      formData={organizationDetails?.data || null}
      organizationId={selectedOrganizationId}
    />
  );
};

export default EditOrganization;