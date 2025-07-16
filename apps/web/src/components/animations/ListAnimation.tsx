import { useTransition, animated } from '@react-spring/web';
import { ReactNode } from 'react';

interface ListAnimationProps {
  items: any[];
  children: (item: any, index: number) => ReactNode;
  className?: string;
}

export const ListAnimation = ({ items, children, className = '' }: ListAnimationProps) => {
  const transitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    config: { tension: 300, friction: 30 },
    trail: 50
  });

  return (
    <div className={className}>
      {transitions((style, item, _, index) => (
        <animated.div style={style}>
          {children(item, index)}
        </animated.div>
      ))}
    </div>
  );
};