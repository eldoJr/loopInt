import { useCallback } from 'react';
import { showToast } from '../components/ui/Toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast: shouldShowToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    // Log error
    if (logError) {
      console.error('Error handled:', error);
    }

    // Get error message
    const message = error instanceof Error ? error.message : fallbackMessage;

    // Show toast notification
    if (shouldShowToast) {
      showToast.error(message);
    }

    return message;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};