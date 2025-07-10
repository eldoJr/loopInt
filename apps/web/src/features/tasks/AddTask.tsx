import { useState, useEffect } from 'react';
import { Calendar, User, Save, CalendarDays, Timer, Target, CalendarCheck, Check, Sparkles, X } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isToday, isTomorrow, isThisWeek } from 'date-fns';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AIGenerateTask from '../ai/GenerateTask';

interface AddTaskProps {
  onNavigateBack?: () => void;
  onNavigateToTasks?: () => void;
}

const AddTask = ({ onNavigateBack, onNavigateToTasks }: AddTaskProps) => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    project_id: '',
    user_id: currentUser?.id || '',
    user_name: currentUser?.name || ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        user_id: currentUser.id,
        user_name: currentUser.name
      }));
    }
  }, [currentUser]);

  const quickDateOptions = [
    { label: 'Today', value: format(new Date(), 'yyyy-MM-dd'), icon: CalendarDays },
    { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd'), icon: Timer },
    { label: 'This Weekend', value: format(addDays(startOfWeek(new Date()), 6), 'yyyy-MM-dd'), icon: Target },
    { label: 'Next Week', value: format(addWeeks(new Date(), 1), 'yyyy-MM-dd'), icon: CalendarCheck }
  ];

  const getDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      if (isThisWeek(date)) return 'This Week';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(fakeEvent);
      }
      if (e.key === 'Escape') {
        onNavigateToTasks?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateToTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
        user_id: formData.user_id,
        user_name: formData.user_name
      };
      
      console.log('Submitting task:', taskData);
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Task created successfully:', result);
        setIsSaved(true);
        setTimeout(() => onNavigateToTasks?.(), 1000);
      } else {
        const errorText = await response.text();
        console.error('Failed to create task:', errorText);
        alert('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Network error. Please check if the server is running.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAIApply = (aiData: { title?: string; description?: string; priority?: string; status?: string; due_date?: string }) => {
    setFormData(prev => ({
      ...prev,
      title: aiData.title || prev.title,
      description: aiData.description || prev.description,
      priority: aiData.priority || prev.priority,
      status: aiData.status || prev.status,
      due_date: aiData.due_date || prev.due_date
    }));
    setShowAIPanel(false);
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Tasks', onClick: onNavigateToTasks },
    { label: 'Add Task' }
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
      showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Add New Task</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  showAIPanel
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
                    : 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 hover:border-green-400/50 hover:text-green-300'
                }`}
              >
                <div className={`transition-transform duration-300 ${
                  showAIPanel ? 'rotate-180' : 'group-hover:rotate-12'
                }`}>
                  {showAIPanel ? <X size={16} /> : <Sparkles size={16} />}
                </div>
                <span className="font-medium">{showAIPanel ? 'Close AI' : 'AI Assistant'}</span>
                {!showAIPanel && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-75" />
                )}
              </button>
              <button 
                onClick={onNavigateToTasks}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 hover:text-white transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95"
              >
                <Save size={16} />
                <span className="font-medium">Create Task</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className={`flex transition-all duration-500 ease-in-out`}>
            <div className={`${showAIPanel ? 'w-1/2' : 'w-full'} flex-shrink-0 p-6 transition-all duration-500`}>
              <form onSubmit={handleSubmit}>
                <div className={`space-y-8 ${!showAIPanel ? 'max-w-4xl mx-auto' : ''}`}>
            {/* Section 1 - Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Task Information
              </h2>
              
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Task Title *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Enter task title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Status
                </label>
                <div className="col-span-4">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                  Priority
                </label>
                <div className="col-span-4">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Due Date
              </label>
              <div className="col-span-9">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {quickDateOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, due_date: option.value })}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                          formData.due_date === option.value
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50 hover:text-gray-300'
                        }`}
                      >
                        <option.icon size={14} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="w-auto bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {formData.due_date && (
                    <span className="text-blue-400 text-xs">({getDateLabel(formData.due_date)})</span>
                  )}
                </div>
              </div>
            </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Project
                </label>
                <div className="col-span-4">
                  <select
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Select Project</option>
                    <option value="proj-1">E-commerce Platform</option>
                    <option value="proj-2">Mobile App Redesign</option>
                    <option value="proj-3">API Integration</option>
                    <option value="proj-4">New Project</option>
                    <option value="proj-5">HR Project</option>
                  </select>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                  Assigned To
                </label>
                <div className="col-span-4">
                  <div className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-3 text-gray-300 flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>{currentUser?.name || 'User'} (You)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 - Schedule and Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Schedule and Details
              </h2>

              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                  Description
                </label>
                <div className="col-span-9">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                    placeholder="Enter task description"
                  />
                </div>
              </div>
            </div>
                </div>
              </form>
            </div>
            <div className={`${showAIPanel ? 'w-1/2 opacity-100' : 'w-0 opacity-0'} flex-shrink-0 p-6 border-l border-gray-700/50 transition-all duration-500 overflow-hidden bg-gradient-to-br from-green-900/10 to-blue-900/10`}>
              <AIGenerateTask onApplyToForm={handleAIApply} />
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/30">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Ctrl+S to save</span>
              <span>•</span>
              <span>Press Esc to cancel</span>
            </div>
            <div className="flex items-center space-x-2">
              {isSaved && (
                <div className="flex items-center space-x-1 text-green-400">
                  <Check size={14} />
                  <span>Saved</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;