import React from 'react';
import { PaymentForm } from './PaymentForm';
import { transformToPaymentPayload } from '@/utils/paymentFormUtils';
import { PaymentType, type CreatePaymentProps, type PaymentFormData } from '@/types/payments.types';
import { useCreatePayment } from '@/hooks/usePayments';

export const CreateIncome: React.FC<CreatePaymentProps> = ({ isOpen, onClose }) => {
  const { mutate: createPayment, isPending } = useCreatePayment();

  const handleSubmit = (data: PaymentFormData) => {
    const payload = transformToPaymentPayload(data, PaymentType.INCOME);
    createPayment(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <PaymentForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitLoading={isPending}
      isEditMode={false}
    />
  );
};