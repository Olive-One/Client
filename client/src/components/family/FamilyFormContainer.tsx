import { type UseFormReturn } from 'react-hook-form';
import { type FamilyFormData } from '@/types/family.types';
import FamilyInfo from './FamilyInfo';
import FamilyAddress from './FamilyAddress';

const FamilyFormContainer: React.FC<{
  isEdit?: boolean;
  methods: UseFormReturn<FamilyFormData>;
  familyId?: string;
}> = ({ isEdit, methods, familyId }) => {
  return (
    <div className="space-y-6">
      <div>
        <FamilyInfo methods={methods} isEdit={isEdit} familyId={familyId} />
      </div>
      
      <div className="mt-6">
        <FamilyAddress methods={methods} isEdit={isEdit} />
      </div>
    </div>
  );
};

export default FamilyFormContainer;