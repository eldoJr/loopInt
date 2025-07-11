import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface Trend {
  value: number;
  direction: 'up' | 'down';
  period?: string;
}

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  trend?: Trend;
  loading?: boolean;
  subtitle?: string;
}

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  color = 'text-blue-400',
  onClick,
  trend,
  loading = false,
  subtitle
}: DashboardStatCardProps) => {
  useTheme();

  if (loading) {
    return (
      <div className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-lg p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-lg p-4 group ${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-gray-300/50 dark:hover:border-gray-700/50 hover:scale-[1.02] transition-all duration-200' : ''
      }`}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className={`text-2xl font-bold text-gray-900 dark:${color} group-hover:scale-105 transition-transform`}>
              {value}
            </p>
            {trend && (
              <div className={`flex items-center space-x-1 text-xs ${
                trend.direction === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800/30 group-hover:bg-gray-200 dark:group-hover:bg-gray-700/30 transition-colors`}>
          <Icon className={`w-5 h-5 text-gray-700 dark:${color}`} />
        </div>
      </div>
      {trend?.period && (
        <p className="text-gray-500 dark:text-gray-500 text-xs">{trend.period}</p>
      )}
    </motion.div>
  );
};

export default DashboardStatCard;