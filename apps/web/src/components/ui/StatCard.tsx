import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color?: 'blue' | 'purple' | 'emerald';
}

const StatCard = ({ icon: Icon, value, label, color = 'blue' }: StatCardProps) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    emerald: 'bg-emerald-500/10 text-emerald-400'
  };

  return (
    <div className="text-center space-y-2">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
};

export default StatCard;