import React from 'react';
import { ExpenseForm } from './ExpenseForm';
import { transformToExpensePayload } from '@/utils/paymentFormUtils';
import { PaymentType, type CreatePaymentProps, type ExpenseFormData } from '@/types/payments.types';
import { useCreateExpense } from '@/hooks/usePayments';

export const CreateExpense: React.FC<CreatePaymentProps> = ({ isOpen, onClose }) => {
  const { mutate: createExpense, isPending } = useCreateExpense();

  const handleSubmit = (data: ExpenseFormData) => {
    const expenseData = { ...data, paymentType: PaymentType.EXPENSE };
    const payload = transformToExpensePayload(expenseData);
    createExpense(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <ExpenseForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitLoading={isPending}
      isEditMode={false}
    />
  );
};