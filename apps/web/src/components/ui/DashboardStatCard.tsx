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
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl p-5 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-blue-500 dark:bg-blue-600 backdrop-blur-md border border-blue-600 dark:border-blue-500 rounded-xl p-5 shadow-lg hover:shadow-xl dark:shadow-gray-900/30 group ${
        onClick ? 'cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:border-blue-700 dark:hover:border-blue-400 hover:scale-[1.02] transition-all duration-300' : ''
      }`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-semibold tracking-wide">{title}</p>
          <div className="flex items-baseline space-x-3 mt-1">
            <p className={`text-3xl font-black text-white drop-shadow-sm group-hover:scale-105 transition-transform duration-200`}>
              {value}
            </p>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-bold">+{trend.value}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-white/80 text-sm mt-2 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 shadow-md border border-white/20`}>
          <Icon className={`w-6 h-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-200`} />
        </div>
      </div>
      {trend?.period && (
        <p className="text-white/80 text-sm font-medium">{trend.period}</p>
      )}
    </motion.div>
  );
};

export default DashboardStatCard;