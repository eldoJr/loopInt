import { Menu, Search, Sun, Moon } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import UserProfileDropdown from './UserProfileDropdown';
import AddDropdown from './AddDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import HelpDropdown from './HelpDropdown';
import SettingsDropdown from './SettingsDropdown';
import { useTheme } from '../../context/ThemeContext';

interface User {
  name?: string;
  // Add other user properties here as needed
}

interface DashboardHeaderProps {
  user: User;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
}



const DashboardHeader = ({ user, setSidebarOpen, onLogout, onNavigate }: DashboardHeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-2">
      <div className="flex items-center justify-between mx-auto">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
            title="Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onNavigate?.('Dashboard')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={logoImg} alt="Loopint" className="h-6 w-auto" />
          </button>
        </div>

        {/* Center */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search"
              className="w-80 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <AddDropdown onNavigate={onNavigate} />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <NotificationsDropdown />
          
          <HelpDropdown />
          
          <SettingsDropdown onNavigate={onNavigate} />
          
          <button
            onClick={toggleTheme}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-all duration-200"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <UserProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;