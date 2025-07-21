import { useTheme } from '../../context/ThemeContext';
import type { LucideIcon } from 'lucide-react';
import { AnimatedCard } from '../animations/MicroInteractions';

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
    <AnimatedCard 
      className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-2.5 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-900/50"
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-blue-300/20 dark:from-blue-400/10 dark:to-blue-300/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-700"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-end mb-2">
          {trend && (
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              trend.direction === 'up' 
                ? 'bg-emerald-400/90 text-emerald-900' 
                : 'bg-red-400/90 text-red-900'
            }`}>
              {trend.direction === 'up' ? '↗' : '↘'}{trend.value}%
            </div>
          )}
        </div>
        
        {/* Value and Icon */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-lg sm:text-xl font-black text-white mb-0.5 tracking-tight leading-none drop-shadow-sm">
              {value}
            </p>
            <p className="text-blue-100 font-semibold text-xs sm:text-sm">
              {title}
            </p>
          </div>
          <div className="p-1.5 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all duration-300">
            {IconComponent ? (
              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 opacity-90 group-hover:opacity-100 ${color || 'text-white'}`} />
            ) : (
              <img 
                src={iconSrc} 
                alt={iconAlt} 
                className="w-5 h-5 sm:w-6 sm:h-6 opacity-90 group-hover:opacity-100" 
              />
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-blue-200 font-medium text-xs">
              {subtitle}
            </p>
          )}
          {trend?.period && (
            <p className="text-blue-300 font-medium text-xs">
              {trend.period}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"></div>
    </AnimatedCard>
  );
};

export default DashboardStatCard;