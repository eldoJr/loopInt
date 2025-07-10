import { useState, useRef, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  User, 
  Building, 
  Settings, 
  Globe, 
  RotateCcw, 
  Maximize, 
  Plus, 
  Bug, 
  HelpCircle, 
  UserPlus, 
  LogOut,
  ChevronDown
} from 'lucide-react';

interface UserType {
  name?: string;
  email?: string;
}

interface UserProfileDropdownProps {
  user: UserType;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
}

const UserProfileDropdown = ({ user, onLogout, onNavigate }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  type MenuItem = {
    icon?: ComponentType<{ className?: string }>;
    label?: string;
    action?: () => void;
    hasFlag?: boolean;
    divider?: boolean;
    danger?: boolean;
  };
  
  const menuItems: MenuItem[] = [
      { icon: User, label: 'Personal data', action: () => onNavigate?.('Personal Data') },
      { icon: Building, label: 'Organization data', action: () => onNavigate?.('Organization Data') },
      { icon: Settings, label: 'Account settings', action: () => onNavigate?.('Account Settings') },
      { icon: Globe, label: 'Language (English)', action: () => onNavigate?.('Language'), hasFlag: true },
      { icon: RotateCcw, label: 'Toggle menu orientation', action: () => onNavigate?.('Menu Orientation') },
      { icon: Maximize, label: 'Resize my view', action: () => onNavigate?.('View Resize') },
      { divider: true },
      { icon: Plus, label: 'I need a new feature', action: () => onNavigate?.('New Feature') },
      { icon: Bug, label: 'Report a bug', action: () => onNavigate?.('Report Bug') },
      { icon: HelpCircle, label: 'Help Center', action: () => onNavigate?.('Help Center') },
      { divider: true },
      { icon: UserPlus, label: 'New account option', action: () => onNavigate?.('New Account') },
      { icon: LogOut, label: 'Log out', action: onLogout, danger: true }
    ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-medium">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">{user?.name || 'User'}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
              <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-yellow-400'}`} />
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="my-2 border-t border-gray-200 dark:border-gray-800" />;
              }

              return (
                <button
                  key={`menu-item-${index}`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 flex items-center space-x-3 transition-all duration-200 text-left hover:scale-105 active:scale-95 ${
                    item.danger 
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.hasFlag && (
                    <div className="ml-auto w-5 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🇺🇸</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;