
import { type UseFormReturn } from 'react-hook-form';
import { type OrganizationFormData } from '@/types/organization.types';
import OrganizationInfo from './OrganizationInfo';
import OrganizationAddress from './OrganizationAddress';

const OrganizationFormContainer: React.FC<{
  isEdit?: boolean;
  methods: UseFormReturn<OrganizationFormData>;
  organizationId?: string;
}> = ({ isEdit, methods, organizationId }) => {
  return (
    <div className="space-y-6 mb-4">
      <div>
        <OrganizationInfo methods={methods} isEdit={isEdit} organizationId={organizationId} />
      </div>
      
      <div className="mt-6">
        <OrganizationAddress methods={methods} isEdit={isEdit} />
      </div>
    </div>
  );
};

export default OrganizationFormContainer;