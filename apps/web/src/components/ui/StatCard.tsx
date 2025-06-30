import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <motion.div 
      className="text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
  );
};

export default StatCard;