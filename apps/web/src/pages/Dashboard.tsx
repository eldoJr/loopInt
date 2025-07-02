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
  X
} from 'lucide-react';
import type { User as UserType } from '../lib/api';
import DashboardHeader from '../components/ui/DashboardHeader';
import QuickActionCard from '../components/ui/QuickActionCard';
import DashboardCard from '../components/ui/DashboardCard';
import TodoItem from '../components/ui/TodoItem';
import AllActionsDropdown from '../components/ui/AllActionsDropdown';

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFinishedTodos, setShowFinishedTodos] = useState(false);
  const [todos, setTodos] = useState([
    { id: 1, text: 'Set up project workspace', starred: true, date: '01/07 2025', completed: false },
    { id: 2, text: 'Review team proposals', starred: true, date: '01/07 2025', completed: false },
    { id: 3, text: 'Update client database', starred: false, date: '01/08 2025', completed: true },
    { id: 4, text: 'Prepare monthly report', starred: false, date: '01/09 2025', completed: true }
  ]);

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

  const quickActions = [
    { title: 'New Project', icon: FolderOpen, action: () => console.log('New Project') },
    { title: 'Add Task', icon: CheckCircle, action: () => console.log('Add Task') },
    { title: 'New Client', icon: Building, action: () => console.log('New Client') },
    { title: 'Team Member', icon: User, action: () => console.log('Team Member') },
    { title: 'Generate Report', icon: FileText, action: () => console.log('Generate Report') }
  ];

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const projects = [
    { name: 'E-commerce Platform', status: 'In Progress', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Mobile App Redesign', status: 'Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { name: 'API Integration', status: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {user && (
        <DashboardHeader 
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
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
                    setActiveTab(item);
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

      <div className="p-6">
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
                <button
                  onClick={() => console.log('Short Notes')}
                  className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors text-sm border border-gray-700/50"
                >
                  Short Notes
                </button>
                <button
                  onClick={() => console.log('History')}
                  className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors text-sm border border-gray-700/50"
                >
                  History
                </button>
                <AllActionsDropdown />
                <button
                  onClick={() => console.log('Settings')}
                  className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors text-sm border border-gray-700/50"
                >
                  Settings
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:block px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Logout
              </button>
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
      </div>
    </div>
  );
};

export default Dashboard;