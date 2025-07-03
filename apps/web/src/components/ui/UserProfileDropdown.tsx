import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
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
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        portalRef.current && !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  
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
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <motion.div
          ref={portalRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed right-6 top-20 w-auto bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-2xl z-[9999]"
        >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name || 'User'}</p>
                  <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                if (item.divider) {
                  return <div key={`divider-${index}`} className="my-2 border-t border-gray-800/50" />;
                }

                return (
                  <button
                    key={`menu-item-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.action) {
                        item.action();
                      }
                      // Small delay to ensure action executes before closing
                      setTimeout(() => setIsOpen(false), 10);
                    }}
                    className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-800/50 transition-colors text-left ${
                      item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                    <span className="text-sm">{item.label}</span>
                    {item.hasFlag && (
                      <div className="ml-auto w-4 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs">🇺🇸</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
};

export default UserProfileDropdown;