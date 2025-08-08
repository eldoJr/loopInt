import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  badge?: number;
  shortcut?: string;
  loading?: boolean;
  disabled?: boolean;
}

const QuickActionCard = ({
  title,
  icon: Icon,
  onClick,
  isActive = false,
  badge,
  shortcut,
  loading = false,
  disabled = false,
}: QuickActionCardProps) => {
  if (loading) {
    return (
      <div className="rounded-xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[120px] border-2 border-gray-700/30 bg-gray-800/30 animate-pulse">
        <div className="w-8 h-8 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[120px] border-2 group transition-all duration-200 ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-800/20 border-gray-700/20'
          : isActive
            ? 'bg-blue-500/10 text-blue-400 border-blue-500 hover:bg-blue-500/20 hover:scale-105'
            : 'bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white border-gray-700/30 hover:border-gray-600/50 hover:scale-105'
      }`}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Badge */}
      {badge && badge > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {badge > 99 ? '99+' : badge}
        </motion.div>
      )}

      {/* Shortcut */}
      {shortcut && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
            {shortcut}
          </span>
        </div>
      )}

      <div
        className={`p-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-500/20'
            : 'bg-gray-700/30 group-hover:bg-gray-600/30'
        }`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-sm font-medium text-center leading-tight">
        {title}
      </span>
    </motion.button>
  );
};

export default QuickActionCard;
