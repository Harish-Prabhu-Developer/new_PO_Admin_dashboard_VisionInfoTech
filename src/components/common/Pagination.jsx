// src/components/common/Pagination.jsx
import React from "react";
import { Loader } from "lucide-react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  maxVisiblePages = 5,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (!isLoading) onPageChange(page);
  };

  /* Visible page calculation */
  const half = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-center justify-between gap-4
        px-4 py-3
        bg-white border border-slate-200 rounded-xl shadow-sm
        text-xs sm:text-sm
        ${isLoading ? "opacity-75" : ""}
        transition-opacity duration-300
        ${className}
      `}
    >
      {/* Info */}
      <div className="flex items-center gap-2 text-slate-600 font-medium">
        {isLoading && (
          <Loader className="w-4 h-4 animate-spin text-blue-500" />
        )}
        <span>
          Showing
          <span className="mx-1 text-slate-900">
            {isLoading ? "..." : `${startIndex}–${endIndex}`}
          </span>
          of
          <span className="mx-1 text-slate-900">
            {isLoading ? "..." : totalItems}
          </span>
          entries
          {isLoading && " (loading...)"}
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || isLoading}
          className={`
            flex items-center gap-1
            px-3 py-2 rounded-lg
            border border-slate-300
            font-medium
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            ${
              isLoading
                ? "cursor-wait bg-slate-50 text-slate-400"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }
          `}
        >
          {isLoading && currentPage > 1 ? (
            <Loader className="w-3 h-3 animate-spin" />
          ) : (
            "←"
          )}
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            disabled={isLoading}
            className={`
              relative
              px-3 py-2 rounded-lg font-medium
              transition-all duration-200
              disabled:cursor-wait
              ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-sm"
                  : `bg-white text-slate-700 border border-slate-300 ${
                      isLoading
                        ? "hover:bg-slate-50"
                        : "hover:bg-slate-50 hover:border-slate-400"
                    }`
              }
            `}
          >
            {isLoading && page === currentPage && (
              <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-white" />
            )}
            <span className={isLoading && page === currentPage ? "invisible" : ""}>
              {page}
            </span>
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || isLoading}
          className={`
            flex items-center gap-1
            px-3 py-2 rounded-lg
            border border-slate-300
            font-medium
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            ${
              isLoading
                ? "cursor-wait bg-slate-50 text-slate-400"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }
          `}
        >
          <span>Next</span>
          {isLoading && currentPage < totalPages ? (
            <Loader className="w-3 h-3 animate-spin" />
          ) : (
            "→"
          )}
        </button>
      </div>
    </div>
  );
};

export default Pagination;