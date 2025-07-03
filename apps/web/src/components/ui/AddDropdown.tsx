import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
        className="flex items-center space-x-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <motion.div
          ref={portalRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed left-32 top-20 w-auto bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-2xl z-[9999]"
        >
          <div className="p-3 grid grid-cols-2 gap-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.action();
                  setTimeout(() => setIsOpen(false), 10);
                }}
                className="px-2 py-2 flex items-center space-x-2 hover:bg-gray-800/50 transition-colors text-left rounded-lg text-gray-300 hover:text-white"
              >
                <item.icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span className="text-base truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
};

export default AddDropdown;