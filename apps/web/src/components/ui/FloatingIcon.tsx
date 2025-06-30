import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FloatingIconProps {
  icon: LucideIcon;
  position: 'top-right' | 'bottom-left';
  bgColor: string;
  delay?: number;
}

const FloatingIcon = ({ icon: Icon, position, bgColor, delay = 0 }: FloatingIconProps) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const animationY = position === 'top-right' ? [-10, 0] : [10, 0];

  return (
    <motion.div 
      className={`absolute ${positionClasses[position]} w-16 h-16 ${bgColor} rounded-full flex items-center justify-center shadow-lg`}
      animate={{ 
        y: [0, ...animationY],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: position === 'top-right' ? 3 : 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      <Icon className="w-8 h-8 text-white" />
    </motion.div>
  );
};

export default FloatingIcon;