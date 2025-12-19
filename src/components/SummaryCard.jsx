import React from "react";

const SummaryCard = ({ summary }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Total Summary</h3>
      <div className="space-y-2 text-xs sm:text-sm">
        {summary.map((row, i) => (
          <div key={i} className="flex justify-between gap-4">
            <span className="text-slate-600">{row.label}</span>
            <span className="font-semibold text-slate-900">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SummaryCard;
