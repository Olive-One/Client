import React from 'react';
import { CreateIncome } from './CreateIncome';
import { CreateExpense } from './CreateExpense';
import { type CreatePaymentProps, PaymentType } from '@/types/payments.types';

export const CreatePayment: React.FC<CreatePaymentProps> = ({ isOpen, onClose, paymentType = PaymentType.INCOME }) => {
  // Based on the paymentType prop, show the appropriate form
  if (paymentType === PaymentType.EXPENSE) {
    return <CreateExpense isOpen={isOpen} onClose={onClose} />;
  }
  
  // Default to income form
  return <CreateIncome isOpen={isOpen} onClose={onClose} />;
};