import { useSpring, animated, useSpringValue } from '@react-spring/web';
import { useEffect } from 'react';

export const PulseLoader = ({ size = 40, color = '#3B82F6' }: { size?: number; color?: string }) => {
  const scale = useSpringValue(1);

  useEffect(() => {
    const animate = () => {
      scale.start({
        from: 1,
        to: 1.2,
        config: { duration: 800 },
        onRest: () => {
          scale.start({
            from: 1.2,
            to: 1,
            config: { duration: 800 },
            onRest: animate
          });
        }
      });
    };
    animate();
  }, [scale]);

  return (
    <animated.div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        scale
      }}
    />
  );
};

export const SkeletonLoader = ({ className = '' }: { className?: string }) => {
  const shimmer = useSpring({
    from: { backgroundPosition: '-200px 0' },
    to: { backgroundPosition: '200px 0' },
    config: { duration: 1500 },
    loop: true
  });

  return (
    <animated.div
      style={{
        ...shimmer,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200px 100%'
      }}
      className={`animate-pulse rounded ${className}`}
    />
  );
};

export const SpinLoader = ({ size = 24, color = '#3B82F6' }: { size?: number; color?: string }) => {
  const rotate = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: 1000 },
    loop: true
  });

  return (
    <animated.div
      style={{
        ...rotate,
        width: size,
        height: size,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%'
      }}
    />
  );
};