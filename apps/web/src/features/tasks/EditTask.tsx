import { useState, useEffect } from 'react';
import { Calendar, User, Save, CalendarDays, Timer, Target, CalendarCheck, Check, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Code } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';
import CustomSelect from '../../components/ui/CustomSelect';
import { Toggle } from '../../components/ui/Toggle';

interface EditTaskProps {
  taskId: string;
  onNavigateBack?: () => void;
  onNavigateToTasks?: () => void;
}

const EditTask = ({ taskId, onNavigateBack, onNavigateToTasks }: EditTaskProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  });
  
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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
        if (response.ok) {
          const task = await response.json();
          setFormData({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'todo',
            priority: task.priority || 'medium',
            due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd'),
            project_id: task.project_id || '',
            user_id: task.assigned_to || currentUser?.id || '',
            user_name: currentUser?.name || ''
          });
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        showToast.error('Failed to load task data');
      }
    };

    fetchTask();
  }, [taskId, currentUser]);

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
        assigned_to: formData.user_id
      };
      
      console.log('Updating task:', taskData);
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Task updated successfully:', result);
        setIsSaved(true);
        showToast.success('Task updated successfully!');
        setTimeout(() => onNavigateToTasks?.(), 1000);
      } else {
        const errorText = await response.text();
        console.error('Failed to update task:', errorText);
        showToast.error('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showToast.error('Network error. Please check if the server is running.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));
    
    // Apply style to selected text if there's a selection
    const textarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      // This is a placeholder for potential future enhancement with a more sophisticated rich text editor
      // For now, we're just toggling the global style state
    }
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Tasks', onClick: onNavigateToTasks },
    { label: 'Edit Task' }
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
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Task</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onNavigateToTasks}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Save size={14} />
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Section 1 - Basic Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Task Information
              </h2>
              
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Task Title *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    placeholder="Enter task title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Status *
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={['todo', 'in_progress', 'done']}
                    value={formData.status}
                    onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Priority *
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={['low', 'medium', 'high']}
                    value={formData.priority}
                    onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  />
                </div>
              </div>

            <div className="grid grid-cols-12 gap-3 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Due Date *
              </label>
              <div className="col-span-9">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {quickDateOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, due_date: option.value })}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
                          formData.due_date === option.value
                            ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                            : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <option.icon size={12} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  {formData.due_date && (
                    <span className="text-blue-500 dark:text-blue-400 text-xs">({getDateLabel(formData.due_date)})</span>
                  )}
                </div>
              </div>
            </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Project *
                </label>
                <div className="col-span-9">
                  <CustomSelect
                    options={['', 'Project 1', 'Project 2', 'Project 3']}
                    value={formData.project_id || 'Select a project...'}
                    onChange={(value) => setFormData(prev => ({ ...prev, project_id: value === 'Select a project...' ? '' : value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Assigned To *
                </label>
                <div className="col-span-9">
                  <div className="w-full bg-gray-100 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>{currentUser?.name || 'User'} (You)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 - Details */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Details
              </h2>

              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Description *
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-1 p-2 bg-gray-100 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700/50 rounded-t-lg">
                    <Toggle
                      pressed={textStyles.bold}
                      onPressedChange={() => handleTextStyle('bold')}
                      aria-label="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.italic}
                      onPressedChange={() => handleTextStyle('italic')}
                      aria-label="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.underline}
                      onPressedChange={() => handleTextStyle('underline')}
                      aria-label="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.strikethrough}
                      onPressedChange={() => handleTextStyle('strikethrough')}
                      aria-label="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Toggle>
                    
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                    
                    <Toggle
                      pressed={textAlign === 'left'}
                      onPressedChange={() => handleTextAlign('left')}
                      aria-label="Align left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textAlign === 'center'}
                      onPressedChange={() => handleTextAlign('center')}
                      aria-label="Align center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textAlign === 'right'}
                      onPressedChange={() => handleTextAlign('right')}
                      aria-label="Align right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Toggle>
                    
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                    
                    <Toggle aria-label="List">
                      <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Ordered list">
                      <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Link">
                      <Link className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Code">
                      <Code className="h-4 w-4" />
                    </Toggle>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-b-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-sm"
                      placeholder="Enter task description"
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration: `${textStyles.underline ? 'underline' : ''} ${textStyles.strikethrough ? 'line-through' : ''}`.trim(),
                        textAlign: textAlign
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Ctrl+S to save</span>
              <span>•</span>
              <span>Press Esc to cancel</span>
            </div>
            <div className="flex items-center space-x-2">
              {isSaved && (
                <div className="flex items-center space-x-1 text-green-500 dark:text-green-400">
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

export default EditTask;