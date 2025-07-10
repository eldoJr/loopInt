import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  useTheme();

  return (
    <nav className="flex items-center space-x-1 text-sm py-3 mb-6">
      {/* Home Icon */}
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
          <Home className="w-3 h-3 text-gray-600 dark:text-gray-400" />
        </div>
        {items.length > 0 && (
          <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      
      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105 active:scale-95 font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className={`px-2 py-1 rounded-md font-medium ${
              index === items.length - 1 
                ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;