import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDown,
  Briefcase,
  Receipt,
  UserCheck,
  Users,
  FileCheck,
  DollarSign,
  ShoppingBag,
  Package,
  Settings
} from 'lucide-react';

interface AllActionsDropdownProps {
  onNavigate?: (section: string) => void;
}

const AllActionsDropdown = ({ onNavigate }: AllActionsDropdownProps = {}) => {
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

  type MenuItem = 
    | { icon: React.ComponentType<{ className?: string }>; label: string; action: () => void; divider?: false }
    | { divider: true };

  const menuItems: MenuItem[] = [
    { icon: Briefcase, label: 'New job ad', action: () => onNavigate?.('Job Ad'), divider: false },
    { icon: Receipt, label: 'New bill', action: () => onNavigate?.('New Bill'), divider: false },
    { icon: UserCheck, label: 'New candidate', action: () => onNavigate?.('New Candidate'), divider: false },
    { icon: Users, label: 'New coworker', action: () => onNavigate?.('New Coworker'), divider: false },
    { icon: FileCheck, label: 'New document', action: () => onNavigate?.('New Document'), divider: false },
    { icon: DollarSign, label: 'New expense', action: () => onNavigate?.('New Expense'), divider: false },
    { icon: ShoppingBag, label: 'New offer', action: () => onNavigate?.('New Offer'), divider: false },
    { icon: Package, label: 'New product/service', action: () => onNavigate?.('New Product'), divider: false },
    { icon: Briefcase, label: 'New HR project', action: () => onNavigate?.('HR Project'), divider: false },
    { icon: DollarSign, label: 'New undocumented revenue', action: () => onNavigate?.('Undocumented Revenue'), divider: false },
    { divider: true },
    { icon: Settings, label: 'Buttons configuration', action: () => onNavigate?.('Buttons Configuration'), divider: false }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-gray-600/40 shadow-sm hover:shadow-md transition-all duration-200 text-sm backdrop-blur-sm"
      >
        <span>All Actions</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <motion.div
          ref={portalRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed right-32 top-36 w-auto bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-2xl z-[9999]"
        >
          <div className="p-3 grid grid-cols-2 gap-1">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div key={index} className="col-span-2 my-2 border-t border-gray-800/50" />
                );
              }

              return (
                <button
                  key={index}
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
                    setTimeout(() => setIsOpen(false), 10);
                  }}
                  className="px-3 py-3 flex items-center space-x-2 hover:bg-gray-800/50 transition-colors text-left rounded-lg text-gray-300 hover:text-white"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  <span className="text-base truncate">{item.label}</span>
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

export default AllActionsDropdown;