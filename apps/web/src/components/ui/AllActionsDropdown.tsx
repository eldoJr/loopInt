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

const AllActionsDropdown = () => {
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

  type MenuItem = 
    | { icon: React.ComponentType<{ className?: string }>; label: string; action: () => void; divider?: false }
    | { divider: true };

  const menuItems: MenuItem[] = [
    { icon: Briefcase, label: 'New job ad', action: () => console.log('New job ad'), divider: false },
    { icon: Receipt, label: 'New bill', action: () => console.log('New bill'), divider: false },
    { icon: UserCheck, label: 'New candidate', action: () => console.log('New candidate'), divider: false },
    { icon: Users, label: 'New coworker', action: () => console.log('New coworker'), divider: false },
    { icon: FileCheck, label: 'New document', action: () => console.log('New document'), divider: false },
    { icon: DollarSign, label: 'New expense', action: () => console.log('New expense'), divider: false },
    { icon: ShoppingBag, label: 'New offer', action: () => console.log('New offer'), divider: false },
    { icon: Package, label: 'New product/service', action: () => console.log('New product/service'), divider: false },
    { icon: Briefcase, label: 'New HR project', action: () => console.log('New HR project'), divider: false },
    { icon: DollarSign, label: 'New undocumented revenue', action: () => console.log('New undocumented revenue'), divider: false },
    { divider: true },
    { icon: Settings, label: 'Buttons configuration', action: () => console.log('Buttons configuration'), divider: false }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm border border-blue-500/30"
      >
        <span>All Actions</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <motion.div
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
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    }
                    setIsOpen(false);
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