import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'success' | 'warning';
}

const Badge = ({ children, icon: Icon, variant = 'primary' }: BadgeProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400'
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 border rounded-full text-sm font-medium backdrop-blur-sm ${variants[variant]}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      <span>{children}</span>
    </div>
  );
};

export default Badge;