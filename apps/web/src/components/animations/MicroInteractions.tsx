import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const AnimatedButton = ({ children, onClick, className = '', disabled = false }: AnimatedButtonProps) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const springProps = useSpring({
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 400, friction: 10 }
  });

  return (
    <animated.button
      style={springProps}
      className={`${className} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </animated.button>
  );
};

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedCard = ({ children, className = '' }: AnimatedCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const springProps = useSpring({
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    boxShadow: isHovered 
      ? theme === 'dark'
        ? '0 10px 25px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      : theme === 'dark'
        ? '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div
      style={springProps}
      className={`${className} ${theme === 'dark' ? 'text-white bg-gray-800/50' : 'text-gray-900 bg-white'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </animated.div>
  );
};