import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Calendar, Clock, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface TasksProps {
  onNavigateBack?: () => void;
  onNavigateToAddTask?: () => void;
}

const Tasks = ({ onNavigateBack, onNavigateToAddTask }: TasksProps) => {
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
      const response = await fetch('http://localhost:3000/tasks');
      if (response.ok) {
        const fetchedTasks: ApiTask[] = await response.json();
        console.log('Fetched tasks:', fetchedTasks);
        
        // Convert API tasks to component format and categorize
        const convertedTasks = fetchedTasks.map((task, index) => ({
          id: index + 1, // Use index as ID for component
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          time: task.due_date,
          uuid: task.id // Keep original UUID for API calls
        }));
        
        // For now, put all tasks in 'today' section
        setTasks({
          today: convertedTasks,
          tomorrow: [],
          thisWeek: [],
          later: []
        });
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

  const toggleTask = (sectionKey: SectionKey, taskId: number) => {
    setTasks(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map(task =>
        task.id === taskId ? { 
          ...task, 
          status: task.status === 'done' ? 'todo' : 'done'
        } : task
      )
    }));
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

  const filteredTasks = (sectionTasks: Task[]) => {
    switch (filter) {
      case 'completed': return sectionTasks.filter(task => task.status === 'done');
      case 'pending': return sectionTasks.filter(task => task.status !== 'done');
      case 'high': return sectionTasks.filter(task => task.priority === 'high');
      default: return sectionTasks;
    }
  };

  const sections: { key: SectionKey; title: string; date: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { key: 'today', title: 'Today', date: '07/04/2025', icon: Calendar },
    { key: 'tomorrow', title: 'Tomorrow', date: '07/05/2025', icon: Calendar },
    { key: 'thisWeek', title: 'This Week', date: '07/07 - 07/13', icon: Calendar },
    { key: 'later', title: 'Later', date: 'Future tasks', icon: Clock }
  ];

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
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-white">Tasks</h1>
              <span className="text-sm text-gray-400">Workspace • Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchTasks}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button 
                onClick={() => onNavigateToAddTask?.()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Filter:</span>
              <div className="flex space-x-2">
                {['all', 'completed', 'pending', 'high'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filter === filterType
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>View:</span>
              <div className="flex space-x-1">
                {['Day', '3 days', 'Week', 'Month'].map((view) => (
                  <button
                    key={view}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      view === 'Week' 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : 'hover:bg-gray-700/50 text-gray-400'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-4">
        {sections.map(({ key, title, date, icon: Icon }) => {
          const sectionTasks = filteredTasks(tasks[key]);
          const { completed, total } = getTaskCount(tasks[key]);
          
          return (
            <div key={key} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
              <div 
                className="px-6 py-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleSection(key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-400 hover:text-gray-300">
                      {expandedSections[key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <Icon size={18} className="text-gray-400" />
                    <div>
                      <h3 className="font-medium text-white">{title}</h3>
                      <p className="text-sm text-gray-400">{date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {total > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
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
                      className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {expandedSections[key] && (
                <div className="px-6 py-4">
                  {sectionTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Circle size={48} className="mx-auto mb-3 text-gray-600" />
                      <p>No tasks for this period</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sectionTasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            task.status === 'done'
                              ? 'bg-gray-800/30 border-gray-700/30' 
                              : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
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
                              <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-400">{task.description}</p>
                              )}
                              {task.time && (
                                <p className="text-sm text-gray-400">{task.time}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === 'done' ? 'bg-green-500/20 text-green-400' :
                              task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                            <button className="text-gray-400 hover:text-gray-300">
                              <MoreHorizontal size={16} />
                            </button>
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