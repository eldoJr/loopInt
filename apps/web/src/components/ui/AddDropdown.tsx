import { useState, useRef, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useModal } from '../../hooks/useModal';

interface AddDropdownProps {
  onNavigate?: (section: string) => void;
}

interface MenuItem {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          label: 'New issue', 
          action: () => openNewIssueModal(),
          category: 'task'
        },
        { 
          label: 'New project', 
          action: () => onNavigate?.('New Project'),
          category: 'project'
        },
        { 
          label: 'Invite user', 
          action: () => onNavigate?.('Invite User'),
          category: 'user'
        }
      ]
    },
    {
      title: 'Business',
      items: [
        { 
          label: 'New company', 
          action: () => onNavigate?.('New Company'),
          category: 'business'
        },
        { 
          label: 'New contact person', 
          action: () => onNavigate?.('New Contact'),
          category: 'business'
        },
        { 
          label: 'New tax invoice', 
          action: () => onNavigate?.('Tax Invoice'),
          category: 'finance'
        },
        { 
          label: 'New bill', 
          action: () => onNavigate?.('New Bill'),
          category: 'finance'
        },
        { 
          label: 'New expense', 
          action: () => onNavigate?.('New Expense'),
          category: 'finance'
        },
        { 
          label: 'New offer', 
          action: () => onNavigate?.('New Offer'),
          category: 'sales'
        },
        { 
          label: 'New product/service', 
          action: () => onNavigate?.('New Product'),
          category: 'product'
        },
        { 
          label: 'New undocumented revenue', 
          action: () => onNavigate?.('Undocumented Revenue'),
          category: 'finance'
        }
      ]
    },
    {
      title: 'Human Resources',
      items: [
        { 
          label: 'New job ad', 
          action: () => onNavigate?.('Job Ad'),
          category: 'hr'
        },
        { 
          label: 'New candidate', 
          action: () => onNavigate?.('New Candidate'),
          category: 'hr'
        },
        { 
          label: 'New coworker', 
          action: () => onNavigate?.('New Coworker'),
          category: 'hr'
        },
        { 
          label: 'New HR project', 
          action: () => onNavigate?.('HR Project'),
          category: 'hr'
        }
      ]
    },
    {
      title: 'Documents',
      items: [
        { 
          label: 'New document', 
          action: () => onNavigate?.('New Document'),
          category: 'document'
        }
      ]
    }
  ];

  // Filter menu items based on search query
  const filteredGroups = searchQuery ? menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0) : menuGroups;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center space-x-1"
        title="Add"
      >
        <Plus className="w-4 h-4" />
        <span className="text-xs font-medium">Create</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Create New</h3>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          {/* Content - without scrollbar */}
          <div>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="p-2">
                  <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1 uppercase tracking-wide flex items-center space-x-1">
                    <span>{group.title}</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1 py-0 rounded-full">
                      {group.items.length}
                    </span>
                  </h4>
                  <div>
                    {group.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className="w-full text-xs py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400">
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