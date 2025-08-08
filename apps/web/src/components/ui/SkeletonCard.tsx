import { memo } from 'react';

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard = memo(({ 
  className = '', 
  showAvatar = false, 
  lines = 3 
}: SkeletonCardProps) => {
  return (
    <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
      </div>
    </div>
  );
});