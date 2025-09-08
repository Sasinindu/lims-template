import React from 'react';
import { Trash2 } from 'lucide-react';

interface SimpleTableColumn {
  key: string;
  title: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface SimpleTableProps {
  columns: SimpleTableColumn[];
  data: any[];
  onRemove?: (index: number) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  onRemove,
  showActions = true,
  emptyMessage = 'No data available'
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
            {showActions && onRemove && (
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((record, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {column.render 
                    ? column.render(record[column.key], record, index)
                    : record[column.key]
                  }
                </td>
              ))}
              {showActions && onRemove && (
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
