import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm resize-none ${
            error
              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';