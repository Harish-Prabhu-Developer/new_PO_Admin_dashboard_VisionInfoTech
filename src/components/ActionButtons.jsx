import React, { useState, useEffect } from "react";
import {
  Save,
  ArrowRight,
  Loader2,
  Check,
  XCircle,
  RefreshCcw,
} from "lucide-react";

const ActionButtons = () => {
  const [status, setStatus] = useState("idle");
  // idle | loading | success | error

  const handleProcess = () => {
    if (status !== "idle") return;

    setStatus("loading");

    // Simulated API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // simulate error sometimes
      setStatus(isSuccess ? "success" : "error");
    }, 2000);
  };

  // ✅ Auto reset after success
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col sm:flex-row justify-end my-4 gap-2">

      {/* Save Draft */}
      <button
        disabled={status === "loading"}
        className="
          inline-flex items-center gap-2
          px-3 py-1.5 text-xs sm:text-sm font-medium
          text-slate-700 border border-slate-300 rounded
          transition-all duration-300
          hover:bg-slate-100
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Save size={14} />
        Save Draft
      </button>

      {/* Process Order */}
      <button
        onClick={handleProcess}
        disabled={status === "loading"}
        className={`
          inline-flex items-center gap-2
          px-3 py-1.5 text-xs sm:text-sm font-medium rounded
          transition-all duration-300
          active:scale-95
          disabled:cursor-not-allowed
          ${
            status === "idle" &&
            "bg-blue-600 text-white hover:bg-blue-700"
          }
          ${
            status === "loading" &&
            "bg-blue-600 text-white opacity-80"
          }
          ${
            status === "success" &&
            "bg-emerald-600 text-white"
          }
          ${
            status === "error" &&
            "bg-red-600 text-white hover:bg-red-700"
          }
        `}
      >
        {/* ICONS */}
        {status === "idle" && <ArrowRight size={14} />}
        {status === "loading" && (
          <Loader2 size={14} className="animate-spin" />
        )}
        {status === "success" && <Check size={14} />}
        {status === "error" && <XCircle size={14} />}

        {/* LABELS */}
        <span>
          {status === "idle" && "Process Order"}
          {status === "loading" && "Processing..."}
          {status === "success" && "Completed"}
          {status === "error" && "Failed — Retry"}
        </span>

        {/* Retry Icon */}
        {status === "error" && (
          <RefreshCcw size={14} className="ml-1" />
        )}
      </button>

    </div>
  );
};

export default ActionButtons;
