import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from '../hooks/useNavigate';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import ModalProvider from '../context/ModalContext';
import { PageTransition } from '../components/animations/PageTransition';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Clock,
  FolderOpen,
  Calendar,
  CheckCircle,
  Settings,
  Heart,
  MapPin,
  Star,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import foldersIcon from '../assets/icons/folders.png';
import taskManagementIcon from '../assets/icons/task-management.png';
import teamBuildingIcon from '../assets/icons/team-building.png';
import increaseIcon from '../assets/icons/increase.png';
import Breadcrumb from '../components/ui/Breadcrumb';
import DashboardHeader from '../components/ui/DashboardHeader';
import DashboardCard from '../components/ui/DashboardCard';
import DashboardStatCard from '../components/ui/DashboardStatCard';
import AllActionsDropdown from '../components/ui/AllActionsDropdown';
import CustomizationAlert from '../components/ui/CustomizationAlert';
import Sidebar from '../components/ui/Sidebar';
import { DashboardRoutes } from '../features/dashboard/DashboardRoutes';
import NewIssueModal from '../features/calendar/components/NewIssueModal';
import { useModal } from '../hooks/useModal';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorFallback } from '../components/error/ErrorFallback';

// Component to render modals
const DashboardModals = () => {
  const { showNewIssueModal, closeNewIssueModal } = useModal();

  return (
    <>
      {showNewIssueModal && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <NewIssueModal
            isOpen={showNewIssueModal}
            onClose={closeNewIssueModal}
          />
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  useTheme();
  const navigate = useNavigate();
  const { user, logout, login } = useAuthStore();
  const { projects, setProjects } = useProjectStore();
  const { tasks, setTasks, toggleTask } = useTaskStore();
  const { handleAsyncError } = useErrorHandler();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMouseOverButton, setIsMouseOverButton] = useState(false);
  const [showFinishedTodos, setShowFinishedTodos] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCustomizationAlert, setShowCustomizationAlert] = useState(false);

  interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    color: string;
    created_by: string;
  }



  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);

  const fetchTasks = async () => {
    const result = await handleAsyncError(
      async () => {
        // Mock data for static mode
        const mockTasks = [
          {
            id: '1',
            title: 'Complete project documentation',
            description: 'Finish all documentation for the current sprint',
            status: 'todo',
            priority: 'high',
            due_date: new Date().toISOString(),
            assigned_to: '1',
          },
          {
            id: '2',
            title: 'Review pull requests',
            description: 'Review team PRs for the new feature',
            status: 'done',
            priority: 'medium',
            due_date: new Date().toISOString(),
            assigned_to: '1',
          },
          {
            id: '3',
            title: 'Prepare for demo',
            description: 'Create slides for the client demo',
            status: 'todo',
            priority: 'high',
            due_date: new Date().toISOString(),
            assigned_to: '1',
          },
        ];

        // Filter tasks for current user
        const userTasks = user
          ? mockTasks.filter((task: any) => task.assigned_to === user.id)
          : mockTasks;

        const formattedTasks = userTasks.map((task: any) => ({
          ...task,
          status: task.status as 'todo' | 'in_progress' | 'done',
          priority: task.priority as 'low' | 'medium' | 'high',
          completed: task.status === 'done',
        }));
        setTasks(formattedTasks);
        return formattedTasks;
      },
      { fallbackMessage: 'Failed to load tasks' }
    );

    if (!result) {
      setError(new Error('Failed to load tasks'));
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');

    if (userParam) {
      try {
        const oauthUser = JSON.parse(decodeURIComponent(userParam));
        login(oauthUser);
        localStorage.setItem('user', JSON.stringify(oauthUser));
        window.history.replaceState({}, document.title, '/dashboard');
        return;
      } catch (error) {
        console.error('Error parsing OAuth user data:', error);
      }
    }

    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      login(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate.replace('/');
  };

  const navigateToSection = useCallback((section: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(section);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleToggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      try {
        toggleTask(id);
        showToast.success(
          !task.completed ? 'Task completed!' : 'Task reopened'
        );
      } catch (error) {
        console.error('Error updating task:', error);
        showToast.error('Failed to update task');
      }
    },
    [tasks, toggleTask]
  );

  const fetchProjects = async () => {
    const result = await handleAsyncError(
      async () => {
        // Mock data for static mode
        const mockProjects = [
          {
            id: '1',
            name: 'Website Redesign',
            description: 'Redesign the company website with new branding',
            status: 'active' as const,
            priority: 'high' as const,
            progress: 75,
            color: '#4F46E5',
            is_favorite: false,
            created_by: '1',
          },
          {
            id: '2',
            name: 'Mobile App Development',
            description: 'Create a new mobile app for customers',
            status: 'planning' as const,
            priority: 'medium' as const,
            progress: 25,
            color: '#10B981',
            is_favorite: true,
            created_by: '1',
          },
          {
            id: '3',
            name: 'Marketing Campaign',
            description: 'Q3 marketing campaign for new product launch',
            status: 'on-hold' as const,
            priority: 'low' as const,
            progress: 50,
            color: '#F59E0B',
            is_favorite: false,
            created_by: '1',
          },
        ];

        // Filter projects for current user
        const userProjects = user
          ? mockProjects.filter(
              (project: Project) => project.created_by === user.id
            )
          : [];

        // Only show active projects (not completed or cancelled)
        const activeProjects = userProjects.filter((project: Project) =>
          ['planning', 'active', 'on-hold'].includes(project.status)
        );

        setProjects(activeProjects);
        setActiveProjectsCount(activeProjects.length);
        return activeProjects;
      },
      { fallbackMessage: 'Failed to load projects' }
    );

    if (!result) {
      setError(new Error('Failed to load projects'));
    }
  };

  interface TeamMemberType {
    id: string;
    name: string;
    created_by?: string;
    createdBy?: string;
    // Add other fields as needed
  }

  const fetchTeamMembers = async () => {
    try {
      // Mock data for static mode
      const mockMembers: TeamMemberType[] = [
        {
          id: '1',
          name: 'John Doe',
          created_by: '1',
        },
        {
          id: '2',
          name: 'Jane Smith',
          created_by: '1',
        },
        {
          id: '3',
          name: 'Alex Johnson',
          created_by: '1',
        },
      ];

      // Filter team members for current user
      const userMembers = user
        ? mockMembers.filter(
            (member: TeamMemberType) =>
              member.created_by === user.id || member.createdBy === user.id
          )
        : mockMembers;

      setTeamMembersCount(userMembers.length);
    } catch (error) {
      console.error('Error with team members:', error);
    }
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: 'LoopInt' },
      { label: 'Dash', onClick: () => navigateToSection('Dashboard') },
    ],
    [navigateToSection]
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      setError(null);
      if (user) {
        await Promise.all([fetchProjects(), fetchTeamMembers(), fetchTasks()]);
      }
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, [user, currentView]);

  const renderDashboardContent = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <p className="dashboard-text-secondary text-sm font-medium">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2">
              <AllActionsDropdown onNavigate={navigateToSection} />
              <button
                onClick={() => setShowCustomizationAlert(true)}
                className="dashboard-button-secondary p-2.5"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mb-6 max-w-full overflow-x-auto">
        <DashboardStatCard
          title="Active Projects"
          value={activeProjectsCount}
          iconSrc={foldersIcon}
          iconAlt="Projects"
          onClick={() => navigateToSection('Projects')}
          trend={{ value: 12, direction: 'up', period: 'vs last month' }}
          subtitle="In progress"
          loading={loading || !user}
        />
        <DashboardStatCard
          title="Completed Tasks"
          value={tasks.filter(t => t.completed).length}
          iconSrc={taskManagementIcon}
          iconAlt="Tasks"
          onClick={() => navigateToSection('Tasks')}
          trend={{ value: 8, direction: 'up', period: 'vs last week' }}
          subtitle="This month"
          loading={loading || !user}
        />
        <DashboardStatCard
          title="Team Members"
          value={teamMembersCount}
          iconSrc={teamBuildingIcon}
          iconAlt="Team"
          onClick={() => navigateToSection('Team')}
          trend={{ value: 2, direction: 'up', period: 'new this month' }}
          subtitle="Active members"
          loading={!user}
        />
        <DashboardStatCard
          title="Job Ads"
          value="3"
          icon={Briefcase}
          iconAlt="Job Ads"
          onClick={() => navigateToSection('HR Project')}
          trend={{ value: 1, direction: 'up', period: 'new this week' }}
          subtitle="Active ads"
          loading={!user}
        />
        <DashboardStatCard
          title="Revenue"
          value="$24K"
          iconSrc={increaseIcon}
          iconAlt="Revenue"
          onClick={() => navigateToSection('Analytics')}
          trend={{ value: 15, direction: 'up', period: 'vs last month' }}
          subtitle="This month"
          loading={!user}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Column */}
        <div className="space-y-3">
          {/* My Tasks */}
          <DashboardCard
            title="My Tasks"
            icon={CheckCircle}
            onAdd={() => navigateToSection('Add Task')}
            headerActions={
              <label className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFinishedTodos}
                  onChange={e => setShowFinishedTodos(e.target.checked)}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span>Show completed</span>
              </label>
            }
          >
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks
                  .filter(task => showFinishedTodos || !task.completed)
                  .slice(0, 2)
                  .map(task => (
                    <div
                      key={task.id}
                      className="p-3 bg-white/70 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/40 rounded-lg hover:bg-white dark:hover:bg-gray-800/80 hover:border-tech-orange-200/60 dark:hover:border-tech-orange-700/40 cursor-pointer backdrop-blur-sm"
                      onClick={() => navigateToSection('Tasks')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleTask(task.id);
                            }}
                            className={`w-4 h-4 rounded border-2 ${
                              task.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400'
                            }`}
                          >
                            {task.completed && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <div>
                            <p
                              className={`text-xs font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
                            >
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {task.due_date
                                ? new Date(task.due_date).toLocaleDateString()
                                : new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {task.priority === 'high' && (
                          <Star className="w-3 h-3 text-tech-purple-500 fill-current" />
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                Here you will see a list of all tasks assigned to you. Click
                on a task to view details or mark as complete.
              </div>
            )}
          </DashboardCard>

          {/* Issues */}
          <DashboardCard title="Issues" icon={AlertTriangle}>
            {false ? (
              <div className="space-y-2">
                {/* Issues content would go here */}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                No data to display
              </div>
            )}
          </DashboardCard>

          {/* Favorite Contacts */}
          <DashboardCard title="Favorite Contacts" icon={Heart}>
            {false ? (
              <div className="space-y-2">
                {/* Favorite contacts content would go here */}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                A list of all your favorite coworkers will appear here. Mark a
                particular coworker as a favorite if you want it to appear in
                this section.
              </div>
            )}
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard title="Recent Activity" icon={Clock}>
            {false ? (
              <div className="space-y-2">
                {/* Recent activity content would go here */}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                Here you will see a list of all recent activities in your
                projects and tasks. Click on an activity to view details.
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Active Projects */}
          <DashboardCard
            title="Active Projects"
            icon={FolderOpen}
            onAdd={() => navigateToSection('New Project')}
          >
            {projects.length > 0 ? (
              <div className="space-y-2">
                {projects.slice(0, 2).map(project => (
                  <div
                    key={project.id}
                    className="p-3 bg-white/70 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/40 rounded-lg hover:bg-white dark:hover:bg-gray-800/80 hover:border-tech-orange-200/60 dark:hover:border-tech-orange-700/40 cursor-pointer backdrop-blur-sm"
                    onClick={() => navigateToSection('Projects')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full`}
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {project.name}
                          </p>
                          {project.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active'
                            ? 'bg-tech-orange-100 dark:bg-tech-orange-900/30 text-tech-orange-800 dark:text-tech-orange-300'
                            : project.status === 'planning'
                              ? 'bg-tech-purple-100 dark:bg-tech-purple-900/30 text-tech-purple-800 dark:text-tech-purple-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                Here you will see a list of all active projects that you are
                managing or participating in. Click on a project to view
                details.
              </div>
            )}
          </DashboardCard>

          {/* My Check-ins */}
          <DashboardCard
            title="My Check-ins"
            icon={MapPin}
            onAdd={() => console.log('New check-in')}
          >
            {false ? (
              <div className="space-y-2">
                {/* Check-ins content would go here */}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                Here you will see a list of all active check-ins that you are
                the author of or need to reply to. Click on the name of the
                check-in to do so.
              </div>
            )}
          </DashboardCard>

          {/* Upcoming Events */}
          <DashboardCard
            title="Upcoming Events"
            icon={Calendar}
            onAdd={() => navigateToSection('Calendar')}
          >
            {false ? (
              <div className="space-y-2">
                {/* Events content would go here */}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-tech-orange-50/90 to-tech-orange-100/70 dark:from-tech-orange-900/40 dark:to-tech-orange-800/30 border border-tech-orange-200/70 dark:border-tech-orange-700/50 rounded-lg p-4 text-xs text-tech-orange-800 dark:text-tech-orange-200 backdrop-blur-sm">
                This is where all the latest notifications for your scheduled
                meetings will appear. You can also add them directly from your
                desktop using the top right plus button.
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </>
  );

  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <ErrorFallback
          error={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            setTimeout(() => setLoading(false), 800);
          }}
        />
      );
    }

    if (isTransitioning) {
      return (
        <div className="flex items-center justify-center py-20">
          <SkeletonLoader className="w-8 h-8 rounded-full" />
        </div>
      );
    }

    if (currentView === 'Dashboard') {
      return renderDashboardContent();
    }

    return (
      <DashboardRoutes
        currentView={currentView}
        navigateToSection={navigateToSection}
        setCurrentView={setCurrentView}
      />
    );
  };

  return (
    <ModalProvider>
      <div className="min-h-screen bg-neutral-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
        <DashboardModals />
        {/* Persistent Header */}
        {user && (
          <DashboardHeader
            user={user}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
            onNavigate={navigateToSection}
            setSidebarHovered={setSidebarHovered}
            setIsMouseOverButton={setIsMouseOverButton}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onNavigate={navigateToSection}
          isHovered={sidebarHovered}
          setIsHovered={setSidebarHovered}
          isMouseOverButton={isMouseOverButton}
          setIsMouseOverButton={setIsMouseOverButton}
        />

        {/* Dynamic Content Area */}
        <div
          className={`pt-14 p-4 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-72' : 'ml-0'
          }`}
          onMouseEnter={() => {
            if (!sidebarOpen) {
              setSidebarHovered(false);
              setIsMouseOverButton(false);
            }
          }}
        >
          <div
            className={`min-h-[calc(100vh-8rem)] transition-all duration-500 ${
              showContent
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <PageTransition location={currentView}>
              {renderCurrentView()}
            </PageTransition>
          </div>
        </div>

        <CustomizationAlert
          isOpen={showCustomizationAlert}
          onClose={() => setShowCustomizationAlert(false)}
          onGotIt={() => {
            setShowCustomizationAlert(false);
            // TODO: Implement customization mode
          }}
          onNotNow={() => setShowCustomizationAlert(false)}
        />
      </div>
    </ModalProvider>
  );
};

export default Dashboard;
