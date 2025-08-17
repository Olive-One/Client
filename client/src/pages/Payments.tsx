import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabNavigation, type TabItem } from "@/components/shared/TabNavigation";
import { Download, Plus } from "lucide-react";
import { CreatePayment } from "@/components/Payment/CreatePayment";
import { IncomePayments } from "@/components/Payment/IncomePayments";
import { ExpensePayments } from "@/components/Payment/ExpensePayments";
import { ExportPaymentsForm } from "@/components/Payment/ExportPaymentsForm";
import { PaymentType } from "@/types/payments.types";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("income");
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const getCurrentPaymentType = (): PaymentType => {
    return activeTab === "income" ? PaymentType.INCOME : PaymentType.EXPENSE;
  };

  const tabs: TabItem[] = [
    {
      id: "income",
      label: "Income",
      content: <IncomePayments onExport={handleExport} />,
    },
    {
      id: "expenses",
      label: "Expenses",
      content: <ExpensePayments onExport={handleExport} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-4 py-4 lg:mx-12 lg:py-8 2xl:mx-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-foreground mb-2 text-2xl font-semibold">
                  Payments Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage and track all church payments, donations, and financial
                  transactions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setIsCreatePaymentOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <TabNavigation
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          />
        </div>
      </div>

      {/* Create Payment Modal */}
      <CreatePayment
        isOpen={isCreatePaymentOpen}
        onClose={() => setIsCreatePaymentOpen(false)}
        paymentType={getCurrentPaymentType()}
      />

      {/* Export Modal */}
      <ExportPaymentsForm
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        paymentType={getCurrentPaymentType()}
      />
    </div>
  );
}