import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  UserPlus,
  FileText,
  AlertCircle,
  Building,
  User,
  FolderOpen,
  Briefcase,
  Receipt,
  Users,
  FileCheck,
  DollarSign,
  ShoppingBag,
  Package,
  UserCheck,
  TrendingUp
} from 'lucide-react';

interface AddDropdownProps {
  onNavigate?: (section: string) => void;
}

const AddDropdown = ({ onNavigate }: AddDropdownProps = {}) => {
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

  const menuItems = [
    { icon: UserPlus, label: 'Invite user', action: () => onNavigate?.('Invite User') },
    { icon: FileText, label: 'New tax invoice', action: () => onNavigate?.('Tax Invoice') },
    { icon: AlertCircle, label: 'New issue', action: () => onNavigate?.('New Issue') },
    { icon: Building, label: 'New company', action: () => onNavigate?.('New Company') },
    { icon: User, label: 'New contact person', action: () => onNavigate?.('New Contact') },
    { icon: FolderOpen, label: 'New project', action: () => onNavigate?.('New Project') },
    { icon: Briefcase, label: 'New job ad', action: () => onNavigate?.('Job Ad') },
    { icon: Receipt, label: 'New bill', action: () => onNavigate?.('New Bill') },
    { icon: UserCheck, label: 'New candidate', action: () => onNavigate?.('New Candidate') },
    { icon: Users, label: 'New coworker', action: () => onNavigate?.('New Coworker') },
    { icon: FileCheck, label: 'New document', action: () => onNavigate?.('New Document') },
    { icon: DollarSign, label: 'New expense', action: () => onNavigate?.('New Expense') },
    { icon: ShoppingBag, label: 'New offer', action: () => onNavigate?.('New Offer') },
    { icon: Package, label: 'New product/service', action: () => onNavigate?.('New Product') },
    { icon: Briefcase, label: 'New HR project', action: () => onNavigate?.('HR Project') },
    { icon: TrendingUp, label: 'New undocumented revenue', action: () => onNavigate?.('Undocumented Revenue') }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        title="Add"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
        >
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Create New</h3>
            <div className="grid grid-cols-2 gap-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="px-2 py-2 flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AddDropdown;