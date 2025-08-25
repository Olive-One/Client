import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PAYMENT_STATUS_COLORS } from "@/constants/payments.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/dataTable/DataTable";
import {
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_INDEX,
} from "@/constants/pagination.constants";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
} from "lucide-react";
import {
  useIncomeOverviewByChurch,
  useIncomePaymentsListByChurch,
} from "@/hooks/usePayments";
import {
  PaymentType,
  type IncomePayments,
  type PaymentsFilterCriteria,
} from "@/types/payments.types";
import { ExportPaymentsForm } from "./ExportPaymentsForm";

interface IncomePaymentsProps {
  onExport?: () => void;
}

export function IncomePayments({ onExport }: IncomePaymentsProps = {}) {
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filterCriteria, setFilterCriteria] = useState<PaymentsFilterCriteria>({
    search: "",
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { data: IncomeOverview } = useIncomeOverviewByChurch();

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      setIsExportModalOpen(true);
    }
  };

  const { data: payments } = useIncomePaymentsListByChurch({
    ...pagination,
    filters: filterCriteria,
    search: filterCriteria.search || "",
    sort: JSON.stringify(sorting),
  });

  // Define table columns
  const columns = useMemo<ColumnDef<IncomePayments>[]>(
    () => [
      {
        id: "member",
        header: "Member",
        accessorKey: "merchant",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm text-foreground">
                  {row.original.source.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <div className="text-foreground">
                  {row.original.source.name}
                </div>
                {row.original.notes && (
                  <div className="text-sm text-muted-foreground">
                    {row.original.notes}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "type",
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <span className="text-foreground">
                {row.original.category.name}
              </span>
            </div>
          );
        },
      },
      {
        id: "referenceNumber",
        header: "Reference Number",
        accessorKey: "referenceNumber",
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.referenceNumber}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const colors =
            PAYMENT_STATUS_COLORS[
              row.original.status as keyof typeof PAYMENT_STATUS_COLORS
            ] || PAYMENT_STATUS_COLORS.default;
          return (
            <StatusBadge
              statusText={row.original.status}
              variant="custom"
              badgeColor={colors.badgeColor}
              textColor={colors.textColor}
            />
          );
        },
      },
      {
        id: "createdAt",
        header: "Payment Date",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-foreground">
            {new Date(row.original.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        accessorKey: "amountInSmallestUnit",
        meta: {
          headerAlign: "right" as const,
          cellAlign: "right" as const,
        },
        cell: ({ row }) => (
          <span className="text-foreground">
            $
            {row.original.amountInSmallestUnit.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <IndianRupee className="w-5 h-5" />
              {IncomeOverview?.data.totalIncome.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              }) || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>Pending Amount</CardDescription>
            <CardTitle className="text-2xl text-foreground flex items-center">
              <IndianRupee className="w-5 h-5" />
              {IncomeOverview?.data.pendingAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              }) || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600">Processing</span>
              <span className="text-muted-foreground">
                awaiting confirmation
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription>Overdue Amount</CardDescription>
            <CardTitle className="text-2xl text-foreground flex items-center ">
              <IndianRupee className="w-5 h-5" />
              {IncomeOverview?.data.overdueAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              }) || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-red-600">Needs attention</span>
              <span className="text-muted-foreground">follow up required</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search payments, members, or transaction numbers..."
                value={filterCriteria.search}
                onChange={(e) =>
                  setFilterCriteria({
                    ...filterCriteria,
                    search: e.target.value,
                  })
                }
                className="pl-10"
              />
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Income Table Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Income Transactions ({payments?.data.totalCount || 0} payments
            found)
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage and export income payment data
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="w-fit">
          <Download className="w-4 h-4 mr-2" />
          Export Income Data
        </Button>
      </div>

      {/* Payments Table */}
      <DataTable
        data={payments?.data.rows || []}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={payments?.data.totalCount || 0}
        title=""
        sortEnabledColumns={payments?.data.sortEnabledColumns || []}
        emptyStateMessage="Try adjusting your search or filter criteria"
        emptyStateIcon={
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
        }
      />

      {/* Export Modal - only show if no parent handler */}
      {!onExport && (
        <ExportPaymentsForm
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          paymentType={PaymentType.INCOME}
        />
      )}
    </>
  );
}
