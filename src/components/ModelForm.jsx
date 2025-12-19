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
  const [formData, setFormData] = useState({});

  // Initialize form data from fields
  useEffect(() => {
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue || "";
    });
    setFormData(initialData);
  }, [fields, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "idle") return;

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
        setFormData({});
        onClose();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <style>{`
        .modern-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .modern-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .modern-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #1e40af);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .modern-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #1e40af, #1e3a8a);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
        }
        
        /* Firefox */
        .modern-scrollbar {
          scrollbar-color: #3b82f6 transparent;
          scrollbar-width: thin;
        }
      `}</style>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col max-h-[90vh] transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form with Scrollable Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Fields Container */}
          <div className="modern-scrollbar space-y-4 overflow-y-auto flex-1 pr-1 mb-6">
            {fields.map((field, index) => (
              <div 
                key={field.name}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: `fadeIn 0.3s ease-in-out forwards`,
                  opacity: 0,
                }}
              >
                <style>{`
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(-5px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
                
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                  disabled={status === "loading"}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-800"
                />
              </div>
            ))}
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={status === "loading"}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>

            {/* Animated Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`
                group inline-flex items-center gap-2
                px-6 py-2.5 rounded-lg
                text-sm font-semibold text-white
                transition-all duration-300
                active:scale-95
                disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
                ${
                  status === "idle" &&
                  "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }
                ${
                  status === "loading" &&
                  "bg-linear-to-r from-blue-600 to-blue-700 opacity-80"
                }
                ${
                  status === "success" &&
                  "bg-linear-to-r from-emerald-500 to-emerald-600"
                }
                ${
                  status === "error" &&
                  "bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                }
              `}
            >
              {/* Icons */}
              {status === "idle" && <Send size={18} />}
              {status === "loading" && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {status === "success" && <Check size={18} />}
              {status === "error" && <XCircle size={18} />}

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
