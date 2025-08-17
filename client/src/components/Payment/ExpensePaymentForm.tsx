import React, {useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { TextField } from "@/components/shared/Form/TextField";
import { AsyncSelectDropdownField } from "@/components/shared/Form/AsyncSelectDropdownField";
import { type ExpenseFormData } from "@/types/payments.types";
import {
  useStaticDropdownData,
} from "@/hooks/shared/useDropdownData";
import useStateStore from "@/store/store-index";
import { useExpensePaymentCategories } from "@/hooks/usePayments";
import { CATEGORY_PERIOD_TYPE, PERIOD_SELECTION } from "@/constants/payments.constants";

interface ExpensePaymentFormProps {
  methods: UseFormReturn<ExpenseFormData>;
  isEdit?: boolean;
}

export const ExpensePaymentForm: React.FC<ExpensePaymentFormProps> = ({
  methods,
}) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = methods;

  const { profile } = useStateStore();

  const selectedCategory = watch("categoryId");

  const { data: monthOptions } = useStaticDropdownData("month");
  const { data: categoryOptions } = useExpensePaymentCategories(profile?.churchId);

  // Find the selected category object to get its type
  const selectedCategoryData = categoryOptions?.data?.find(
    (category) => category.id === selectedCategory?.id
  );

  // Create period selection options based on category type 
  // TODO: This is a temporary solution to get the period options based on the category type -- Move this to backend
  const getPeriodOptions = (categoryType: string) => {
    const currentYear = new Date().getFullYear();

    switch (categoryType) {
      case CATEGORY_PERIOD_TYPE.YEARLY:
        return [
          { id: CATEGORY_PERIOD_TYPE.YEARLY, label: `First Half ${currentYear}`, value: PERIOD_SELECTION.FIRST_HALF },
          { id: CATEGORY_PERIOD_TYPE.YEARLY, label: `Second Half ${currentYear}`, value: PERIOD_SELECTION.SECOND_HALF },
          { id: CATEGORY_PERIOD_TYPE.YEARLY, label: `Full Year ${currentYear}`, value: PERIOD_SELECTION.FULL_YEAR },
        ];

      case CATEGORY_PERIOD_TYPE.QUARTERLY:
        return [
          { id: CATEGORY_PERIOD_TYPE.QUARTERLY, label: `Q1 ${currentYear} (Jan-Mar)`, value: PERIOD_SELECTION.Q1 },
          { id: CATEGORY_PERIOD_TYPE.QUARTERLY, label: `Q2 ${currentYear} (Apr-Jun)`, value: PERIOD_SELECTION.Q2 },
          { id: CATEGORY_PERIOD_TYPE.QUARTERLY, label: `Q3 ${currentYear} (Jul-Sep)`, value: PERIOD_SELECTION.Q3 },
          { id: CATEGORY_PERIOD_TYPE.QUARTERLY, label: `Q4 ${currentYear} (Oct-Dec)`, value: PERIOD_SELECTION.Q4 },
        ];

      case CATEGORY_PERIOD_TYPE.MONTHLY:
          return monthOptions?.data?.map((month) => ({
            id: CATEGORY_PERIOD_TYPE.MONTHLY,
            label: `${month.label} ${currentYear}`,
            value: month.value,
          }));

      default:
        return [];
    }
  };

  const periodOptions = getPeriodOptions(selectedCategoryData?.type || "");
  const shouldShowPeriodSelection =
    selectedCategoryData?.type &&
    selectedCategoryData.type.toUpperCase() !== "SINGLE";

  return (
    <div className="space-y-10 px-2">
      {/* Expense Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Expense Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AsyncSelectDropdownField
            name="categoryId"
            label="Expense Category"
            control={control}
            validation={{ required: "Expense category is required" }}
            error={errors.categoryId?.id}
            defaultOptions={categoryOptions?.data || []}
            loadOptions={() => Promise.resolve(categoryOptions?.data || [])}
            placeholder="Select expense category"
          />

          <TextField
            name="amount"
            label="Amount"
            type="number"
            register={register}
            validation={{
              required: "Amount is required",
              min: {
                value: 0.01,
                message: "Amount must be greater than 0",
              },
            }}
            error={errors.amount}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            name="recipientName"
            label="Recipient Name"
            type="text"
            register={register}
            validation={{
              required: "Recipient name is required",
              minLength: {
                value: 2,
                message: "Recipient name must be at least 2 characters",
              },
            }}
            error={errors.recipientName}
            placeholder="Enter recipient name"
          />

          <TextField
            name="billNumber"
            label="Bill Number"
            type="text"
            register={register}
            validation={{
              required: "Bill number is required",
              minLength: {
                value: 1,
                message: "Bill number is required",
              },
            }}
            error={errors.billNumber}
            placeholder="Enter bill number"
          />
        </div>

        {/* Period Selection - Conditional based on category type */}
        {shouldShowPeriodSelection && (
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-border"></div>
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">
                  📅 Expense Period Selection
                </span>
              </div>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Select Expense Period for "{selectedCategoryData?.label}"
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AsyncSelectDropdownField
                    name="periodSelection"
                    label={`${
                      selectedCategoryData?.type?.charAt(0).toUpperCase() +
                      selectedCategoryData?.type?.slice(1).toLowerCase()
                    } Period`}
                    control={control}
                    validation={{ required: "Expense period is required" }}
                    error={errors.periodSelection?.id}
                    defaultOptions={periodOptions || []}
                    loadOptions={() => Promise.resolve(periodOptions || [])}
                    placeholder={`Select ${selectedCategoryData?.type?.toLowerCase()} period`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">
          Additional Information
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              rows={4}
              placeholder="Additional notes or comments about this expense..."
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};