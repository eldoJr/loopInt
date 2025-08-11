import { useState, useRef, useEffect, memo, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Plus,
  Search,
  AlertCircle,
  FolderOpen,
  UserPlus,
  Building,
  User,
  FileText,
  Receipt,
  DollarSign,
  ShoppingBag,
  Package,
  Briefcase,
  UserCheck,
  Users,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { useModal } from '../../hooks/useModal';

interface AddDropdownProps {
  onNavigate?: (section: string) => void;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  action: () => void;
  category: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const AddDropdown = memo(({ onNavigate }: AddDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const { openNewIssueModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const menuGroups: MenuGroup[] = [
    {
      title: 'Quick Actions',
      items: [
        {
          icon: AlertCircle,
          label: 'New issue',
          action: () => openNewIssueModal(),
          category: 'task',
        },
        {
          icon: FolderOpen,
          label: 'New project',
          action: () => onNavigate?.('New Project'),
          category: 'project',
        },
        {
          icon: UserPlus,
          label: 'Invite user',
          action: () => onNavigate?.('Invite User'),
          category: 'user',
        },
      ],
    },
    {
      title: 'Business',
      items: [
        {
          icon: Building,
          label: 'New company',
          action: () => onNavigate?.('New Company'),
          category: 'business',
        },
        {
          icon: User,
          label: 'New contact person',
          action: () => onNavigate?.('New Contact'),
          category: 'business',
        },
        {
          icon: FileText,
          label: 'New tax invoice',
          action: () => onNavigate?.('Tax Invoice'),
          category: 'finance',
        },
        {
          icon: Receipt,
          label: 'New bill',
          action: () => onNavigate?.('New Bill'),
          category: 'finance',
        },
        {
          icon: DollarSign,
          label: 'New expense',
          action: () => onNavigate?.('New Expense'),
          category: 'finance',
        },
        {
          icon: ShoppingBag,
          label: 'New offer',
          action: () => onNavigate?.('New Offer'),
          category: 'sales',
        },
        {
          icon: Package,
          label: 'New product/service',
          action: () => onNavigate?.('New Product'),
          category: 'product',
        },
        {
          icon: TrendingUp,
          label: 'New undocumented revenue',
          action: () => onNavigate?.('Undocumented Revenue'),
          category: 'finance',
        },
      ],
    },
    {
      title: 'Human Resources',
      items: [
        {
          icon: Briefcase,
          label: 'New job ad',
          action: () => onNavigate?.('Job Ad'),
          category: 'hr',
        },
        {
          icon: UserCheck,
          label: 'New candidate',
          action: () => onNavigate?.('New Candidate'),
          category: 'hr',
        },
        {
          icon: Users,
          label: 'New coworker',
          action: () => onNavigate?.('New Coworker'),
          category: 'hr',
        },
        {
          icon: Briefcase,
          label: 'New HR project',
          action: () => onNavigate?.('HR Project'),
          category: 'hr',
        },
      ],
    },
    {
      title: 'Documents',
      items: [
        {
          icon: FileCheck,
          label: 'New document',
          action: () => onNavigate?.('New Document'),
          category: 'document',
        },
      ],
    },
  ];

  // Memoized filtered groups for better performance
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return menuGroups;
    
    return menuGroups
      .map(group => ({
        ...group,
        items: group.items.filter(
          item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-tech-orange-500 hover:bg-tech-orange-600 text-white rounded-lg flex items-center space-x-1.5 transition-colors touch-manipulation"
        title="Create"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium hidden xs:inline">Create</span>
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-1.5 ${isMobile ? 'w-[calc(100vw-1rem)] max-w-sm' : 'w-80'} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200`}>
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Create New
              </h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-orange-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Content - without scrollbar */}
          <div>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-2.5">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5 uppercase tracking-wide flex items-center space-x-1.5">
                    <span>{group.title}</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
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
                            item.action();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left group text-gray-700 dark:text-gray-300 hover:text-tech-orange-600 dark:hover:text-tech-orange-400 transition-colors touch-manipulation"
                        >
                          <IconComponent className="w-4 h-4 flex-shrink-0 text-tech-orange-500" />
                          <span className="font-medium truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AddDropdown.displayName = 'AddDropdown';

export default AddDropdown;
