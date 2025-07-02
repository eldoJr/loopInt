import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
}

const QuickActionCard = ({ title, icon: Icon, onClick }: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 flex flex-col items-center justify-center space-y-3 transition-all duration-300 transform hover:scale-105 min-h-[120px]"
    >
      <Icon className="w-8 h-8" />
      <span className="text-sm font-medium text-center">{title}</span>
    </button>
  );
};

export default QuickActionCard;