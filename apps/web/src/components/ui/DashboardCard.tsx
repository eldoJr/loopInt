import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  onAdd?: () => void;
  headerActions?: ReactNode;
}

const DashboardCard = ({ title, icon: Icon, children, onAdd, headerActions }: DashboardCardProps) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            {headerActions}
            {onAdd && (
              <button 
                onClick={onAdd}
                className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;