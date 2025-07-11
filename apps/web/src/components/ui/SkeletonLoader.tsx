import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'stat' | 'text' | 'avatar' | 'custom';
  count?: number;
  className?: string;
  animate?: boolean;
}

const SkeletonLoader = ({ 
  variant = 'card', 
  count = 1, 
  className = '',
  animate = true 
}: SkeletonLoaderProps) => {
  const baseClasses = `bg-gray-700/30 rounded ${animate ? 'animate-pulse' : ''}`;
  
  const variants = {
    card: (
      <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className={`h-4 ${baseClasses} w-3/4`}></div>
            <div className={`h-6 ${baseClasses} w-1/2`}></div>
          </div>
          <div className={`w-12 h-12 ${baseClasses} rounded-lg`}></div>
        </div>
        <div className="space-y-2">
          <div className={`h-3 ${baseClasses} w-full`}></div>
          <div className={`h-3 ${baseClasses} w-2/3`}></div>
        </div>
      </div>
    ),
    
    list: (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-3 p-3">
          <div className={`w-3 h-3 ${baseClasses} rounded-full`}></div>
          <div className="flex-1 space-y-2">
            <div className={`h-4 ${baseClasses} w-3/4`}></div>
            <div className={`h-3 ${baseClasses} w-1/2`}></div>
          </div>
          <div className={`h-6 ${baseClasses} w-16 rounded-full`}></div>
        </div>
      </div>
    ),
    
    stat: (
      <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className={`h-4 ${baseClasses} w-20`}></div>
            <div className={`h-8 ${baseClasses} w-16`}></div>
          </div>
          <div className={`w-8 h-8 ${baseClasses} rounded`}></div>
        </div>
      </div>
    ),
    
    text: (
      <div className={`space-y-2 ${className}`}>
        <div className={`h-4 ${baseClasses} w-full`}></div>
        <div className={`h-4 ${baseClasses} w-5/6`}></div>
        <div className={`h-4 ${baseClasses} w-4/6`}></div>
      </div>
    ),
    
    avatar: (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`w-10 h-10 ${baseClasses} rounded-full`}></div>
        <div className="space-y-2">
          <div className={`h-4 ${baseClasses} w-24`}></div>
          <div className={`h-3 ${baseClasses} w-16`}></div>
        </div>
      </div>
    ),
    
    custom: (
      <div className={`${baseClasses} ${className}`}></div>
    )
  };

  const SkeletonItem = () => variants[variant];

  if (count === 1) {
    return animate ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SkeletonItem />
      </motion.div>
    ) : (
      <SkeletonItem />
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={animate ? { opacity: 0, y: 20 } : {}}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={animate ? { delay: index * 0.1, duration: 0.3 } : {}}
        >
          <SkeletonItem />
        </motion.div>
      ))}
    </div>
  );
};

// Specific skeleton components for common use cases
export const CardSkeleton = ({ count = 1 }: { count?: number }) => (
  <SkeletonLoader variant="card" count={count} />
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <SkeletonLoader variant="list" count={count} />
);

export const StatSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLoader key={index} variant="stat" />
    ))}
  </div>
);

export const QuickActionSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-xl p-6 bg-gray-800/30 border-2 border-gray-700/30 animate-pulse">
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[120px]">
          <div className="w-8 h-8 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;