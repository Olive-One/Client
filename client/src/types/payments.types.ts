import type { MultiSelectOption } from '@/components/shared/Form/AsyncSelectDropdownField';

export type IncomePayments = {
    id:string;
    title:string;
    amountInSmallestUnit:number;
    currencyId:string;
    categoryId:string;
    churchId:string;
    dueDate:string;
    status:string;
    transactionId:string;
    scheduledPayment:string;
    scheduleDetails:string;
    referenceNumber:string;
    notes:string;
    createdAt:string;
    updatedAt:string;
    category: {
        name: string;
    };
    source: {
        name: string;
    };
};

export type ExpensePayments = {
    id:string;
    title:string;
    amountInSmallestUnit:number;
    currencyId:string;
    categoryId:string;
    churchId:string;
    dueDate:string;
    status:string;
    transactionId:string;
    scheduledPayment:string;
    scheduleDetails:string;
    referenceNumber:string;
    notes:string;
    createdAt:string;
    updatedAt:string;
    category: {
        name: string;
    };
    source: {
        name: string;
    };
};

export type IncomeOverviewByChurchApiResponse = {
  success: string;
  data: {
    totalIncome: number;
    pendingAmount: number;
    overdueAmount: number;
  };
};

export type ExpenseOverviewByChurchApiResponse = {
  success: string;
  data: {
    totalExpense: number;
    pendingAmount: number;
    overdueAmount: number;
  };
};

export type IncomePaymentsListByChurchApiResponse = {
  success: string;
  data: {
    rows: IncomePayments[];
    totalCount: number;
    pageSize: number | null;
    pageIndex: number | null;
    sortEnabledColumns: string[];
  };
};

export type ExpensePaymentsListByChurchApiResponse = {
  success: string;
  data: {
    rows: ExpensePayments[];
    totalCount: number;
    pageSize: number | null;
    pageIndex: number | null;
    sortEnabledColumns: string[];
  };
};

export type PaymentsFilterCriteria = {
  search: string;
};

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Form data types for payment creation flow
export type PaymentFormData = {
  id?: string;
  title: string;
  amount: number;
  currencyId: MultiSelectOption;
  categoryId: MultiSelectOption;
  sourceId?: MultiSelectOption;
  churchId?: MultiSelectOption;
  dioceseId?: MultiSelectOption;
  dueDate: string;
  scheduledPayment?: boolean;
  scheduleDetails?: string;
  referenceNumber?: string;
  notes?: string;
  paymentType: PaymentType;
  member: MultiSelectOption;
  family: MultiSelectOption;
  periodSelection?: MultiSelectOption;
};

// Form data types for expense creation flow
export type ExpenseFormData = {
  id?: string;
  categoryId: MultiSelectOption;
  amount: number;
  recipientName: string;
  billNumber: string;
  periodSelection?: MultiSelectOption;
  notes?: string;
  paymentType: PaymentType;
};

// API payload types
export type CreatePaymentPayload = {
  id?: string;
  title: string;
  amountInSmallestUnit: number;
  familyId?: string;
  memberId?: string;
  currencyId: string;
  categoryId: string;
  sourceId?: string;
  churchId?: string;
  dioceseId?: string;
  dueDate: string;
  scheduledPayment?: boolean;
  scheduleDetails?: string;
  referenceNumber?: string;
  notes?: string;
  paymentType: PaymentType;
  periodSelection?: string;
  categoryPeriodType?: string;
};

export type CreateExpensePayload = {
  id?: string;
  categoryId: string;
  amountInSmallestUnit: number;
  recipientName: string;
  billNumber: string;
  periodSelection?: string;
  categoryPeriodType?: string;
  notes?: string;
  paymentType: PaymentType;
  churchId?: string;
};

// Props for payment components
export interface CreatePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType?: PaymentType;
}

export interface EditPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
}

// Category and source types
export type PaymentCategory = {
  id: string;
  name: string;
  description?: string;
  type: PaymentType;
  createdAt: string;
  updatedAt: string;
};

export type PaymentSource = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Currency = {
  id: string;
  code: string;
  symbol: string;
  name: string;
};

// Export related types
export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  PRINT = 'PRINT',
}

export enum ExportAction {
  DOWNLOAD = 'DOWNLOAD',
  PRINT = 'PRINT',
}

export type ExportFormData = {
  paymentType: PaymentType;
  format: ExportFormat;
  action: ExportAction;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: {
    status?: string[];
    categories?: string[];
    sources?: string[];
  };
};

export interface ExportPaymentsProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: PaymentType;
}

export type ExportPaymentsResponse = {
  success: boolean;
  data: {
    fileUrl?: string;
    fileName?: string;
    content?: string; // For direct print content
  };
  message?: string;
};