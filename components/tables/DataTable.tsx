"use client";

import React, { useState, useMemo } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

export default function DataTable<T>({ data, columns, rowKey, pageSize = 8 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      // Cycle: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Fallback for other types
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const getSortIcon = (columnKey: keyof T) => {
    if (sortColumn !== columnKey) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => {
              const isAccessorString = typeof column.accessor === 'string';
              const columnKey = isAccessorString ? column.accessor as keyof T : null;
              const isSortable = column.sortable !== false && isAccessorString;

              return (
                <th
                  key={index} /* px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 */
                  scope="col"
                  className={`px-6 py-3 text-left text-xm font-semibold text-black-500 dark:text-gray-300 tracking-wider ${
                    isSortable ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : ''
                  }`}
                  onClick={() => isSortable && columnKey && handleSort(columnKey)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {isSortable && columnKey && getSortIcon(columnKey)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {paginatedData.map((row) => (
            <tr key={String(row[rowKey])} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : String(row[column.accessor] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-accent-500 hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <div className="flex items-center mx-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-accent-500 hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}