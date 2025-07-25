import { useState, useRef, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Settings, Globe, Bell, Wrench, Package, FolderOpen, Workflow, Puzzle, Users, CreditCard, ExternalLink, Search, MoreHorizontal, Bookmark } from 'lucide-react';

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
        description: 'Manage access, settings and integrations for LoopInt products',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allItems = settingsGroups.flatMap(group => group.items);
  const filteredGroups = settingsGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const handleExportSettings = () => {
    console.log('Export Settings clicked');
    setShowMoreMenu(false);
  };

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
        <div className="absolute top-full right-0 mt-2 w-[24rem] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-2.5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Settings</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Admin Access</span>
                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        onClick={handleExportSettings}
                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>Export Settings</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-hidden">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-2.5">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-wide flex items-center space-x-1.5">
                    <span>{group.title}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0 rounded-full">
                      {group.items.length}
                    </span>
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
                          className="w-full flex items-start space-x-2 p-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group"
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0 text-blue-500 group-hover:text-blue-600 transition-colors" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </p>
                              <div className="flex items-center space-x-1">
                                {item.external && (
                                  <ExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight truncate">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {groupIndex < filteredGroups.length - 1 && (
                    <div className="mt-1 border-b border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-2">
                <Search className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No settings found for "{searchQuery}"</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-2.5 py-1.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">{allItems.length} settings</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Esc to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;