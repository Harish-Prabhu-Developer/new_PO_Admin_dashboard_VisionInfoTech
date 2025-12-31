// src/components/SupplierInfo.jsx
import React from "react";
import { Pencil, Save } from "lucide-react";

const SupplierInfo = ({
  title,
  header,
  leftContent,
  rightContent,
  onEdit,
}) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              {title}
              {header}
            </div>

            {/* Edit button – shown only when onEdit exists */}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                aria-label="Edit"
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
                <Pencil
                  size={16}
                  className="
                    absolute left-4
                    opacity-100 translate-y-0
                    transition-all duration-300
                    group-hover:opacity-0 group-hover:-translate-y-2
                  "
                />
                <Save
                  size={16}
                  className="
                    absolute left-4
                    opacity-0 translate-y-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-y-0
                  "
                />
                <span className="pl-6 relative z-10">Edit</span>
              </button>
            )}
          </div>

          {leftContent}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-1 text-xs sm:text-sm md:border-l md:pl-4 lg:pl-6">
          {rightContent}
        </div>

      </div>
    </section>
  );
};

export default SupplierInfo;
