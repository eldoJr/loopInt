import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const CustomSelect = ({
  options,
  value,
  onChange,
  error,
  className = '',
}: CustomSelectProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800/50 text-white' : 'bg-gray-50 text-gray-900'} border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 transition-all text-sm text-left ${
          error
            ? theme === 'dark'
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'border-red-300 focus:ring-red-500/50'
            : theme === 'dark'
              ? 'border-gray-700/50 focus:ring-blue-500/50'
              : 'border-gray-300 focus:ring-blue-500/50'
        } ${className}`}
      >
        <span>{value}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`w-full mt-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border rounded-lg shadow-lg max-h-none overflow-auto`}
        >
          {options.map(option => (
            <div
              key={option}
              className={`px-3 py-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'} text-sm`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
