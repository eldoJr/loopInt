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

const AddDropdown = () => {
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
    { icon: UserPlus, label: 'Invite user', action: () => console.log('Invite user') },
    { icon: FileText, label: 'New tax invoice', action: () => console.log('New tax invoice') },
    { icon: AlertCircle, label: 'New issue', action: () => console.log('New issue') },
    { icon: Building, label: 'New company', action: () => console.log('New company') },
    { icon: User, label: 'New contact person', action: () => console.log('New contact person') },
    { icon: FolderOpen, label: 'New project', action: () => console.log('New project') },
    { icon: Briefcase, label: 'New job ad', action: () => console.log('New job ad') },
    { icon: Receipt, label: 'New bill', action: () => console.log('New bill') },
    { icon: UserCheck, label: 'New candidate', action: () => console.log('New candidate') },
    { icon: Users, label: 'New coworker', action: () => console.log('New coworker') },
    { icon: FileCheck, label: 'New document', action: () => console.log('New document') },
    { icon: DollarSign, label: 'New expense', action: () => console.log('New expense') },
    { icon: ShoppingBag, label: 'New offer', action: () => console.log('New offer') },
    { icon: Package, label: 'New product/service', action: () => console.log('New product/service') },
    { icon: Briefcase, label: 'New HR project', action: () => console.log('New HR project') },
    { icon: TrendingUp, label: 'New undocumented revenue', action: () => console.log('New undocumented revenue') }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>

      {isOpen && createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed left-32 top-20 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-2xl z-[9999] max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 flex items-center space-x-3 hover:bg-gray-800/50 transition-colors text-left rounded-lg text-gray-300 hover:text-white"
              >
                <item.icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span className="text-sm">{item.label}</span>
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