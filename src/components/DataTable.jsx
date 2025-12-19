// src/components/DataTable.jsx
import React, { useState } from "react";
import Pagination from "./common/Pagination";

const DataTable = ({
  columns,
  data,
  itemsPerPage = 7,
  onRowClick,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const getAlign = (col) => col.align || "text-center";

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* Header */}
          <thead className="bg-slate-50 border-b">
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
          <tbody className="divide-y">
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
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        className="border-t"
      />
    </div>
  );
};

export default DataTable;
