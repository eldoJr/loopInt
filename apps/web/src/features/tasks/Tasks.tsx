import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Calendar, Clock, CheckCircle, Circle, Edit, Trash2, Search, X, Filter } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isToday, isTomorrow, isThisWeek, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';


interface TasksProps {
  onNavigateBack?: () => void;
  onNavigateToAddTask?: () => void;
  onNavigateToEditTask?: (taskId: string) => void;
}

const Tasks = ({ onNavigateBack, onNavigateToAddTask, onNavigateToEditTask }: TasksProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  type SectionKey = 'today' | 'tomorrow' | 'thisWeek' | 'later';
  
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    today: true,
    tomorrow: true,
    thisWeek: true,
    later: true
  });

  type Task = {
    id: number;
    title: string;
    description?: string;
    time?: string;
    status: 'todo' | 'done' | 'in_progress';
    priority: 'high' | 'medium' | 'low';
    uuid?: string; // Original UUID from database
  };

  const [tasks, setTasks] = useState<Record<SectionKey, Task[]>>({
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  });

  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'Day' | '3 days' | 'Week' | 'Month'>('Week');
  const [searchQuery, setSearchQuery] = useState('');


  interface ApiTask {
    id: string;
    project_id?: string;
    assigned_to?: string;
    title: string;
    description?: string;
    status: 'todo' | 'done' | 'in_progress';
    priority: 'high' | 'medium' | 'low';
    due_date?: string;
    created_at: string;
    updated_at: string;
  }

  const fetchTasks = async () => {
    try {
      // Get current user to filter tasks
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      
      const response = await fetch('http://localhost:3000/tasks');
      if (response.ok) {
        const fetchedTasks: ApiTask[] = await response.json();
        console.log('Fetched tasks from API:', fetchedTasks);
        console.log('Current user:', currentUser);
        console.log('Looking for tasks assigned to:', currentUser?.id);
        
        // Filter tasks for current user and convert to component format
        const userTasks = currentUser ? 
          fetchedTasks.filter(task => {
            console.log('Comparing task.assigned_to:', task.assigned_to, 'with user.id:', currentUser.id);
            return task.assigned_to === currentUser.id;
          }) : 
          fetchedTasks;
        
        console.log('User tasks after filtering:', userTasks);
        
        const convertedTasks = userTasks.map((task, index) => ({
          id: index + 1,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          time: task.due_date,
          uuid: task.id
        }));
        
        console.log('Final converted tasks:', convertedTasks);
        
        // Categorize tasks by due date
        const categorizedTasks = {
          today: [] as Task[],
          tomorrow: [] as Task[],
          thisWeek: [] as Task[],
          later: [] as Task[]
        };
        
        convertedTasks.forEach(task => {
          if (!task.time) {
            categorizedTasks.later.push(task);
            return;
          }
          
          try {
            const dueDate = parseISO(task.time);
          
          if (isToday(dueDate)) {
            categorizedTasks.today.push(task);
          } else if (isTomorrow(dueDate)) {
            categorizedTasks.tomorrow.push(task);
          } else if (isThisWeek(dueDate)) {
            categorizedTasks.thisWeek.push(task);
          } else {
            categorizedTasks.later.push(task);
          }
          } catch (error) {
            console.error('Error parsing date:', task.time, error);
            categorizedTasks.later.push(task);
          }
        });
        
        setTasks(categorizedTasks);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
      fetchTasks();
    }, 800);
    return () => clearTimeout(timer);
  }, []);



  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleTask = async (sectionKey: SectionKey, taskId: number) => {
    const task = tasks[sectionKey].find(t => t.id === taskId);
    if (!task?.uuid) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    
    try {
      const response = await fetch(`http://localhost:3000/tasks/${task.uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setTasks(prev => ({
          ...prev,
          [sectionKey]: prev[sectionKey].map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        }));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskCount = (sectionTasks: Task[]) => {
    const completed = sectionTasks.filter(task => task.status === 'done').length;
    const total = sectionTasks.length;
    return { completed, total };
  };

  const getViewDateRange = () => {
    const today = new Date();
    switch (view) {
      case 'Day':
        return { start: startOfDay(today), end: endOfDay(today) };
      case '3 days':
        return { start: startOfDay(today), end: endOfDay(addDays(today, 2)) };
      case 'Week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'Month':
        return { start: startOfDay(today), end: endOfDay(addDays(today, 30)) };
      default:
        return { start: startOfDay(today), end: endOfDay(addDays(today, 7)) };
    }
  };

  const filteredTasks = (sectionTasks: Task[]) => {
    let filtered = sectionTasks;
    
    // Apply status filter
    switch (filter) {
      case 'completed': filtered = filtered.filter(task => task.status === 'done'); break;
      case 'pending': filtered = filtered.filter(task => task.status !== 'done'); break;
      case 'high': filtered = filtered.filter(task => task.priority === 'high'); break;
    }
    
    // Apply view filter
    if (view !== 'Week') {
      const { start, end } = getViewDateRange();
      filtered = filtered.filter(task => {
        if (!task.time) return view === 'Month';
        const taskDate = parseISO(task.time);
        return isWithinInterval(taskDate, { start, end });
      });
    }
    
    return filtered;
  };

  const deleteTask = async (taskUuid: string, sectionKey: SectionKey, taskId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskUuid}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setTasks(prev => ({
          ...prev,
          [sectionKey]: prev[sectionKey].filter(task => task.id !== taskId)
        }));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };



  const getSections = () => {
    const today = new Date();
    switch (view) {
      case 'Day':
        return [{ key: 'today' as SectionKey, title: 'Today', date: format(today, 'MMM dd, yyyy'), icon: Calendar }];
      case '3 days':
        return [
          { key: 'today' as SectionKey, title: 'Today', date: format(today, 'MMM dd'), icon: Calendar },
          { key: 'tomorrow' as SectionKey, title: 'Tomorrow', date: format(addDays(today, 1), 'MMM dd'), icon: Calendar },
          { key: 'thisWeek' as SectionKey, title: format(addDays(today, 2), 'EEEE'), date: format(addDays(today, 2), 'MMM dd'), icon: Calendar }
        ];
      case 'Month':
        return [
          { key: 'today' as SectionKey, title: 'This Month', date: format(today, 'MMMM yyyy'), icon: Calendar },
          { key: 'later' as SectionKey, title: 'Later', date: 'Future tasks', icon: Clock }
        ];
      default: // Week
        return [
          { key: 'today' as SectionKey, title: 'Today', date: format(today, 'MMM dd, yyyy'), icon: Calendar },
          { key: 'tomorrow' as SectionKey, title: 'Tomorrow', date: format(addDays(today, 1), 'MMM dd, yyyy'), icon: Calendar },
          { key: 'thisWeek' as SectionKey, title: 'This Week', date: `${format(startOfWeek(today), 'MMM dd')} - ${format(endOfWeek(today), 'MMM dd')}`, icon: Calendar },
          { key: 'later' as SectionKey, title: 'Later', date: 'Future tasks', icon: Clock }
        ];
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Tasks' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchTasks}
                className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button 
                onClick={() => onNavigateToAddTask?.()}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus size={14} />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 pl-8 pr-8 py-1.5 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex space-x-1">
                {['all', 'completed', 'pending', 'high'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                      filter === filterType
                        ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {(['Day', '3 days', 'Week', 'Month'] as const).map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      view === viewType 
                        ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-4">
        {getSections().map(({ key, title, date, icon: Icon }) => {
          const sectionTasks = filteredTasks(tasks[key]);
          const { completed, total } = getTaskCount(tasks[key]);
          
          return (
            <div key={key} className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden transition-all duration-300">
              <div 
                className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleSection(key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-400 hover:text-gray-300">
                      {expandedSections[key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <Icon size={18} className="text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {total > 0 && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <CheckCircle size={14} className="text-green-400" />
                          <span>{completed}</span>
                        </span>
                        <span>/</span>
                        <span>{total}</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToAddTask?.();
                      }}
                      className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedSections[key] && (
                <div className="px-4 py-3">
                  {sectionTasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      <Circle size={32} className="mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                      <p className="text-sm">No tasks for this period</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sectionTasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            task.status === 'done'
                              ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/30' 
                              : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => toggleTask(key, task.id)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              {task.status === 'done' ? (
                                <CheckCircle size={18} className="text-green-400" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                              )}
                              {task.time && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{format(parseISO(task.time), 'MMM dd, yyyy')}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === 'done' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                              task.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                              'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                              'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (task.uuid) {
                                    onNavigateToEditTask?.(task.uuid);
                                  }
                                }}
                                className="text-gray-400 hover:text-blue-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              >
                                <Edit size={12} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const section = Object.entries(tasks).find(([, sectionTasks]) => 
                                    sectionTasks.some(t => t.id === task.id)
                                  )?.[0] as SectionKey;
                                  if (task.uuid && section) {
                                    deleteTask(task.uuid, section, task.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>




    </div>
  );
};

export default Tasks;