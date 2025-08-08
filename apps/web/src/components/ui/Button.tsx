import { memo } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconPosition = 'right',
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-100';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
    secondary: 'border border-gray-700/50 text-gray-300 hover:bg-gray-800/20 hover:border-gray-600/50',
    outline: 'border border-gray-700/40 text-gray-300 hover:text-white hover:bg-gray-800/20 hover:border-gray-600/60'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="mr-2 h-5 w-5" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${classes} group`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={`${classes} group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {content}
    </button>
  );
});

export default Button;