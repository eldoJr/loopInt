import { useSpring, animated } from '@react-spring/web';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface PageTransitionProps {
  children: ReactNode;
  location: string;
}

export const PageTransition = ({ children, location }: PageTransitionProps) => {
  const { theme } = useTheme();
  const [currentLocation, setCurrentLocation] = useState(location);
  const [isVisible, setIsVisible] = useState(true);

  const springProps = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(10px)',
    config: { tension: 300, friction: 30 }
  });

  useEffect(() => {
    if (location !== currentLocation) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentLocation(location);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location, currentLocation]);

  return (
    <animated.div 
      style={springProps} 
      className={`w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
    >
      {children}
    </animated.div>
  );
};