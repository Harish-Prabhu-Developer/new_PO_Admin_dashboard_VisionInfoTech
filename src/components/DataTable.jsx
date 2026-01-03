// src/components/DataTable.jsx
import React, { useState } from "react";
import Pagination from "./common/Pagination";

const DataTable = ({
  columns,
  data,
  itemsPerPage = 7,
  isLoading = false,
  onRowClick,
  className = "",
  HeaderClassName = "bg-yellow-200 border-b border-slate-300",
  emptyMessage = "No data available",
  emptySubMessage = "Add items to get started",
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getAlign = (col) => col.align || "text-center";

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* Header */}
          <thead className={HeaderClassName}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3
                    text-xs font-semibold text-slate-600 uppercase tracking-wide
                    ${getAlign(col)}
                  `}
                >
                  <div
                    className={`
                      flex items-center gap-1
                      ${
                        col.align === "text-left"
                          ? "justify-start"
                          : col.align === "text-right"
                          ? "justify-end"
                          : "justify-center"
                      }
                    `}
                  >
                    {col.label}
                    {col.icon && <col.icon className="w-3 h-3 opacity-60" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-slate-600">Loading data...</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : currentData.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-600 font-medium">{emptyMessage}</p>
                    <p className="text-xs text-slate-500 mt-1">{emptySubMessage}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-slate-300">
              {currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-4 py-3 text-slate-700
                        ${getAlign(col)}
                      `}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination - Only show if there's data */}
      {!isLoading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          className="border-t"
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default DataTable;