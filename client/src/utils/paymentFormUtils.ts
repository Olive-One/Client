import { CURRENCY_CODE } from '@/constants/common.constants';
import { 
  type PaymentFormData, 
  type CreatePaymentPayload,
  type ExpenseFormData,
  type CreateExpensePayload,
  PaymentType 
} from '@/types/payments.types';

/**
 * Transform payment form data to API payload
 */
export const transformToPaymentPayload = (data: PaymentFormData, paymentType: PaymentType): CreatePaymentPayload => {

  const {
    id,
    title,
    amount,
    currencyId,
    categoryId,
    sourceId,
    churchId,
    dioceseId,
    dueDate,
    scheduledPayment,
    scheduleDetails,
    referenceNumber,
    notes,
    periodSelection,
    family,
    member,
  } = data;

  // Convert amount to smallest unit (Currently to paisa in India)
  const amountInSmallestUnit = Math.round(amount * 100);


  const payload: CreatePaymentPayload = {
    id,
    title,
    amountInSmallestUnit,
    currencyId: currencyId ? currencyId.id : CURRENCY_CODE.INDIAN_RUPEE,
    categoryId: categoryId.id,
    familyId: family?.id,
    memberId: member?.id,
    sourceId: sourceId?.id,
    churchId: churchId?.id,
    dioceseId: dioceseId?.id,
    dueDate,
    scheduledPayment,
    scheduleDetails,
    referenceNumber,
    notes,
    paymentType: paymentType,
    categoryPeriodType: periodSelection?.id,
    periodSelection: periodSelection?.value,
  };

  return payload;
};

/**
 * Transform expense form data to API payload
 */
export const transformToExpensePayload = (data: ExpenseFormData): CreateExpensePayload => {
  
  const {
    id,
    categoryId,
    amount,
    recipientName,
    billNumber,
    periodSelection,
    notes,
    paymentType,
  } = data;

  // Convert amount to smallest unit (Currently to paisa in India)
  const amountInSmallestUnit = Math.round(amount * 100);

  const payload: CreateExpensePayload = {
    id,
    categoryId: categoryId.id,
    amountInSmallestUnit,
    recipientName,
    billNumber,
    categoryPeriodType: periodSelection?.id,
    periodSelection: periodSelection?.value,
    notes,
    paymentType: paymentType,
  };

  return payload;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

/**
 * Get payment type label
 */
export const getPaymentTypeLabel = (paymentType: PaymentType): string => {
  switch (paymentType) {
    case PaymentType.INCOME:
      return 'Income';
    case PaymentType.EXPENSE:
      return 'Expense';
    default:
      return 'Unknown';
  }
};