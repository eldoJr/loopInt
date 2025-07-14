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
  ChevronRight,
  Crown,
  MoreHorizontal,
  Download
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowThemeMenu(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadData = () => {
    console.log('Download Data clicked');
    setShowMoreMenu(false);
  };

  
  type MenuItem = {
    icon?: ComponentType<{ className?: string }>;
    label?: string;
    action?: () => void;
    hasSubmenu?: boolean;
    divider?: boolean;
    danger?: boolean;
  };
  
  const menuItems: MenuItem[] = [
      { icon: User, label: 'Profile', action: () => { onNavigate?.('Profile'); setIsOpen(false); } },
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
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/30">
                  <span className="text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 dark:text-white font-bold text-lg truncate">{user?.name || 'User'}</p>
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleDownloadData}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Data</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Last login: 2 hours ago</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">Online</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="my-2 border-t border-gray-200 dark:border-gray-800" />;
              }

              return (
                <div key={`menu-item-${index}`} className="relative px-2">
                  <button
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      }
                      if (!item.hasSubmenu) {
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 text-left rounded-lg group ${
                      item.danger 
                        ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300' 
                        : showThemeMenu && item.hasSubmenu
                        ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.icon && (
                      <div className={`p-1.5 rounded-lg transition-all ${
                        item.danger 
                          ? 'bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50'
                          : showThemeMenu && item.hasSubmenu
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                      }`}>
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                      </div>
                    )}
                    <span className="text-sm font-semibold flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>
                  
                  {/* Theme Submenu */}
                  {item.hasSubmenu && showThemeMenu && (
                    <div className="absolute right-full top-0 mr-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 slide-in-from-right-2 duration-200">
                      <div className="p-3">
                        <div className="mb-3 px-1">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Choose Theme</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize your visual experience</p>
                        </div>
                        <div className="space-y-1">
                          {themeOptions.map((option) => (
                            <button
                              key={option.key}
                              onClick={() => {
                                if (option.key === 'light' || option.key === 'dark') {
                                  setTheme(option.key);
                                }
                              }}
                              className={`w-full px-3 py-3 flex items-center space-x-3 text-left transition-all duration-200 rounded-lg group ${
                                theme === option.key 
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 transition-all ${
                                theme === option.key ? 'bg-blue-500 shadow-sm scale-110' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'
                              }`} />
                              <img src={option.icon} alt={option.label} className="w-8 h-8 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" />
                              <div className="flex-1">
                                <span className="text-sm font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors block">{option.label}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.key === 'light' && 'Bright and clean'}
                                  {option.key === 'dark' && 'Easy on the eyes'}
                                  {option.key === 'system' && 'Follows system preference'}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as <span className="font-medium">{user?.name || 'User'}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                v2.1.0
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;