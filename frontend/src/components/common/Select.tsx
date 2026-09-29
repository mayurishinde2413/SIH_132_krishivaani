import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Select an option',
  required,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const labelText = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
};
