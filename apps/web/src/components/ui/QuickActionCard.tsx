import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

const QuickActionCard = ({ title, icon: Icon, onClick, isActive = false }: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-6 flex flex-col items-center justify-center space-y-3 min-h-[120px] border-2 ${
        isActive 
          ? 'bg-blue-500/10 text-blue-400 border-blue-500 hover:bg-blue-500/20' 
          : 'bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 hover:text-white border-gray-700/30'
      }`}
    >
      <Icon className="w-8 h-8" />
      <span className="text-sm font-medium text-center">{title}</span>
    </button>
  );
};

export default QuickActionCard;