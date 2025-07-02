import { Menu, Search, Bell } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import UserProfileDropdown from './UserProfileDropdown';

interface User {
  name?: string;
  // Add other user properties here as needed
}

interface DashboardHeaderProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const navItems = [
  { name: 'Dashboard' },
  { name: 'Projects' },
  { name: 'Tasks' },
  { name: 'Calendar' },
  { name: 'Team' },
  { name: 'Analytics' }
];

const DashboardHeader = ({ user, activeTab, setActiveTab, setSidebarOpen, onLogout }: DashboardHeaderProps) => {
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

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => console.log('Search')}
            className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => console.log('Notifications')}
            className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>
          <UserProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;