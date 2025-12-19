import { MoreVertical } from "lucide-react";

export const AvatarCell = ({ value, row }) => (
  <div className="flex items-center gap-3">
    <img
      src={row.avatar}
      alt={value}
      className="w-9 h-9 rounded-full object-cover"
    />
    <div>
      <div className="font-medium text-slate-900">{value}</div>
      {row.username && (
        <div className="text-xs text-slate-500">@{row.username}</div>
      )}
    </div>
  </div>
);

export const StatusBadge = ({ value }) => {
  const styles = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
        styles[value] || "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
};

export const ChipsCell = ({ value = [] }) => (
  <div className="flex flex-wrap gap-1">
    {value.map((item, index) => (
      <span
        key={index}
        className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
      >
        {item}
      </span>
    ))}
  </div>
);

export const ActionsCell = () => (
  <button className="p-2 rounded-lg hover:bg-slate-100">
    <MoreVertical className="w-4 h-4 text-slate-500" />
  </button>
);