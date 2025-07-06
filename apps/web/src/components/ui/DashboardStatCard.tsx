import type { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
  color = 'text-blue-400',
  onClick
}: DashboardStatCardProps) => {
  return (
    <div 
      className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 ${onClick ? 'cursor-pointer hover:bg-gray-800/30 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );
};

export default DashboardStatCard;