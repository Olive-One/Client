import { type UseFormReturn } from 'react-hook-form';
import { MultiStepForm } from '@/components/shared/Form/MultiStepForm';
import { type FormStep } from '@/types/form.types';
import FamilyFormContainer from './FamilyFormContainer';
import { type FamilyFormData } from '@/types/family.types';
import FamilyMembersForm from './FamilyMembersForm';

type FamilyFormProps = {
  isOpen: boolean;
  onClose: () => void;
  handleFormSubmit: (data: FamilyFormData) => void;
  isLoading?: boolean;
  formData?: any | null;
  title: string;
  familyId?: string;
};

const FamilyForm: React.FC<FamilyFormProps> = ({ 
  isOpen, 
  onClose, 
  handleFormSubmit, 
  isLoading = false, 
  formData = null, 
  title, 
  familyId 
}) => {
  // Validation function for the second step (FamilyMembersForm)
  const isFamilyMembersStepValid = (methods: UseFormReturn<FamilyFormData>) => {
    const members = methods.watch('members') || [];

    // Must have at least one member
    if (members.length === 0) return false;

    // Must have exactly one head of family
    const headOfFamilyCount = members.filter((member) => member?.isHeadOfFamily).length;
    if (headOfFamilyCount !== 1) return false;

    // All members must have required fields
    return members.every((member) => {
      if (!member) return false;

      // Required fields for any member
      const hasFirstName = member.firstName && member.firstName.trim() !== '';

      // If this member is head of family, email is also required
      if (member.isHeadOfFamily) {
        const hasEmail = member.email && member.email.trim() !== '';
        return hasFirstName && hasEmail;
      }

      return hasFirstName;
    });
  };

  const steps: FormStep<FamilyFormData>[] = [
    {
      component: (methods: UseFormReturn<FamilyFormData>) => (
        <FamilyFormContainer 
          isEdit={!!formData} 
          methods={methods} 
          familyId={familyId} 
        />
      ),
      title: 'Family Information',
      showAlert: true,
    },
    {
      component: (methods: UseFormReturn<FamilyFormData>) => (
        <FamilyMembersForm 
          methods={methods} 
          isEdit={!!formData} 
          familyId={familyId} 
        />
      ),
      title: 'Family Members',
      showAlert: true,
      isStepValid: isFamilyMembersStepValid,
    },
  ];

  return (
    <MultiStepForm
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      isSubmitLoading={isLoading}
      onSubmit={(data) => handleFormSubmit(data)}
      defaultValues={formData}
      steps={steps}
    />
  );
};

export default FamilyForm;