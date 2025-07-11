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
      className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl p-5 shadow-sm hover:shadow-md dark:shadow-gray-900/20 group ${
        onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/90 hover:border-gray-300 dark:hover:border-gray-600/70 hover:scale-[1.02] transition-all duration-300' : ''
      }`}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">{title}</p>
          <div className="flex items-baseline space-x-3 mt-1">
            <p className={`text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-200`}>
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
                <span>+{trend.value}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 group-hover:from-orange-100 group-hover:to-orange-200 dark:group-hover:from-orange-800/40 dark:group-hover:to-orange-700/40 transition-all duration-300 shadow-sm border border-orange-200/50 dark:border-orange-700/30`}>
          <Icon className={`w-6 h-6 ${color} group-hover:scale-110 transition-transform duration-200`} />
        </div>
      </div>
      {trend?.period && (
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{trend.period}</p>
      )}
    </motion.div>
  );
};

export default DashboardStatCard;