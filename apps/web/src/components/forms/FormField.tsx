import { memo } from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  className?: string;
  'aria-describedby'?: string;
}

export const FormField = memo(({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  className = '',
  'aria-describedby': ariaDescribedby
}: FormFieldProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : ariaDescribedby}
        aria-required={required}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
});