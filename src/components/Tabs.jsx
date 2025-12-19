import React from "react";

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <nav className="border-b border-slate-200 ">
      <ul className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <li key={tab.key}>
              <button
                onClick={() => onChange(tab.key)}
                className={`flex items-center gap-1.5 py-3 sm:py-4 px-1 sm:px-2 
                  border-b-2 whitespace-nowrap transition-colors duration-200
                  ${
                    activeTab === tab.key
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-500 border-transparent hover:text-slate-700"
                  }`}
              >
                {Icon && <Icon size={16} />}
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
