import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onHomeClick?: () => void;
}

const Breadcrumb = ({ items, onHomeClick }: BreadcrumbProps) => {
  useTheme();

  return (
    <motion.nav 
      className="flex items-center space-x-1 text-sm py-3 mb-6 overflow-x-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Home Icon */}
      <motion.div className="flex items-center space-x-2 flex-shrink-0">
        <motion.button
          onClick={onHomeClick}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </motion.button>
        {items.length > 0 && (
          <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        )}
      </motion.div>
      
      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <motion.div 
          key={index} 
          className="flex items-center space-x-2 whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {item.onClick ? (
            <motion.button
              onClick={item.onClick}
              className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon && <item.icon className="w-3 h-3" />}
              <span>{item.label}</span>
            </motion.button>
          ) : (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md font-medium ${
              index === items.length - 1 
                ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.icon && <item.icon className="w-3 h-3" />}
              <span>{item.label}</span>
            </div>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;