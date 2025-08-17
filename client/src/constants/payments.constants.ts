export const PERIOD_SELECTION = {
    FIRST_HALF: 'first_half',
    SECOND_HALF: 'second_half',
    FULL_YEAR: 'full_year',
    Q1: 'q1',
    Q2: 'q2',
    Q3: 'q3',
    Q4: 'q4',
}

export const CATEGORY_PERIOD_TYPE = {
    YEARLY: 'yearly',
    QUARTERLY: 'quarterly',
    MONTHLY: 'monthly',
    SINGLE: 'single',
}

export const PAYMENT_STATUS_COLORS = {
    Paid: { badgeColor: "#dcfce7", textColor: "#166534" },
    Pending: { badgeColor: "#fef3c7", textColor: "#92400e" },
    Overdue: { badgeColor: "#fecaca", textColor: "#991b1b" },
    Processing: { badgeColor: "#dbeafe", textColor: "#1e40af" },
    default: { badgeColor: "#f3f4f6", textColor: "#374151" },
} as const