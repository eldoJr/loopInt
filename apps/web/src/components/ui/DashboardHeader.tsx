import { SidebarOpen, SidebarClose, Sun, Moon } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
import logoImgWhite from '../../assets/img/logo/logo-w.svg';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect, memo, lazy, Suspense } from 'react';

// Lazy load components for better performance
const UserProfileDropdown = lazy(() => import('./UserProfileDropdown'));
const AddDropdown = lazy(() => import('./AddDropdown'));
const NotificationsDropdown = lazy(() => import('./NotificationsDropdown'));
const HelpDropdown = lazy(() => import('./HelpDropdown'));
const SettingsDropdown = lazy(() => import('./SettingsDropdown'));
const SearchBar = lazy(() => import('./SearchBar'));

// Loading fallback component
const ComponentLoader = () => (
  <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
);

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

const DashboardHeader = memo(({
  user,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  onNavigate,
  setSidebarHovered,
  setIsMouseOverButton,
}: DashboardHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [globalSearchData, setGlobalSearchData] = useState<GlobalSearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoized theme toggle handler
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Optimized search data initialization
  useEffect(() => {
    const initSearchData = () => {
      const searchItems: GlobalSearchItem[] = [
        { id: 'nav-dashboard', title: 'Dashboard', type: 'page', section: 'Dashboard' },
        { id: 'nav-projects', title: 'Projects', type: 'page', section: 'Projects' },
        { id: 'nav-tasks', title: 'Tasks', type: 'page', section: 'Tasks' },
        { id: 'nav-team', title: 'Team', type: 'page', section: 'Team' },
        { id: 'nav-calendar', title: 'Calendar', type: 'page', section: 'Calendar' },
        { id: 'nav-analytics', title: 'Analytics', type: 'page', section: 'Analytics' },
        { id: 'project-1', name: 'Website Redesign', description: 'Redesign the company website', type: 'project', section: 'Projects' },
        { id: 'project-2', name: 'Mobile App Development', description: 'Create a new mobile app', type: 'project', section: 'Projects' },
        { id: 'task-1', title: 'Complete documentation', description: 'Finish sprint documentation', type: 'task', section: 'Tasks' },
        { id: 'task-2', title: 'Review pull requests', description: 'Review team PRs', type: 'task', section: 'Tasks' },
      ];
      setGlobalSearchData(searchItems);
    };
    initSearchData();
  }, []);

  const handleGlobalSearch = (query: string) => setSearchQuery(query);
  
  const handleGlobalResultSelect = (result: Record<string, unknown>) => {
    const item = result as unknown as GlobalSearchItem;
    if (item.section) onNavigate?.(item.section);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60 px-2 sm:px-4 py-2 h-14 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-full h-full">
        {/* Left Side */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={() => {
              if (!sidebarOpen && !isMobile) {
                setSidebarHovered?.(true);
                setIsMouseOverButton?.(true);
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                setIsMouseOverButton?.(false);
                if (!sidebarOpen) setSidebarHovered?.(false);
              }
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-tech-orange-600 dark:hover:text-tech-orange-400 hover:bg-tech-orange-50 dark:hover:bg-tech-orange-900/20 rounded-lg transition-colors touch-manipulation"
            title={sidebarOpen ? 'Close Menu' : 'Open Menu'}
          >
            {sidebarOpen ? (
              <SidebarClose className="w-5 h-5" />
            ) : (
              <SidebarOpen className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => onNavigate?.('Dashboard')}
            className="flex items-center hover:opacity-80 transition-opacity touch-manipulation"
          >
            <img
              src={theme === 'dark' ? logoImg : logoImgWhite}
              alt="Loopint"
              className="h-6 w-auto"
              loading="eager"
            />
          </button>
        </div>

        {/* Center - Global Search */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 max-w-2xl min-w-0">
          <div className="w-full max-w-[180px] xs:max-w-xs sm:max-w-md lg:max-w-lg">
            <Suspense fallback={<ComponentLoader />}>
              <SearchBar
                placeholder="Search..."
                value={searchQuery}
                onChange={handleGlobalSearch}
                searchData={globalSearchData as unknown as Record<string, unknown>[]}
                searchKeys={['name', 'title', 'description']}
                onResultSelect={handleGlobalResultSelect}
                showResults={true}
                maxResults={isMobile ? 4 : 6}
                showCommandHint={!isMobile}
              />
            </Suspense>
          </div>
          {!isMobile && (
            <div className="ml-3 hidden md:block">
              <Suspense fallback={<ComponentLoader />}>
                <AddDropdown onNavigate={onNavigate} />
              </Suspense>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {isMobile ? (
            /* Mobile: Essential items only */
            <>
              <Suspense fallback={<ComponentLoader />}>
                <AddDropdown onNavigate={onNavigate} />
              </Suspense>
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-tech-purple-600 dark:hover:text-tech-purple-400 hover:bg-tech-purple-50 dark:hover:bg-tech-purple-900/20 rounded-lg transition-colors touch-manipulation"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Suspense fallback={<ComponentLoader />}>
                <UserProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} />
              </Suspense>
            </>
          ) : (
            /* Desktop: All items */
            <>
              <Suspense fallback={<ComponentLoader />}>
                <NotificationsDropdown />
              </Suspense>
              <Suspense fallback={<ComponentLoader />}>
                <HelpDropdown />
              </Suspense>
              <Suspense fallback={<ComponentLoader />}>
                <SettingsDropdown onNavigate={onNavigate} />
              </Suspense>
              <button
                onClick={handleThemeToggle}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-tech-purple-600 dark:hover:text-tech-purple-400 hover:bg-tech-purple-50 dark:hover:bg-tech-purple-900/20 rounded-lg transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Suspense fallback={<ComponentLoader />}>
                <UserProfileDropdown user={user} onLogout={onLogout} onNavigate={onNavigate} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
