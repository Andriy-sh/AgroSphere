'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowClassName?: (row: any) => string;
  rowClassName?: string;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  getRowClassName,
  rowClassName,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <Table className="table-fixed overflow-visible relative">
        <TableHeader className="text-basic-gray bg-basic-white ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className={rowClassName} key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const colClass =
                  (header.column.columnDef.meta as { className?: string })
                    ?.className || '';
                return (
                  <TableHead
                    className={`text-sm font-normal overflow-hidden ${colClass}`}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={`relative ${
                  getRowClassName
                    ? getRowClassName(row)
                    : (row.original as any)?.isNew
                    ? 'bg-gray-50'
                    : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => {
                  const colClass =
                    (cell.column.columnDef.meta as { className?: string })
                      ?.className || '';
                  return (
                    <TableCell
                      key={cell.id}
                      className={`overflow-visible ${colClass}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
