import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Clock,
  FolderOpen, 
  Calendar,
  CheckCircle,
  Settings,
  Heart,
  MapPin,
  Star,
  AlertTriangle
} from 'lucide-react';
import foldersIcon from '../assets/icons/folders.png';
import taskManagementIcon from '../assets/icons/task-management.png';
import teamBuildingIcon from '../assets/icons/team-building.png';
import increaseIcon from '../assets/icons/increase.png';
import type { User as UserType } from '../lib/api';
import Breadcrumb from '../components/ui/Breadcrumb';
import DashboardHeader from '../components/ui/DashboardHeader';
import DashboardCard from '../components/ui/DashboardCard';
import DashboardStatCard from '../components/ui/DashboardStatCard';
import AllActionsDropdown from '../components/ui/AllActionsDropdown';
import NewProject from '../features/projects/NewProject';
import EditProject from '../features/projects/EditProject';
import AddTask from '../features/tasks/AddTask';
import EditTask from '../features/tasks/EditTask';
import NewClient from '../features/clients/NewClient';
import TeamMember from '../features/auth/TeamMember';
import { GenerateReport } from '../features/ai/GenerateReport';
import Projects from '../features/projects/Projects';
import Tasks from '../features/tasks/Tasks';
import CalendarView from '../features/calendar/Calendar';
import Team from '../features/team/Team';
import Analytics from '../features/analytics/Analytics';
import Clients from '../features/clients/Clients';
import PersonalData from '../features/profile/PersonalData';
import AccountSettings from '../features/profile/AccountSettings';
import HelpCenter from '../features/support/HelpCenter';
import NewFeature from '../features/support/NewFeature';
import ReportBug from '../features/support/ReportBug';
import NewAccount from '../features/auth/NewAccount';
import InviteUser from '../features/auth/InviteUser';
import TaxInvoice from '../features/finance/TaxInvoice';
import NewIssue from '../features/support/NewIssue';
import NewCompany from '../features/clients/NewCompany';
import NewContact from '../features/clients/NewContact';
import JobAd from '../features/hr/JobAd';
import NewBill from '../features/finance/NewBill';
import NewCandidate from '../features/hr/NewCandidate';
import NewCoworker from '../features/team/NewCoworker';
import EditCoworker from '../features/team/EditCoworker';
import NewDocument from '../features/documents/NewDocument';
import NewExpense from '../features/finance/NewExpense';
import NewOffer from '../features/clients/NewOffer';
import NewProduct from '../features/clients/NewProduct';
import HRProject from '../features/hr/HRProject';
import UndocumentedRevenue from '../features/finance/UndocumentedRevenue';
import Historic from '../features/support/History';
import CustomizationAlert from '../components/ui/CustomizationAlert';
import Sidebar from '../components/ui/Sidebar';
import Reports from '../features/reports/Reports';
import NewReport from '../features/reports/NewReport';
import EditReport from '../features/reports/EditReport';
import ViewReport from '../features/reports/ViewReport';
import Profile from '../features/profile/Profile';
import General from '../features/settings/General';
import Notifications from '../features/settings/Notifications';
import System from '../features/settings/System';
import Products from '../features/settings/Products';
import WorkItems from '../features/settings/WorkItems';
import Apps from '../features/settings/Apps';
import UserManagement from '../features/settings/UserManagement';
import Billing from '../features/settings/Billing';

const Dashboard = () => {
  useTheme();
  const [user, setUser] = useState<UserType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isMouseOverButton, setIsMouseOverButton] = useState(false);
  const [showFinishedTodos, setShowFinishedTodos] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCustomizationAlert, setShowCustomizationAlert] = useState(false);
  interface Todo {
    id: string;
    text: string;
    starred: boolean;
    date: string;
    completed: boolean;
  }
  
  const [todos, setTodos] = useState<Todo[]>([]);
  interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    color: string;
    created_by: string;
  }
  
  interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    assigned_to?: string;
  }
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  

  


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks');
        if (response.ok) {
          const tasks = await response.json();
          
          // Filter tasks for current user
          const userTasks = user ? 
            tasks.filter((task: Task) => task.assigned_to === user.id) : 
            tasks;
          
          const formattedTodos: Todo[] = userTasks.map((task: Task) => ({
            id: task.id,
            text: task.title,
            starred: task.priority === 'high',
            date: task.due_date ? new Date(task.due_date).toLocaleDateString() : new Date().toLocaleDateString(),
            completed: task.status === 'done'
          }));
          setTodos(formattedTodos);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    
    fetchTasks();
  }, [currentView, user?.id]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam) {
      try {
        const oauthUser = JSON.parse(decodeURIComponent(userParam));
        setUser(oauthUser);
        localStorage.setItem('user', JSON.stringify(oauthUser));
        window.history.replaceState({}, document.title, '/dashboard');
        return;
      } catch (error) {
        console.error('Error parsing OAuth user data:', error);
      }
    }
    
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  const navigateToSection = useCallback((section: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(section);
      setIsTransitioning(false);
    }, 300);
  }, []);


  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: todo.completed ? 'todo' : 'done'
        }),
      });
      
      if (response.ok) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }, [todos]);


  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        const allProjects = await response.json();
        
        // Filter projects for current user
        const userProjects = user ? 
          allProjects.filter((project: Project) => project.created_by === user.id) : 
          [];
        
        // Only show active projects (not completed or cancelled)
        const activeProjects = userProjects.filter((project: Project) => 
          ['planning', 'active', 'on-hold'].includes(project.status)
        );
        
        setProjects(activeProjects);
        setActiveProjectsCount(activeProjects.length);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      const response = await fetch('http://localhost:3000/team');
      if (response.ok) {
        const allMembers: TeamMemberType[] = await response.json();
        
        // Filter team members for current user
        const userMembers = user ? 
          allMembers.filter((member: TeamMemberType) => member.created_by === user.id || member.createdBy === user.id) : 
          allMembers;
        
        setTeamMembersCount(userMembers.length);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const breadcrumbItems = useMemo(() => [
    { label: 'LoopInt'},
    { label: 'Dash', onClick: () => navigateToSection('Dashboard')},
  ], [navigateToSection]);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTeamMembers();
    }
  }, [user, currentView]);

  const renderDashboardContent = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb items={breadcrumbItems} />
            <p className="text-gray-600 dark:text-gray-400 text-sm">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2">
              <AllActionsDropdown onNavigate={navigateToSection} />
              <button
                onClick={() => setShowCustomizationAlert(true)}
                className="p-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-gray-600/40 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <DashboardStatCard
          title="Active Projects"
          value={activeProjectsCount}
          iconSrc={foldersIcon}
          iconAlt="Projects"
          onClick={() => navigateToSection('Projects')}
          trend={{ value: 12, direction: 'up', period: 'vs last month' }}
          subtitle="In progress"
          loading={!user}
        />
        <DashboardStatCard
          title="Completed Tasks"
          value={todos.filter(t => t.completed).length}
          iconSrc={taskManagementIcon}
          iconAlt="Tasks"
          onClick={() => navigateToSection('Tasks')}
          trend={{ value: 8, direction: 'up', period: 'vs last week' }}
          subtitle="This month"
          loading={!user}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* My Tasks */}
          <DashboardCard
            title="My Tasks"
            icon={CheckCircle}
            onAdd={() => navigateToSection('Add Task')}
            headerActions={
              <label className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFinishedTodos}
                  onChange={(e) => setShowFinishedTodos(e.target.checked)}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span>Show completed</span>
              </label>
            }
          >
            <div className="space-y-2">
              {todos.length > 0 ? (
                todos
                  .filter(todo => showFinishedTodos || !todo.completed)
                  .slice(0, 2)
                  .map((todo) => (
                    <div key={todo.id} className="p-3 bg-white/60 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer backdrop-blur-sm" onClick={() => navigateToSection('Tasks')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTodo(todo.id);
                            }}
                            className={`w-4 h-4 rounded border-2 transition-colors ${
                              todo.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400'
                            }`}
                          >
                            {todo.completed && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <div>
                            <p className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                              {todo.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{todo.date}</p>
                          </div>
                        </div>
                        {todo.starred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/40 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                  Here you will see a list of all tasks assigned to you. Click on a task to view details or mark as complete.
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Issues */}
          <DashboardCard
            title="Issues"
            icon={AlertTriangle}
          >
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                No data to display
              </div>
            </div>
          </DashboardCard>

          {/* Favorite Contacts */}
          <DashboardCard
            title="Favorite Contacts"
            icon={Heart}
          >
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                A list of all your favorite coworkers will appear here. Mark a particular coworker as a favorite if you want it to appear in this section.
              </div>
            </div>
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard title="Recent Activity" icon={Clock}>
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                Here you will see a list of all recent activities in your projects and tasks. Click on an activity to view details.
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Active Projects */}
          <DashboardCard
            title="Active Projects"
            icon={FolderOpen}
            onAdd={() => navigateToSection('New Project')}
          >
            <div className="space-y-2">
              {projects.length > 0 ? (
                projects.slice(0, 2).map((project) => (
                  <div key={project.id} className="p-3 bg-white/60 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/30 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer backdrop-blur-sm" onClick={() => navigateToSection('Projects')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: project.color }}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {project.name}
                          </p>
                          {project.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{project.description}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        project.status === 'planning' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/40 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                  Here you will see a list of all active projects that you are managing or participating in. Click on a project to view details.
                </div>
              )}
            </div>
          </DashboardCard>

          {/* My Check-ins */}
          <DashboardCard
            title="My Check-ins"
            icon={MapPin}
            onAdd={() => console.log('New check-in')}
          >
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                Here you will see a list of all active check-ins that you are the author of or need to reply to. Click on the name of the check-in to do so.
              </div>
            </div>
          </DashboardCard>

          {/* Upcoming Events */}
          <DashboardCard
            title="Upcoming Events"
            icon={Calendar}
            onAdd={() => navigateToSection('Calendar')}
          >
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                This is where all the latest notifications for your scheduled meetings will appear. You can also add them directly from your desktop using the top right plus button.
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );

  const renderCurrentView = () => {
    if (isTransitioning) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-700 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      );
    }

    const backToMain = () => navigateToSection('Dashboard');

    switch (currentView) {
      case 'Projects':
        return <Projects 
          onNavigateBack={backToMain} 
          onNavigateToNewProject={() => navigateToSection('New Project')}
          onNavigateToEditProject={(projectId) => {
            setCurrentView(`Edit Project ${projectId}`);
          }}
        />;
      case 'Tasks':
        return <Tasks 
          onNavigateBack={backToMain} 
          onNavigateToAddTask={() => navigateToSection('Add Task')}
          onNavigateToEditTask={(taskId) => {
            setCurrentView(`Edit Task ${taskId}`);
          }}
        />;
      case 'Calendar':
        return <CalendarView onNavigateBack={backToMain} />;
      case 'Team':
        return <Team 
          onNavigateBack={backToMain} 
          onNavigateToNewCoworker={() => navigateToSection('New Coworker')}
          onNavigateToEditMember={(memberId) => setCurrentView(`Edit Member ${memberId}`)}
        />;
      case 'Analytics':
        return <Analytics onNavigateBack={backToMain} />;
      case 'Reports':
        return <Reports 
          onNavigateBack={backToMain}
          onNavigateToNewReport={() => navigateToSection('New Report')}
          onNavigateToEditReport={(reportId) => setCurrentView(`Edit Report ${reportId}`)}
          onNavigateToViewReport={(reportId) => setCurrentView(`View Report ${reportId}`)}
        />;
      case 'New Report':
        return <NewReport 
          onNavigateBack={backToMain}
          onNavigateToReports={() => navigateToSection('Reports')}
        />;
      case 'New Project':
        return <NewProject onNavigateBack={backToMain} onNavigateToProjects={() => navigateToSection('Projects')} />;
      case 'Add Task':
        return <AddTask onNavigateBack={() => navigateToSection('Tasks')} onNavigateToTasks={() => navigateToSection('Tasks')} />;
      case 'New Client':
        return <NewClient onNavigateBack={backToMain} onNavigateToClients={() => navigateToSection('Clients')} />;
      case 'Team Member':
        return <TeamMember onNavigateBack={backToMain} onNavigateToTeam={() => navigateToSection('Team')} />;
      case 'Generate Report':
        return <GenerateReport />;
      case 'Clients':
        return <Clients onNavigateBack={backToMain} />;
      case 'Personal Data':
        return <PersonalData onNavigateBack={backToMain} />;
      case 'Account Settings':
        return <AccountSettings onNavigateBack={backToMain} />;
      case 'Help Center':
        return <HelpCenter onNavigateBack={backToMain} />;
      case 'New Feature':
        return <NewFeature onNavigateBack={backToMain} />;
      case 'Report Bug':
        return <ReportBug onNavigateBack={backToMain} />;
      case 'New Account':
        return <NewAccount onNavigateBack={backToMain} />;
      case 'Invite User':
        return <InviteUser onNavigateBack={backToMain} />;
      case 'Tax Invoice':
        return <TaxInvoice onNavigateBack={backToMain} />;
      case 'New Issue':
        return <NewIssue onNavigateBack={backToMain} />;
      case 'New Company':
        return <NewCompany onNavigateBack={backToMain} />;
      case 'New Contact':
        return <NewContact onNavigateBack={backToMain} />;
      case 'Job Ad':
        return <JobAd onNavigateBack={backToMain} />;
      case 'New Bill':
        return <NewBill onNavigateBack={backToMain} />;
      case 'New Candidate':
        return <NewCandidate onNavigateBack={backToMain} />;
      case 'New Coworker':
        return <NewCoworker 
          onNavigateBack={backToMain} 
          onNavigateToTeam={() => navigateToSection('Team')}
        />;
      case 'New Document':
        return <NewDocument onNavigateBack={backToMain} />;
      case 'New Expense':
        return <NewExpense onNavigateBack={backToMain} />;
      case 'New Offer':
        return <NewOffer onNavigateBack={backToMain} />;
      case 'New Product':
        return <NewProduct onNavigateBack={backToMain} />;
      case 'HR Project':
        return <HRProject onNavigateBack={backToMain} />;
      case 'Undocumented Revenue':
        return <UndocumentedRevenue onNavigateBack={backToMain} />;
      case 'History':
        return <Historic onNavigateBack={backToMain} />;
      case 'Profile':
        return <Profile onNavigateBack={backToMain} />;
      case 'General':
        return <General onNavigateBack={backToMain} />;
      case 'Notifications':
        return <Notifications onNavigateBack={backToMain} />;
      case 'System':
        return <System onNavigateBack={backToMain} />;
      case 'Products':
        return <Products onNavigateBack={backToMain} />;
      case 'WorkItems':
        return <WorkItems onNavigateBack={backToMain} />;
      case 'Apps':
        return <Apps onNavigateBack={backToMain} />;
      case 'UserManagement':
        return <UserManagement onNavigateBack={backToMain} />;
      case 'Billing':
        return <Billing onNavigateBack={backToMain} />;
      default:
        if (currentView.startsWith('Edit Project ')) {
          const projectId = currentView.replace('Edit Project ', '');
          return <EditProject 
            projectId={projectId}
            onNavigateBack={() => navigateToSection('Projects')} 
            onNavigateToProjects={() => navigateToSection('Projects')} 
          />;
        }
        if (currentView.startsWith('Edit Task ')) {
          const taskId = currentView.replace('Edit Task ', '');
          return <EditTask 
            taskId={taskId}
            onNavigateBack={() => navigateToSection('Tasks')} 
            onNavigateToTasks={() => navigateToSection('Tasks')} 
          />;
        }
        if (currentView.startsWith('Edit Member ')) {
          const memberId = currentView.replace('Edit Member ', '');
          return <EditCoworker 
            memberId={memberId}
            onNavigateBack={() => navigateToSection('Team')} 
            onNavigateToTeam={() => navigateToSection('Team')}
          />;
        }
        if (currentView.startsWith('Edit Report ')) {
          const reportId = currentView.replace('Edit Report ', '');
          return <EditReport 
            reportId={reportId}
            onNavigateBack={() => navigateToSection('Reports')}
            onNavigateToReports={() => navigateToSection('Reports')}
          />;
        }
        if (currentView.startsWith('View Report ')) {
          const reportId = currentView.replace('View Report ', '');
          return <ViewReport 
            reportId={reportId}
            onNavigateBack={() => navigateToSection('Reports')}
            onNavigateToReports={() => navigateToSection('Reports')}
            onNavigateToEdit={(id) => setCurrentView(`Edit Report ${id}`)}
          />;
        }
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900">
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
        <div>
          {renderCurrentView()}
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
  );
};

export default Dashboard;