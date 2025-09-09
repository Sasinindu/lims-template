import React from 'react';
import { Trash2, Edit } from 'lucide-react';

interface SimpleTableColumn {
  key: string;
  title: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface SimpleTableProps {
  columns: SimpleTableColumn[];
  data: any[];
  onRemove?: (index: number) => void;
  onEdit?: (index: number) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  onRemove,
  onEdit,
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

  const hasActions = showActions && (onRemove || onEdit);

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
            {hasActions && (
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
              {hasActions && (
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(index)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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
