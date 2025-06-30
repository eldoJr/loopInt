import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: 'blue' | 'purple' | 'emerald';
}

const StatCard = ({ value, label, icon: Icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400'
  };

  return (
    <motion.div 
      className="text-center space-y-2"
      whileHover={{ scale: 1.05 }}
    >
      {Icon && color && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className={`text-3xl font-bold ${Icon ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      <div className={`${Icon ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    </motion.div>
  );
};

export default StatCard;