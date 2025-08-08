import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { RetryButton } from '../ui/RetryButton';

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export const ErrorFallback = memo(
  ({
    error,
    onRetry,
    title = 'Something went wrong',
    message,
    showRetry = true,
  }: ErrorFallbackProps) => {
    const errorMessage =
      message || error?.message || 'An unexpected error occurred';

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          {errorMessage}
        </p>
        {showRetry && onRetry && <RetryButton onRetry={onRetry} />}
      </div>
    );
  }
);
