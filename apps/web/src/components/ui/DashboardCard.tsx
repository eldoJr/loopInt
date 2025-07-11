import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onAdd?: () => void;
  headerActions?: ReactNode;
}

const DashboardCard = ({ title, icon: Icon, children, onAdd, headerActions }: DashboardCardProps) => {
  useTheme();
  
  return (
    <div className="bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {headerActions}
            {onAdd && (
              <button 
                onClick={onAdd}
                className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-md flex items-center justify-center transition-colors"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;