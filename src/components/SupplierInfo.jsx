// src/components/SupplierInfo.jsx
import React from "react";
import { Pencil, Save } from "lucide-react";

const SupplierInfo = ({ supplier, po, onEdit }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm  p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Supplier
              </span>
              <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900">{supplier.name}</div>
            </div>

            <div className="shrink-0">
              {/* <button
                type="button"
                onClick={onEdit}
                aria-label="Edit supplier"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button> */}
                <button
      type="button"
      onClick={onEdit}
      aria-label="Edit supplier"
      className="
        group relative inline-flex items-center gap-2
        px-4 py-2 rounded-full
        text-sm font-medium
        text-slate-700
        bg-slate-100
        border border-slate-200
        transition-all duration-300
        hover:bg-slate-900 hover:text-white
        hover:border-slate-900
        active:scale-95
        overflow-hidden
      "
    >
      {/* Pencil (default) */}
      <Pencil
        size={16}
        className="
          absolute left-4
          opacity-100 translate-y-0
          transition-all duration-300
          group-hover:opacity-0 group-hover:-translate-y-2
        "
      />

      {/* Save (hover) */}
      <Save
        size={16}
        className="
          absolute left-4
          opacity-0 translate-y-2
          transition-all duration-300
          group-hover:opacity-100 group-hover:translate-y-0
        "
      />

      {/* Label */}
      <span className="pl-6 relative z-10">
        Edit
      </span>
    </button>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600">Code: {supplier.code}</div>
          <div className="text-xs sm:text-sm text-slate-600">Contact: {supplier.contact}</div>
        </div>

        <div className="space-y-1 text-xs sm:text-sm md:border-l md:pl-4 lg:pl-6">
          {Object.entries(po).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-slate-600">{key}</span>
              <span className="font-medium text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupplierInfo;
