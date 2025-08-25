import { type UseFormReturn } from 'react-hook-form';
import { MultiStepForm } from '@/components/shared/Form/MultiStepForm';
import { type FormStep } from '@/types/form.types';
import OrganizationFormContainer from './OrganizationFormContainer';
import { type OrganizationFormData } from '@/types/organization.types';
import OrganizationMembersForm from './OrganizationMembersForm';

type OrganizationFormProps = {
  isOpen: boolean;
  onClose: () => void;
  handleFormSubmit: (data: OrganizationFormData) => void;
  isLoading?: boolean;
  formData?: any | null;
  title: string;
  organizationId?: string;
};

const OrganizationForm: React.FC<OrganizationFormProps> = ({ 
  isOpen, 
  onClose, 
  handleFormSubmit, 
  isLoading = false, 
  formData = null, 
  title, 
  organizationId 
}) => {
  // Validation function for the second step (OrganizationMembersForm)
  const isOrganizationMembersStepValid = (methods: UseFormReturn<OrganizationFormData>) => {
    const members = methods.watch('members') || [];

    // Must have at least one member
    if (members.length === 0) return false;

    // Must have exactly one leader
    const leaderCount = members.filter((member) => member?.isLeader).length;
    if (leaderCount !== 1) return false;

    // All members must have required fields
    return members.every((member, index) => {
      if (!member) return false;

      // Required fields for any member
      const hasFirstName = member.firstName && member.firstName.trim() !== '';
      const hasPosition = member.position && member.position.trim() !== '';

      // If this member is leader, email is also required
      if (member.isLeader) {
        const hasEmail = member.email && member.email.trim() !== '';
        return hasFirstName && hasPosition && hasEmail;
      }

      return hasFirstName && hasPosition;
    });
  };

  const steps: FormStep<OrganizationFormData>[] = [
    {
      component: (methods: UseFormReturn<OrganizationFormData>) => (
        <OrganizationFormContainer 
          isEdit={!!formData} 
          methods={methods} 
          organizationId={organizationId} 
        />
      ),
      showAlert: true,
    },
    {
      component: (methods: UseFormReturn<OrganizationFormData>) => (
        <OrganizationMembersForm 
          methods={methods} 
          isEdit={!!formData} 
          organizationId={organizationId} 
        />
      ),
      showAlert: true,
      isStepValid: isOrganizationMembersStepValid,
    },
  ];

  return (
    <MultiStepForm
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(data) => handleFormSubmit(data)}
      defaultValues={formData}
      steps={steps as FormStep<OrganizationFormData>[]}
    />
  );
};

export default OrganizationForm;