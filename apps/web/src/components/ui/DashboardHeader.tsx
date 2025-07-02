import { Menu, Search, Bell } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';

interface User {
  name?: string;
  // Add other user properties here as needed
}

interface DashboardHeaderProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { name: 'Dashboard' },
  { name: 'Projects' },
  { name: 'Tasks' },
  { name: 'Calendar' },
  { name: 'Team' },
  { name: 'Analytics' }
];

const DashboardHeader = ({ user, activeTab, setActiveTab, setSidebarOpen }: DashboardHeaderProps) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src={logoImg} alt="Loopint" className="h-8 w-auto" />
          </div>
          
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.name 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;