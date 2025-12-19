import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
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
        ${className}
      `}
    >
      {/* Info */}
      <div className="text-slate-600 font-medium">
        Showing
        <span className="mx-1 text-slate-900">
          {startIndex}–{endIndex}
        </span>
        of
        <span className="mx-1 text-slate-900">
          {totalItems}
        </span>
        entries
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="
            flex items-center gap-1
            px-3 py-2 rounded-lg
            border border-slate-300
            bg-white text-slate-700 font-medium
            hover:bg-slate-50
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          ← <span>Previous</span>
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-2 rounded-lg font-medium
              transition
              ${
                page === currentPage
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="
            flex items-center gap-1
            px-3 py-2 rounded-lg
            border border-slate-300
            bg-white text-slate-700 font-medium
            hover:bg-slate-50
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <span>Next</span> →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
