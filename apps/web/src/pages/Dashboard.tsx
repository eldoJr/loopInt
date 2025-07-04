import { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Building, 
  User, 
  FolderOpen, 
  Calendar,
  CheckCircle,
  BarChart3,
  Users,
  X,
  Settings
} from 'lucide-react';
import type { User as UserType } from '../lib/api';
import DashboardHeader from '../components/ui/DashboardHeader';
import QuickActionCard from '../components/ui/QuickActionCard';
import DashboardCard from '../components/ui/DashboardCard';
import TodoItem from '../components/ui/TodoItem';
import AllActionsDropdown from '../components/ui/AllActionsDropdown';
import NewProject from '../features/projects/NewProject';
import AddTask from '../features/tasks/AddTask';
import NewClient from '../features/clients/NewClient';
import TeamMember from '../features/auth/TeamMember';
import GenerateReport from '../features/ai/GenerateReport';
import Projects from '../features/projects/Projects';
import Tasks from '../features/tasks/Tasks';
import CalendarView from '../features/calendar/Calendar';
import Team from '../features/team/Team';
import Analytics from '../features/analytics/Analytics';
import Clients from '../features/clients/Clients';
import PersonalData from '../features/profile/PersonalData';
import OrganizationData from '../features/profile/OrganizationData';
import AccountSettings from '../features/profile/AccountSettings';
import HelpCenter from '../features/support/HelpCenter';
import Language from '../features/settings/Language';
import MenuOrientation from '../features/settings/MenuOrientation';
import ViewResize from '../features/settings/ViewResize';
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
import NewDocument from '../features/documents/NewDocument';
import NewExpense from '../features/finance/NewExpense';
import NewOffer from '../features/clients/NewOffer';
import NewProduct from '../features/clients/NewProduct';
import HRProject from '../features/hr/HRProject';
import UndocumentedRevenue from '../features/finance/UndocumentedRevenue';
import Historic from '../features/support/History';
import ButtonsConfiguration from '../features/settings/ButtonsConfiguration';
import CustomizationAlert from '../components/ui/CustomizationAlert';

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks');
        if (response.ok) {
          const tasks = await response.json();
          const formattedTodos: Todo[] = tasks.map((task: { id: string; title: string; priority: string; due_date?: string; status: string }) => ({
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
  }, [currentView]);

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

  const navigateToSection = (section: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(section);
      setIsTransitioning(false);
    }, 300);
  };

  const quickActions = [
    { title: 'New Project', icon: FolderOpen, action: () => navigateToSection('New Project') },
    { title: 'Add Task', icon: CheckCircle, action: () => navigateToSection('Add Task') },
    { title: 'New Client', icon: Building, action: () => navigateToSection('New Client') },
    { title: 'Team Member', icon: User, action: () => navigateToSection('Team Member') },
    { title: 'Generate Report', icon: FileText, action: () => navigateToSection('Generate Report') }
  ];

  const toggleTodo = async (id: string) => {
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
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const projects = [
    { name: 'E-commerce Platform', status: 'In Progress', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Mobile App Redesign', status: 'Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { name: 'API Integration', status: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
  ];

  const renderDashboardContent = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Hi, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-400">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2">

              <AllActionsDropdown onNavigate={navigateToSection} />
              <button
                onClick={() => setShowCustomizationAlert(true)}
                className="p-2 bg-gray-800/30 text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-gray-300 border border-gray-700/30"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            icon={action.icon}
            onClick={action.action}
            isActive={currentView === action.title}
          />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-blue-400">12</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Tasks</p>
              <p className="text-3xl font-bold text-green-400">48</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <p className="text-3xl font-bold text-purple-400">8</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-emerald-400">$24K</p>
            </div>
            <BarChart3 className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Tasks */}
          <DashboardCard
            title="My Tasks"
            icon={CheckCircle}
            onAdd={() => console.log('Add task')}
            headerActions={
              <button
                onClick={() => setShowFinishedTodos(!showFinishedTodos)}
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showFinishedTodos ? 'hide completed' : 'show completed'}
              </button>
            }
          >
            <div className="space-y-2">
              {todos
                .filter(todo => showFinishedTodos || !todo.completed)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    {...todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
            </div>
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard title="Recent Activity" icon={Clock}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Project "E-commerce Platform" updated</span>
                <span className="text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Task "API Integration" completed</span>
                <span className="text-gray-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">New team member added</span>
                <span className="text-gray-500">1d ago</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Projects */}
          <DashboardCard
            title="Active Projects"
            icon={FolderOpen}
            onAdd={() => console.log('Add project')}
          >
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">{project.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${project.color}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Calendar */}
          <DashboardCard
            title="Upcoming Events"
            icon={Calendar}
            onAdd={() => console.log('Add event')}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div>
                  <p className="text-gray-300 font-medium">Team Meeting</p>
                  <p className="text-gray-500 text-sm">Project review and planning</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 text-sm">Today</p>
                  <p className="text-gray-500 text-xs">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div>
                  <p className="text-gray-300 font-medium">Client Presentation</p>
                  <p className="text-gray-500 text-sm">Final project showcase</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 text-sm">Tomorrow</p>
                  <p className="text-gray-500 text-xs">10:00 AM</p>
                </div>
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
        return <Projects onNavigateBack={backToMain} />;
      case 'Tasks':
        return <Tasks onNavigateBack={backToMain} onNavigateToAddTask={() => navigateToSection('Add Task')} />;
      case 'Calendar':
        return <CalendarView onNavigateBack={backToMain} />;
      case 'Team':
        return <Team onNavigateBack={backToMain} />;
      case 'Analytics':
        return <Analytics onNavigateBack={backToMain} />;
      case 'New Project':
        return <NewProject onNavigateBack={backToMain} onNavigateToProjects={() => navigateToSection('Projects')} />;
      case 'Add Task':
        return <AddTask onNavigateBack={() => navigateToSection('Tasks')} onNavigateToTasks={() => navigateToSection('Tasks')} />;
      case 'New Client':
        return <NewClient onNavigateBack={backToMain} onNavigateToClients={() => navigateToSection('Clients')} />;
      case 'Team Member':
        return <TeamMember onNavigateBack={backToMain} onNavigateToTeam={() => navigateToSection('Team')} />;
      case 'Generate Report':
        return <GenerateReport onNavigateBack={backToMain} onNavigateToAnalytics={() => navigateToSection('Analytics')} />;
      case 'Clients':
        return <Clients onNavigateBack={backToMain} />;
      case 'Personal Data':
        return <PersonalData onNavigateBack={backToMain} />;
      case 'Organization Data':
        return <OrganizationData onNavigateBack={backToMain} />;
      case 'Account Settings':
        return <AccountSettings onNavigateBack={backToMain} />;
      case 'Help Center':
        return <HelpCenter onNavigateBack={backToMain} />;
      case 'Language':
        return <Language onNavigateBack={backToMain} />;
      case 'Menu Orientation':
        return <MenuOrientation onNavigateBack={backToMain} />;
      case 'View Resize':
        return <ViewResize onNavigateBack={backToMain} />;
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
        return <NewCoworker onNavigateBack={backToMain} />;
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
      case 'Buttons Configuration':
        return <ButtonsConfiguration onNavigateBack={backToMain} />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Persistent Header */}
      {user && (
        <DashboardHeader 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={navigateToSection}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-white">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-2">
              {['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Team', 'Analytics'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    navigateToSection(item);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-lg flex items-center transition-colors ${
                    activeTab === item 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-800/50 space-y-2">
                <button
                  onClick={() => console.log('Short Notes')}
                  className="w-full px-4 py-2 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors text-left"
                >
                  Short Notes
                </button>
                <button
                  onClick={() => console.log('History')}
                  className="w-full px-4 py-2 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors text-left"
                >
                  History
                </button>
                <button
                  onClick={() => console.log('All Actions')}
                  className="w-full px-4 py-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors text-left"
                >
                  All Actions
                </button>
                <button
                  onClick={() => console.log('Settings')}
                  className="w-full px-4 py-2 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors text-left"
                >
                  Settings
                </button>
              </div>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Content Area */}
      <div className="pt-20 p-6">
        <div className="transition-all duration-300 ease-in-out">
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