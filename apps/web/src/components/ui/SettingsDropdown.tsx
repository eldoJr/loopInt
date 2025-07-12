import { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Settings, Globe, Bell, Wrench, Package, FolderOpen, Workflow, Puzzle, Users, CreditCard, ExternalLink } from 'lucide-react';

interface SettingsDropdownProps {
  onNavigate?: (section: string) => void;
}

interface SettingsItem {
  title: string;
  description: string;
  icon: LucideIcon;
  section: string;
  external?: boolean;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

const settingsGroups: SettingsGroup[] = [
  {
    title: 'Personal Settings',
    items: [
      {
        title: 'General settings',
        description: 'Manage language, timezone and other personal preferences',
        icon: Globe,
        section: 'General'
      },
      {
        title: 'Notification settings',
        description: 'Manage email and in-product notifications',
        icon: Bell,
        section: 'Notifications'
      }
    ]
  },
  {
    title: 'Loopint admin settings',
    items: [
      {
        title: 'System',
        description: 'Manage general configuration, security, automation, user interface and more',
        icon: Wrench,
        section: 'System'
      },
      {
        title: 'Products',
        description: 'Manage access, settings and integrations for Jira products',
        icon: Package,
        section: 'Products'
      },
      {
        title: 'Projects',
        description: 'Manage project settings, categories and more',
        icon: FolderOpen,
        section: 'Projects'
      },
      {
        title: 'Work items',
        description: 'Configure work types, workflows, screens, fields and more',
        icon: Workflow,
        section: 'WorkItems'
      },
      {
        title: 'Apps',
        description: 'Add and manage Loopint and Marketplace apps and integrations',
        icon: Puzzle,
        section: 'Apps'
      }
    ]
  },
  {
    title: 'Admin settings',
    items: [
      {
        title: 'User management',
        description: 'Manage users, groups and access requests',
        icon: Users,
        section: 'UserManagement',
        external: true
      },
      {
        title: 'Billing',
        description: 'Update billing details, manage subscriptions and more',
        icon: CreditCard,
        section: 'Billing',
        external: true
      }
    ]
  }
];

const SettingsDropdown = ({ onNavigate }: SettingsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Manage your preferences and configurations</p>
          </div>
          
          <div>
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="p-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item, itemIndex) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={itemIndex}
                        onClick={() => {
                          onNavigate?.(item.section);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-start space-x-2.5 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </p>
                            {item.external && (
                              <ExternalLink className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {groupIndex < settingsGroups.length - 1 && (
                  <div className="mt-2 border-b border-gray-200 dark:border-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;