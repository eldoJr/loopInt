import { SidebarOpen, SidebarClose, Sun, Moon } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import logoImgWhite from '../../assets/img/logo/logo-w.svg';
import UserProfileDropdown from './UserProfileDropdown';
import AddDropdown from './AddDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import HelpDropdown from './HelpDropdown';
import SettingsDropdown from './SettingsDropdown';
import SearchBar from './SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';

interface User {
  name?: string;
  // Add other user properties here as needed
}

interface GlobalSearchItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  type: 'project' | 'task' | 'team' | 'page';
  section?: string;
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
  const [globalSearchData, setGlobalSearchData] = useState<GlobalSearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch global search data
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        const currentUser = userData ? JSON.parse(userData) : null;
        
        if (!currentUser) return;

        // Fetch projects and tasks for global search
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:3000/projects').catch(() => ({ ok: false })),
          fetch('http://localhost:3000/tasks').catch(() => ({ ok: false }))
        ]);

        const searchItems: GlobalSearchItem[] = [];

        // Add navigation pages
        searchItems.push(
          { id: 'nav-dashboard', title: 'Dashboard', type: 'page', section: 'Dashboard' },
          { id: 'nav-projects', title: 'Projects', type: 'page', section: 'Projects' },
          { id: 'nav-tasks', title: 'Tasks', type: 'page', section: 'Tasks' },
          { id: 'nav-team', title: 'Team', type: 'page', section: 'Team' },
          { id: 'nav-calendar', title: 'Calendar', type: 'page', section: 'Calendar' },
          { id: 'nav-analytics', title: 'Analytics', type: 'page', section: 'Analytics' }
        );

        // Add projects
        if (projectsRes.ok && 'json' in projectsRes) {
          const projects = await projectsRes.json() as Array<{ id: string; name: string; description?: string; created_by: string }>;
          const userProjects = projects.filter(p => p.created_by === currentUser.id);
          userProjects.forEach(project => {
            searchItems.push({
              id: `project-${project.id}`,
              name: project.name,
              description: project.description,
              type: 'project',
              section: 'Projects'
            });
          });
        }

        // Add tasks
        if (tasksRes.ok && 'json' in tasksRes) {
          const tasks = await tasksRes.json() as Array<{ id: string; title: string; description?: string; assigned_to: string }>;
          const userTasks = tasks.filter(t => t.assigned_to === currentUser.id);
          userTasks.forEach(task => {
            searchItems.push({
              id: `task-${task.id}`,
              title: task.title,
              description: task.description,
              type: 'task',
              section: 'Tasks'
            });
          });
        }

        setGlobalSearchData(searchItems);
      } catch (error) {
        console.error('Error fetching global search data:', error);
      }
    };

    fetchGlobalData();
  }, []);

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGlobalResultSelect = (result: Record<string, unknown>) => {
    const item = result as unknown as GlobalSearchItem;
    if (item.section) {
      onNavigate?.(item.section);
    }
    setSearchQuery('');
  };

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

        {/* Center - Global Search */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 max-w-2xl">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <SearchBar
              placeholder="Search projects, tasks, or navigate..."
              value={searchQuery}
              onChange={handleGlobalSearch}
              searchData={globalSearchData as unknown as Record<string, unknown>[]}
              searchKeys={['name', 'title', 'description']}
              onResultSelect={handleGlobalResultSelect}
              showResults={true}
              maxResults={8}
              showCommandHint={true}
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