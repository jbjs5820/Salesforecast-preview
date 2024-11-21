import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';

interface DataPoint {
  ds: string;
  weekday: string;
  actual: number;
  predicted: number;
  difference: number;
  percentChange: number;
}

interface DataTableProps {
  data: DataPoint[];
}

const columnHelper = createColumnHelper<DataPoint>();

const columns = [
  columnHelper.accessor('ds', {
    header: 'Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('weekday', {
    header: 'Day',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('actual', {
    header: 'Actual',
    cell: info => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('predicted', {
    header: 'Predicted',
    cell: info => info.getValue().toLocaleString(),
  }),
  columnHelper.accessor('difference', {
    header: 'Difference',
    cell: info => {
      const value = info.getValue();
      const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
      const Icon = value > 0 ? ArrowUpCircle : value < 0 ? ArrowDownCircle : MinusCircle;
      return (
        <div className={`flex items-center space-x-1 ${color}`}>
          <Icon className="h-4 w-4" />
          <span>{Math.abs(value).toLocaleString()}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('percentChange', {
    header: '% Change',
    cell: info => {
      const value = info.getValue();
      const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
      return (
        <span className={color}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}%
        </span>
      );
    },
  }),
];

function DataTable({ data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;