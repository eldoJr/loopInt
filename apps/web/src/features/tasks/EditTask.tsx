import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  User,
  Check,
  AlertCircle,
  CalendarDays,
  Timer,
  Target,
  CalendarCheck,
  Save,
  Sparkles,
} from 'lucide-react';
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  isToday,
  isTomorrow,
  isThisWeek,
} from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useTask, useUpdateTask } from '../../hooks/api/useTasks';
import { taskSchema, type TaskFormData } from '../../schemas/taskSchema';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';

interface EditTaskProps {
  taskId: string;
  onNavigateBack?: () => void;
  onNavigateToTasks?: () => void;
}



interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const EditTask = ({
  taskId,
  onNavigateBack,
  onNavigateToTasks,
}: EditTaskProps) => {
  useTheme();
  
  const showConfirmation = (props: ConfirmationDialogProps) => {
    if (window.confirm(props.message)) {
      props.onConfirm();
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showAIAssistance, setShowAIAssistance] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  
  const { data: task, isLoading: taskLoading, error: taskError } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors, isValid },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: 'todo' as const,
      priority: 'medium' as const,
      due_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      project_id: '',
      user_id: '',
      user_name: '',
    },
  });
  
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');

  useEffect(() => {
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (task && currentUser) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        due_date: task.due_date
          ? format(new Date(task.due_date), 'yyyy-MM-dd')
          : format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        project_id: task.project_id || '',
        user_id: task.assigned_to || currentUser.id,
        user_name: currentUser.name,
      });
    }
  }, [task, currentUser, reset]);

  const quickDateOptions = [
    {
      label: 'Today',
      value: format(new Date(), 'yyyy-MM-dd'),
      icon: CalendarDays,
    },
    {
      label: 'Tomorrow',
      value: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      icon: Timer,
    },
    {
      label: 'This Weekend',
      value: format(addDays(startOfWeek(new Date()), 6), 'yyyy-MM-dd'),
      icon: Target,
    },
    {
      label: 'Next Week',
      value: format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
      icon: CalendarCheck,
    },
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
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(onSubmit)(fakeEvent);
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string) => {
      setValue(field, value);
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors, setValue]
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!watchedTitle?.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (watchedTitle?.trim() || watchedDescription?.trim()) {
      showConfirmation({
        title: 'Discard changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        cancelText: 'Continue editing',
        onConfirm: () => onNavigateToTasks?.(),
      });
    } else {
      onNavigateToTasks?.();
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const taskData = {
        id: taskId,
        ...data,
        due_date: data.due_date || undefined,
        assigned_to: data.user_id,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateTaskMutation.mutate(taskData, {
        onSuccess: () => {
          console.log('Task updated successfully', taskData);
          if (onNavigateToTasks) {
            onNavigateToTasks();
          } else if (onNavigateBack) {
            onNavigateBack();
          }
        },
        onError: (error) => {
          console.error('Error updating task:', error);
          setErrors({ submit: 'Failed to update task. Please try again.' });
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setErrors({ submit: 'Failed to update task. Please try again.' });
    } finally {
      setSaving(false);
    }
  };



  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Tasks', onClick: onNavigateToTasks },
    { label: 'Edit Task' },
  ];

  if (loading || taskLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load task data</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Sticky Breadcrumb */}
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="mt-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm transition-all duration-300">
          <div className="sticky top-14 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                  <Save className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Task
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAIAssistance(!showAIAssistance)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    showAIAssistance
                      ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">AI Assist</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={saving || updateTaskMutation.isPending}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    !saving && !updateTaskMutation.isPending
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={14} />
                  <span>{saving || updateTaskMutation.isPending ? 'Updating...' : 'Update'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Task Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Task Title *
                    </label>
                    <div className="col-span-9">
                      <input
                        type="text"
                        {...register('title')}
                        placeholder="Enter task title"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          formErrors.title || errors.title
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      />
                      {(formErrors.title || errors.title) && (
                        <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.title?.message || errors.title}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Status *
                    </label>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          {...register('status')}
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                            formErrors.status
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      {formErrors.status && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.status.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Priority *
                    </label>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          {...register('priority')}
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                            formErrors.priority
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      {formErrors.priority && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.priority.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Due Date
                    </label>
                    <div className="col-span-9">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {quickDateOptions.map(option => (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => setValue('due_date', option.value)}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
                                watch('due_date') === option.value
                                  ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                                  : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <option.icon size={12} />
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="date"
                              {...register('due_date')}
                              className="w-auto bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                            />
                          </div>
                          {watch('due_date') && (
                            <span className="text-blue-500 dark:text-blue-400 text-xs">
                              ({getDateLabel(watch('due_date') || '')})
                            </span>
                          )}
                        </div>
                        {formErrors.due_date && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.due_date.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Project
                    </label>
                    <div className="col-span-9">
                      <div className="relative">
                        <select
                          {...register('project_id')}
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                            formErrors.project_id
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          <option value="">Select a project...</option>
                          <option value="project1">Project 1</option>
                          <option value="project2">Project 2</option>
                          <option value="project3">Project 3</option>
                        </select>
                      </div>
                      {formErrors.project_id && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.project_id.message}</p>
                      )}
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

                  {/* Task Description */}
                  <div className="mt-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Task Description
                      </h2>
                    </div>
                    <div className="-mr-10 sm:-mr-16 md:-mr-24 lg:-mr-40 xl:-mr-56 2xl:-mr-80">
                      <RichTextEditor
                        value={watchedDescription}
                        onChange={(value) => handleInputChange('description', value)}
                        placeholder="Enter task description..."
                        minHeight="200px"
                      />
                    </div>
                    {formErrors.description && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.description.message}
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </form>

          {errors.submit && (
            <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Press Ctrl+S to save</span>
                <span>•</span>
                <span>Press Esc to cancel</span>
              </div>
              <div className="flex items-center space-x-2">
                {updateTaskMutation.isSuccess && (
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
    </ErrorBoundary>
  );
};

export default EditTask;
