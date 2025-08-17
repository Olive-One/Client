import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import {
  ExportAction,
  type ExportFormData,
  type ExportPaymentsProps,
  type PaymentType,
  ExportFormat,
} from '@/types/payments.types';
import { useExportPayments } from '@/hooks/usePayments';
import { useCustomToast } from '@/hooks/useToastHelper';

const exportFormSchema = z.object({
  paymentType: z.nativeEnum({
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
  }),
  format: z.nativeEnum({
    PDF: 'PDF',
    EXCEL: 'EXCEL',
    CSV: 'CSV',
    PRINT: 'PRINT',
  }),
  action: z.nativeEnum({
    DOWNLOAD: 'DOWNLOAD',
    PRINT: 'PRINT',
  }),
  dateRange: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  }),
});

type FormData = z.infer<typeof exportFormSchema>;

export const ExportPaymentsForm: React.FC<ExportPaymentsProps> = ({
  isOpen,
  onClose,
  paymentType,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { mutateAsync: exportPayments } = useExportPayments();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const form = useForm<FormData>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      paymentType,
      format: ExportFormat.PDF,
      action: ExportAction.DOWNLOAD,
      dateRange: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    },
  });

  const handleExport = async (data: FormData) => {
    setIsExporting(true);
    try {
      const exportData: ExportFormData = {
        ...data,
        paymentType: data.paymentType as PaymentType,
        format: data.format as ExportFormat,
        action: data.action as ExportAction,
      };

      const result = await exportPayments(exportData);

      if (data.action === ExportAction.DOWNLOAD && result.data.fileUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.data.fileUrl;
        link.download = result.data.fileName || `${data.paymentType.toLowerCase()}-export.${data.format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccessToast(`${data.paymentType} export downloaded successfully`);
      } else if (data.action === ExportAction.PRINT && result.data.content) {
        // Handle print
        handlePrint(result.data.content);
        showSuccessToast(`${data.paymentType} report sent to printer`);
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      showErrorToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = (content: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${paymentType} Report</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
                line-height: 1.4;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333; 
                padding-bottom: 15px;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 24px;
                color: #333;
              }
              .header p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
              }
              .summary-section {
                margin: 25px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border: 1px solid #ddd;
              }
              .summary-section h2 {
                margin: 0 0 15px 0;
                font-size: 18px;
                color: #333;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
              }
              .summary-item {
                background: white;
                padding: 12px;
                border-radius: 6px;
                border: 1px solid #ddd;
              }
              .summary-item strong {
                display: block;
                color: #333;
                font-size: 14px;
                margin-bottom: 5px;
              }
              .summary-item span {
                font-size: 18px;
                font-weight: 600;
                color: #007bff;
              }
              .details-section {
                margin: 25px 0;
              }
              .details-section h2 {
                margin: 0 0 15px 0;
                font-size: 18px;
                color: #333;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 10px;
                font-size: 12px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f8f9fa; 
                font-weight: 600;
                color: #333;
              }
              .total-row {
                background-color: #e9ecef;
                font-weight: 600;
              }
              .amount-cell {
                text-align: right;
                font-weight: 500;
              }
              @media print {
                body { margin: 10px; }
                .no-print { display: none; }
                .summary-grid {
                  grid-template-columns: repeat(3, 1fr);
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const selectedFormat = form.watch('format');
  const selectedAction = form.watch('action');

  // Update form when paymentType prop changes
  useEffect(() => {
    form.setValue('paymentType', paymentType);
  }, [paymentType, form]);

  // Automatically set action based on format
  useEffect(() => {
    if (selectedFormat === ExportFormat.PRINT) {
      form.setValue('action', ExportAction.PRINT);
    } else if (selectedAction === ExportAction.PRINT && selectedFormat !== ExportFormat.PRINT) {
      form.setValue('action', ExportAction.DOWNLOAD);
    }
  }, [selectedFormat, selectedAction, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={form.handleSubmit(handleExport)} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Export {paymentType} Data
            </DialogTitle>
            <DialogDescription>
              Select the date range and format to export {paymentType.toLowerCase()} data with summary and payment details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Selection */}
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={form.watch('format')}
                onValueChange={(value) => form.setValue('format', value as ExportFormat)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExportFormat.PDF}>PDF Document</SelectItem>
                  <SelectItem value={ExportFormat.EXCEL}>Excel Spreadsheet</SelectItem>
                  <SelectItem value={ExportFormat.CSV}>CSV File</SelectItem>
                  <SelectItem value={ExportFormat.PRINT}>Print Preview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Selection */}
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select
                value={form.watch('action')}
                onValueChange={(value) => form.setValue('action', value as ExportAction)}
                disabled={selectedFormat === ExportFormat.PRINT}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExportAction.DOWNLOAD}>Download File</SelectItem>
                  <SelectItem value={ExportAction.PRINT}>Print Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...form.register('dateRange.startDate')}
                  className="w-full"
                />
                {form.formState.errors.dateRange?.startDate && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.dateRange.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...form.register('dateRange.endDate')}
                  className="w-full"
                />
                {form.formState.errors.dateRange?.endDate && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.dateRange.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {selectedAction === ExportAction.PRINT ? 'Preparing...' : 'Exporting...'}
                </>
              ) : (
                <>
                  {selectedAction === ExportAction.PRINT ? 'Print Report' : 'Export Data'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};