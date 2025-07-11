import { SidebarOpen, SidebarClose, Search, Sun, Moon } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import logoImgWhite from '../../assets/img/logo/logo-w.svg';
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
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  onNavigate?: (section: string) => void;
  setSidebarHovered?: (hovered: boolean) => void;
  setIsMouseOverButton?: (hovered: boolean) => void;
}



const DashboardHeader = ({ user, sidebarOpen, setSidebarOpen, onLogout, onNavigate, setSidebarHovered, setIsMouseOverButton }: DashboardHeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-2 sm:px-4 py-2 h-14">
      <div className="flex items-center justify-between mx-auto max-w-full">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={() => {
              if (!sidebarOpen) {
                setSidebarHovered?.(true);
                setIsMouseOverButton?.(true);
              }
            }}
            onMouseLeave={() => {
              setIsMouseOverButton?.(false);
              if (!sidebarOpen) {
                setSidebarHovered?.(false);
              }
            }}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-all duration-200 hover:scale-110"
            title={sidebarOpen ? 'Close Menu' : 'Open Menu'}
          >
            {sidebarOpen ? <SidebarClose className="w-5 h-5 sm:w-6 sm:h-6" /> : <SidebarOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
          
          <button 
            onClick={() => onNavigate?.('Dashboard')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={theme === 'dark' ? logoImg : logoImgWhite} alt="Loopint" className="h-5 sm:h-6 w-auto transition-opacity duration-300" />
          </button>
        </div>

        {/* Center - Search */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 max-w-2xl">
          <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="ml-2 sm:ml-3 hidden sm:block">
            <AddDropdown onNavigate={onNavigate} />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Mobile: Show only essential items */}
          <div className="sm:hidden flex items-center space-x-1">
            <AddDropdown onNavigate={onNavigate} />
            <UserProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} />
          </div>
          
          {/* Desktop: Show all items */}
          <div className="hidden sm:flex items-center space-x-2">
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
      </div>
    </header>
  );
};

export default DashboardHeader;