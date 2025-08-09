import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, options, className = '', ...props }, ref) => {
    return (
      <div className="grid grid-cols-12 gap-3 items-center">
        <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
          {label} {required && '*'}
        </label>
        <div className="col-span-4">
          <select
            ref={ref}
            className={`w-full bg-white dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm ${
              error
                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
            } ${className}`}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }
);