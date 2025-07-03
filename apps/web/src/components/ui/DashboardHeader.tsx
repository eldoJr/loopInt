import { Menu, Search, Bell } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import UserProfileDropdown from './UserProfileDropdown';
import AddDropdown from './AddDropdown';

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
  currentView?: string;
  onNavigate?: (section: string) => void;
}

const navItems = [
  { name: 'Dashboard' },
  { name: 'Projects' },
  { name: 'Tasks' },
  { name: 'Calendar' },
  { name: 'Team' },
  { name: 'Analytics' }
];

const DashboardHeader = ({ user, setActiveTab, setSidebarOpen, onLogout, currentView = 'Dashboard', onNavigate }: DashboardHeaderProps) => {
  const handleNavigation = (section: string) => {
    setActiveTab(section);
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 px-6 py-3">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleNavigation('Dashboard')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src={logoImg} alt="Loopint" className="h-8 w-auto" />
            </button>
            <AddDropdown />
          </div>
          
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="hidden lg:flex items-center space-x-1 bg-gray-800/30 rounded-xl p-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentView === item.name || (item.name === 'Dashboard' && currentView === 'Dashboard')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-48 bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
          
          <button 
            className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
              <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></span>
              <span className="relative block w-3 h-3 bg-red-500 rounded-full"></span>
            </span>
          </button>
          
          <UserProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;