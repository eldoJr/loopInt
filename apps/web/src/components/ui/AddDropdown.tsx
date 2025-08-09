import { useState, useRef, useEffect } from 'react';
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

const AddDropdown = ({ onNavigate }: AddDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { openNewIssueModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Filter menu items based on search query
  const filteredGroups = searchQuery
    ? menuGroups
        .map(group => ({
          ...group,
          items: group.items.filter(
            item =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(group => group.items.length > 0)
    : menuGroups;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center space-x-1.5"
        title="Add"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Create</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Create New
              </h3>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
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
                          className="w-full flex items-center space-x-2 text-xs py-1.5 px-2.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <IconComponent className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDropdown;
