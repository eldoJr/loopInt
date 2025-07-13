import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import type { LucideIcon } from 'lucide-react';

interface Trend {
  value: number;
  direction: 'up' | 'down';
  period?: string;
}

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  iconSrc?: string;
  iconAlt?: string;
  icon?: LucideIcon;
  color?: string;
  bgColor?: string;
  hoverColor?: string;
  onClick?: () => void;
  trend?: Trend;
  loading?: boolean;
  subtitle?: string;
}

const DashboardStatCard = ({
  title,
  value,
  iconSrc,
  iconAlt,
  icon: IconComponent,
  color,
  onClick,
  trend,
  loading = false,
  subtitle
}: DashboardStatCardProps) => {
  useTheme();

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 animate-pulse">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded-2xl mb-4"></div>
          <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-16 mb-2"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-3xl p-3 sm:p-4 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-900/50"
      onClick={onClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/10 to-blue-300/20 dark:from-blue-400/10 dark:to-blue-300/10 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-end mb-2 sm:mb-3">
          {trend && (
            <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold ${
              trend.direction === 'up' 
                ? 'bg-emerald-400/90 text-emerald-900' 
                : 'bg-red-400/90 text-red-900'
            }`}>
              {trend.direction === 'up' ? '↗' : '↘'}{trend.value}%
            </div>
          )}
        </div>
        
        {/* Value and Icon */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 tracking-tight leading-none drop-shadow-sm">
              {value}
            </p>
            <p className="text-blue-100 font-semibold text-sm sm:text-base">
              {title}
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all duration-300">
            {IconComponent ? (
              <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-90 group-hover:opacity-100 ${color || 'text-white'}`} />
            ) : (
              <img 
                src={iconSrc} 
                alt={iconAlt} 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-90 group-hover:opacity-100" 
              />
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-start">
          {subtitle && (
            <p className="text-blue-200 font-medium text-xs sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Period */}
        {trend?.period && (
          <div className="mt-2">
            <p className="text-blue-300 font-medium text-xs">
              {trend.period}
            </p>
          </div>
        )}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"></div>
    </motion.div>
  );
};

export default DashboardStatCard;