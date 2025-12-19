// src/components/ModelForm.jsx
import React, { useState, useEffect } from "react";
import { Send, Loader2, Check, XCircle } from "lucide-react";

const ModelForm = ({
  isOpen,
  onClose,
  title,
  fields = [],
  onSubmit,
  submitText = "Submit",
}) => {
  if (!isOpen) return null;

  const [status, setStatus] = useState("idle");
  // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "idle") return;

    const formData = {};
    fields.forEach((field) => {
      formData[field.name] = e.target[field.name]?.value;
    });

    try {
      setStatus("loading");

      // Support async submit
      await Promise.resolve(onSubmit(formData));

      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  // ✅ Auto close / reset after success
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                defaultValue={field.defaultValue || ""}
                required={field.required}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={status === "loading"}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Animated Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`
                group inline-flex items-center gap-2
                px-4 py-2 rounded
                text-sm font-medium text-white
                transition-all duration-300
                active:scale-95
                disabled:cursor-not-allowed
                ${
                  status === "idle" &&
                  "bg-blue-600 hover:bg-blue-700"
                }
                ${
                  status === "loading" &&
                  "bg-blue-600 opacity-80"
                }
                ${
                  status === "success" &&
                  "bg-emerald-600"
                }
                ${
                  status === "error" &&
                  "bg-red-600 hover:bg-red-700"
                }
              `}
            >
              {/* Icons */}
              {status === "idle" && <Send size={16} />}
              {status === "loading" && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {status === "success" && <Check size={16} />}
              {status === "error" && <XCircle size={16} />}

              {/* Labels */}
              <span>
                {status === "idle" && submitText}
                {status === "loading" && "Submitting..."}
                {status === "success" && "Done"}
                {status === "error" && "Retry"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelForm;
