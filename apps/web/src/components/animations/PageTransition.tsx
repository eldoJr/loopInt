import { useTransition, animated } from '@react-spring/web';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
}

export const PageTransition = ({ children, location }: PageTransitionProps) => {
  const transitions = useTransition(location, {
    from: { opacity: 0, transform: 'translateX(20px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: 'translateX(-20px)' },
    config: { tension: 280, friction: 60 }
  });

  return transitions((style, item) => (
    <animated.div style={style} className="w-full h-full">
      {children}
    </animated.div>
  ));
};