import { useMemo } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { CustomPagination } from '../customPagination/CustomPagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/pagination.constants';

type CellAlignment = {
  headerAlign?: 'left' | 'right' | 'center';
  cellAlign?: 'left' | 'right' | 'center';
};

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data>[];
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  setPagination?: OnChangeFn<PaginationState>;
  totalCount?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  sortEnabledColumns?: string[];
  isSortLoading?: boolean;
  title?: string;
  emptyStateMessage?: string;
  emptyStateIcon?: React.ReactNode;
};

export function DataTable<Data extends object>({
  data,
  columns,
  sorting,
  setSorting,
  pagination,
  setPagination,
  totalCount = 0,
  showHeader = true,
  showPagination = true,
  sortEnabledColumns = [],
  isSortLoading = false,
  title,
  emptyStateMessage = 'No data available',
  emptyStateIcon,
}: DataTableProps<Data>) {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const memoizedPagination = useMemo(() => pagination, [pagination]);
  const memoizedSorting = useMemo(() => sorting, [sorting]);
  
  const pageSize = pagination?.pageSize || 10;
  const pageCount = Math.ceil(totalCount / pageSize);
  
  const table = useReactTable({
    columns: memoizedColumns,
    data: memoizedData,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting: memoizedSorting,
      pagination: memoizedPagination,
    },
    manualSorting: true,
    manualPagination: true,
    pageCount,
  });

  const handleSorting = (columnId: string) => {
    setSorting?.(
      sorting?.length && sorting[0].id === columnId 
        ? (sorting[0].desc ? [{ id: columnId, desc: false }] : []) 
        : [{ id: columnId, desc: true }]
    );
  };

  const getSortIcon = (columnId: string) => {
    const sortedColumn = sorting?.find(s => s.id === columnId);
    if (!sortedColumn) return <ArrowUpDown className="h-4 w-4" />;
    return sortedColumn.desc ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />;
  };

  return (
    <Card className="border-none shadow-none">
      {title && (
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {/* Loading indicator */}
        {isSortLoading && (
          <div className="flex justify-center py-2">
            <div className="h-1 w-full bg-muted overflow-hidden">
              <div className="h-full bg-primary animate-pulse"></div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            {showHeader && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted border-0">
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as CellAlignment;
                      const canSort = sortEnabledColumns.includes(header.column.id);
                      
                      return (
                        <TableHead
                          key={header.id}
                          className={`${meta?.headerAlign ? `text-${meta.headerAlign}` : 'text-left'} ${
                            canSort ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={() => {
                            if (canSort) {
                              handleSorting(header.column.id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <div className="flex items-center">
                                {getSortIcon(header.column.id)}
                              </div>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/25 border-b border-gray-500">
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as CellAlignment;
                    
                    return (
                      <TableCell
                        key={cell.id}
                        className={meta?.cellAlign ? `text-${meta.cellAlign}` : 'text-left' + ' py-4'}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={memoizedColumns.length} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      {emptyStateIcon || (
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-foreground font-medium mb-1">No data found</h3>
                        <p className="text-muted-foreground text-sm">{emptyStateMessage}</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {showPagination && table.getRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-500">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-medium">
                Results per page
              </span>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  totalCount
                )}{' '}
                of {totalCount} entries
              </div>
              
              <CustomPagination
                currentPage={table.getState().pagination.pageIndex + 1}
                totalPageCount={table.getPageCount()}
                onPageChange={(newPage) => {
                  table.setPageIndex(newPage - 1);
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}