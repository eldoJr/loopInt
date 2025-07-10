import { X, Home, FolderOpen, CheckSquare, Calendar, Users, BarChart3, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Projects', icon: FolderOpen },
  { name: 'Tasks', icon: CheckSquare },
  { name: 'Calendar', icon: Calendar },
  { name: 'Team', icon: Users },
  { name: 'Analytics', icon: BarChart3 },
  { name: 'Reports', icon: FileText }
];

const Sidebar = ({ isOpen, onClose, currentView, onNavigate }: SidebarProps) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.name);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;