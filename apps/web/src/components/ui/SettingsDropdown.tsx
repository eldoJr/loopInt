import { useState, useRef, useEffect } from 'react';
import { Settings, User, Palette, Globe, Shield, Bell, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SettingsDropdownProps {
  onNavigate?: (section: string) => void;
}

const settingsItems = [
  {
    title: 'Account Settings',
    description: 'Manage your account preferences',
    icon: User,
    section: 'Account Settings'
  },
  {
    title: 'Appearance',
    description: 'Customize theme and display',
    icon: Palette,
    section: 'Appearance'
  },
  {
    title: 'Language',
    description: 'Change language settings',
    icon: Globe,
    section: 'Language'
  },
  {
    title: 'Privacy & Security',
    description: 'Control your privacy settings',
    icon: Shield,
    section: 'Privacy'
  },
  {
    title: 'Notifications',
    description: 'Manage notification preferences',
    icon: Bell,
    section: 'Notifications'
  }
];

const SettingsDropdown = ({ onNavigate }: SettingsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Settings</h3>
          </div>
          
          <div className="p-2">
            {/* Quick Theme Toggle */}
            <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>

            {settingsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate?.(item.section);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;