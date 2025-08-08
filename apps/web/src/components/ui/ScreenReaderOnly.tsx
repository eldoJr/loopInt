import { memo } from 'react';
import type { JSX } from 'react';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly = memo(({ 
  children, 
  as: Component = 'span' 
}: ScreenReaderOnlyProps) => {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
});