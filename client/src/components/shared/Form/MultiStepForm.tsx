import { useState } from 'react';
import { useForm, FormProvider, type FieldValues } from 'react-hook-form';
import CustomModal from '@/components/shared/customModal/CustomModal';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FormStep } from '@/types/form.types';

interface MultiStepFormProps<T extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: FormStep<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: T;
  isSubmitLoading?: boolean;
}

export function MultiStepForm<T extends FieldValues>({
  isOpen,
  onClose,
  title,
  steps,
  onSubmit,
  defaultValues,
  isSubmitLoading = false,
}: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm<T>({
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const { handleSubmit, trigger, formState: { isValid } } = methods;

  const currentStepConfig = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  const handleNext = async () => {
    const currentStepFields = getCurrentStepFields();
    const isStepValid = await trigger(currentStepFields);
    
    if (isStepValid && currentStepConfig.isStepValid) {
      const customValidation = currentStepConfig.isStepValid(methods as any);
      if (!customValidation) return;
    }
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data as T);
  });

  const getCurrentStepFields = () => {
    // This is a simplified approach - in a real implementation,
    // you might want to define which fields belong to which step
    return undefined;
  };

  const isNextDisabled = () => {
    if (currentStepConfig.isStepValid) {
      return !currentStepConfig.isStepValid(methods as any);
    }
    return false;
  };

  const handleClose = () => {
    setCurrentStep(1);
    methods.reset();
    onClose();
  };

  const renderStepIndicator = () => {
    if (steps.length <= 1) return null;
    
    return (
      <div className="flex items-center space-x-2 mb-4">
        {Array.from({ length: steps.length }, (_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-2 w-8 rounded-full ${
                index + 1 <= currentStep
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
            {index < steps.length - 1 && (
              <div className="h-px w-4 bg-muted mx-1" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    const isFirstStep = currentStep === 1;
    
    return (
      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isSubmitLoading}
          className="flex items-center gap-2"
          style={{ visibility: steps.length > 1 ? 'visible' : 'hidden' }}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitLoading}
          >
            Cancel
          </Button>
          
          {isLastStep ? (
            <Button
              onClick={handleFormSubmit}
              disabled={!isValid || isSubmitLoading}
              className="flex items-center gap-2"
            >
              {isSubmitLoading ? 'Submitting...' : (currentStepConfig.submitButtonText || 'Submit')}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex items-center gap-2"
            >
              {currentStepConfig.submitButtonText || 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentStepConfig.title || title}
      subtitle={steps.length > 1 ? `Step ${currentStep} of ${steps.length}` : currentStepConfig.subtitle}
      size={currentStepConfig.modalSize || '2xl'}
      footer={renderFooter()}
    >
      <FormProvider {...methods}>
        <div className="space-y-6">
          {renderStepIndicator()}
          
          {currentStepConfig.showAlert && currentStepConfig.alertText && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="text-sm text-blue-800">
                {currentStepConfig.alertText}
              </div>
            </div>
          )}
          
          <form className="space-y-6">
            {currentStepConfig.component(methods as any)}
          </form>
        </div>
      </FormProvider>
    </CustomModal>
  );
}