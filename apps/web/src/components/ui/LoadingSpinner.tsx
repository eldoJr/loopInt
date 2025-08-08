import { useTheme } from '../../context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Main Spinner */}
      <div className="relative mb-4">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
        >
          <div
            className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`}
          ></div>
        </div>

        {/* Pulse Ring */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-blue-500/20 dark:border-blue-400/20 rounded-full animate-ping`}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
