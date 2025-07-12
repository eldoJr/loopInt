import { useState, useRef, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  User, 
  Settings, 
  Palette, 
  Users, 
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import lightModeIcon from '../../assets/icons/light-mode.9ae6186d.svg';
import darkModeIcon from '../../assets/icons/dark-mode.fd95cecc.svg';
import matchBrowserIcon from '../../assets/icons/match-browser.defc82cb.svg';

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
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  type MenuItem = {
    icon?: ComponentType<{ className?: string }>;
    label?: string;
    action?: () => void;
    hasSubmenu?: boolean;
    divider?: boolean;
    danger?: boolean;
  };
  
  const menuItems: MenuItem[] = [
      { icon: User, label: 'Profile', action: () => onNavigate?.('Profile') },
      { icon: Settings, label: 'Account settings', action: () => onNavigate?.('Account Settings') },
      { icon: Palette, label: 'Theme', action: () => setShowThemeMenu(!showThemeMenu), hasSubmenu: true },
      { icon: Users, label: 'Switch account', action: () => onNavigate?.('Switch Account') },
      { divider: true },
      { icon: LogOut, label: 'Log out', action: onLogout, danger: true }
    ];

  const themeOptions = [
    { key: 'light', label: 'Light', icon: lightModeIcon },
    { key: 'dark', label: 'Dark', icon: darkModeIcon },
    { key: 'system', label: 'Match Browser', icon: matchBrowserIcon }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-medium">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-blue-50 dark:ring-blue-900/20">
                <span className="text-white font-bold text-base">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-semibold text-base truncate">{user?.name || 'User'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="my-1 border-t border-gray-100 dark:border-gray-800" />;
              }

              return (
                <div key={`menu-item-${index}`} className="relative px-1">
                  <button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      }
                      if (!item.hasSubmenu) {
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full px-4 py-2.5 flex items-center space-x-3 transition-all duration-200 text-left rounded-lg group ${
                      item.danger 
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300' 
                        : showThemeMenu && item.hasSubmenu
                        ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />}
                    <span className="text-base font-medium flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>
                  
                  {/* Theme Submenu */}
                  {item.hasSubmenu && showThemeMenu && (
                    <div className="absolute right-full top-0 mr-2 w-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 slide-in-from-right-2 duration-200">
                      <div className="p-2">
                        <div className="mb-2 px-2">
                          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Choose Theme</h4>
                        </div>
                        {themeOptions.map((option) => (
                          <button
                            key={option.key}
                            onClick={() => {
                              if (option.key === 'light' || option.key === 'dark') {
                                setTheme(option.key);
                              }
                            }}
                            className="w-full px-3 py-2.5 flex items-center space-x-3 text-left transition-all duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 group"
                          >
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                              theme === option.key ? 'bg-blue-500 shadow-sm scale-110' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                            }`} />
                            <img src={option.icon} alt={option.label} className="w-7 h-7 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" />
                            <span className="text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors whitespace-nowrap">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;