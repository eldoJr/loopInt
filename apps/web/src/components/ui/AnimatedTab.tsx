import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface AnimatedTabProps {
  name: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  index: number;
  colorClass: string;
}

const AnimatedTab = ({
  name,
  icon: Icon,
  isActive,
  onClick,
  index,
  colorClass,
}: AnimatedTabProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 ${colorClass} ${isActive ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      viewport={{ once: true }}
    >
      <Icon className="w-5 h-5" />
      <span>{name}</span>
    </motion.button>
  );
};

export default AnimatedTab;
