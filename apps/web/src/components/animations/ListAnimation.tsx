import { useTransition, animated } from '@react-spring/web';
import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ListAnimationProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  className?: string;
}

export const ListAnimation = <T,>({ items, children, className = '' }: ListAnimationProps<T>) => {
  const { theme } = useTheme();
  const transitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    config: { tension: 300, friction: 30 },
    trail: 50
  });

  return (
    <div className={`${className} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {transitions((style, item, _, index) => (
        <animated.div style={style}>
          {children(item, index)}
        </animated.div>
      ))}
    </div>
  );
};