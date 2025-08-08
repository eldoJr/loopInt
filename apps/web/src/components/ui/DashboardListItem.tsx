import type { ReactNode } from 'react';

interface DashboardListItemProps {
  title: string;
  subtitle?: string;
  status?: string;
  color?: string;
  onClick?: () => void;
  actions?: ReactNode;
  icon?: ReactNode;
  completed?: boolean;
}

const DashboardListItem = ({
  title,
  subtitle,
  status,
  color = '#3B82F6',
  onClick,
  actions,
  icon,
  completed = false,
}: DashboardListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'planning':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'on-hold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
      case 'done':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {icon || (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
        )}
        <div>
          <span
            className={`text-gray-300 font-medium ${completed ? 'line-through opacity-60' : ''}`}
          >
            {title}
          </span>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">
              {subtitle.length > 50
                ? `${subtitle.substring(0, 50)}...`
                : subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {actions}
        {status && (
          <span
            className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(status)}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardListItem;
