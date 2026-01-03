// src/components/ModelForm.jsx
import React, { useState, useEffect } from "react";  // Add useEffect
import { X, Loader2 } from "lucide-react";

const ModelForm = ({ 
  isOpen, 
  onClose, 
  title, 
  fields = [], 
  submitText = "Submit", 
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  // Reset form when modal opens/closes or fields change
  useEffect(() => {
    if (isOpen) {
      const initialData = {};
      fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);
      setFile(null);
    }
  }, [isOpen, fields]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFile(files[0]);
      setFormData(prev => ({ ...prev, [name]: files[0]?.name || '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Prepare data for submission
    const submissionData = { ...formData };
    if (file) {
      submissionData.file = file;
    }
    
    try {
      await onSubmit(submissionData);
      // Don't reset here - let parent handle success
    } catch (error) {
      console.error("Form submission error:", error);
      // Error is handled by parent's toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            type="button"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={isLoading || field.disabled}
                    rows={field.rows || 3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                ) : field.type === 'file' ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      name={field.name}
                      onChange={handleInputChange}
                      required={field.required && !file}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                      accept={field.accept || "*/*"}
                    />
                    {file && (
                      <p className="text-xs text-slate-600">
                        Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                ) : field.input_type === 'dropdown' || field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    disabled={isLoading || field.disabled}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">{field.placeholder || 'Select'}</option>
                    {(field.options || []).map((opt) => {
                      if (typeof opt === 'string') {
                        return (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        );
                      }
                      return (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={isLoading || field.disabled}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                )}
                
                {field.description && (
                  <p className="text-xs text-slate-500">{field.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelForm;