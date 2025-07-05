import { ReactNode } from 'react';

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: ReactNode;
  'aria-label'?: string;
}

export const Toggle = ({ pressed = false, onPressedChange, children, 'aria-label': ariaLabel }: ToggleProps) => {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={() => onPressedChange?.(!pressed)}
      className={`p-2 rounded-md transition-colors ${
        pressed 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
      }`}
    >
      {children}
    </button>
  );
};