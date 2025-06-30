import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: LucideIcon;
  text: string;
  index: number;
}

const FeatureItem = ({ icon: Icon, text, index }: FeatureItemProps) => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      <motion.div 
        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon className="w-4 h-4 text-white" />
      </motion.div>
      <span className="text-gray-700 font-medium">{text}</span>
    </motion.div>
  );
};

export default FeatureItem;