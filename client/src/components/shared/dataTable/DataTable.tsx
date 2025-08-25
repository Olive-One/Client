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
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className='space-y-4'>
      {title && (
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
      )}
      
      {/* Loading indicator */}
      {isSortLoading && (
        <div className="flex justify-center items-center h-2 mb-2">
          <div className="h-1 w-full bg-muted overflow-hidden rounded">
            <div className="h-full bg-primary animate-pulse rounded"></div>
          </div>
        </div>
      )}

      <div className='w-full overflow-x-auto rounded-md border'>
        <Table className="w-full min-w-max">
            {showHeader && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as CellAlignment;
                      const canSort = sortEnabledColumns.includes(header.column.id);
                      
                      return (
                        <TableHead
                          key={header.id}
                          className={`${meta?.headerAlign ? `text-${meta.headerAlign}` : 'text-left'} ${
                            canSort ? 'cursor-pointer select-none' : ''
                          } relative`}
                          onClick={() => {
                            if (canSort) {
                              handleSorting(header.column.id);
                            }
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pl-4">
                              {getSortIcon(header.column.id)}
                            </span>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as CellAlignment;
                      
                      return (
                        <TableCell
                          key={cell.id}
                          className={meta?.cellAlign ? `text-${meta.cellAlign}` : 'text-left'}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={memoizedColumns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {emptyStateIcon && (
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                          {emptyStateIcon}
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        {emptyStateMessage || 'No results.'}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
      
      {showPagination && table.getRowModel().rows?.length > 0 && (
        <div className='flex py-4 items-center justify-between flex-wrap gap-4 lg:gap-8'>
          <div className='flex items-center space-x-4 flex-col sm:flex-row'>
            <p className='font-semibold whitespace-nowrap'>Results on Page</p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
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
          
          <CustomPagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPageCount={table.getPageCount()}
            onPageChange={(newPage) => {
              table.setPageIndex(newPage - 1);
            }}
          />
        </div>
      )}
    </div>
  );
}