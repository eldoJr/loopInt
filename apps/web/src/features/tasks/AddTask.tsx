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
import { useCreateTask } from '../../hooks/api/useTasks';
import { taskSchema, type TaskFormData } from '../../schemas/taskSchema';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';

interface AddTaskProps {
  onNavigateBack?: () => void;
  onNavigateToTasks?: () => void;
}

type TabType = 'details' | 'preview';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const AddTask = ({ onNavigateBack, onNavigateToTasks }: AddTaskProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  
  const createTaskMutation = useCreateTask();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
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

  const showConfirmation = (props: ConfirmationDialogProps) => {
    if (window.confirm(props.message)) {
      props.onConfirm();
    }
  };

  useEffect(() => {
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setValue('user_id', user.id);
      setValue('user_name', user.name);
    }
  }, [setValue]);

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
        if (isValid) {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(onSubmit)(fakeEvent);
        }
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isValid]);

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string) => {
      setValue(field, value);
    },
    [setValue]
  );

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
    const taskData = {
      ...data,
      due_date: data.due_date || undefined,
      assigned_to: data.user_id,
    };

    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        setTimeout(() => {
          if (onNavigateToTasks) {
            onNavigateToTasks();
          } else if (onNavigateBack) {
            onNavigateBack();
          }
        }, 1000);
      },
    });
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Tasks', onClick: onNavigateToTasks },
    { label: 'New Task' },
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
    <ErrorBoundary>
      <div
        className={`space-y-6 transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Task
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || createTaskMutation.isPending}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    isValid && !createTaskMutation.isPending
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Check size={14} />
                  <span>{createTaskMutation.isPending ? 'Creating...' : 'Create'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Task Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Details Tab */}
              <div className={activeTab === 'details' ? 'block' : 'hidden'}>
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
                        {...register('title')}
                        placeholder="Enter task title"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.title
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      />
                      {errors.title && (
                        <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.title.message}
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
                            errors.status
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
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
                            errors.priority
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      {errors.priority && (
                        <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
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
                        {errors.due_date && (
                          <p className="text-red-500 text-sm mt-1">{errors.due_date.message}</p>
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
                            errors.project_id
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
                      {errors.project_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.project_id.message}</p>
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
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2 mb-4">
                      Task Description
                    </h2>
                    <div className="-mr-10 sm:-mr-16 md:-mr-24 lg:-mr-40 xl:-mr-56 2xl:-mr-80">
                      <RichTextEditor
                        value={watchedDescription || ''}
                        onChange={value => handleInputChange('description', value)}
                        placeholder="Task description..."
                        minHeight="200px"
                      />
                    </div>

                    {errors.description && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview Tab */}
              <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/50 pb-2">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Task Preview
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mx-auto max-w-3xl w-full">
                    {/* Task Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                          {watchedTitle || 'Task Title'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Priority: {watch('priority')} | Status: {watch('status')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm inline-block">
                          {watch('status')}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Due: {watch('due_date') ? getDateLabel(watch('due_date') || '') : 'Not set'}
                        </p>
                      </div>
                    </div>

                    {/* Task Content */}
                    <div className="prose dark:prose-invert max-w-none">
                      {watchedDescription ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: watchedDescription,
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          Task description will appear here...
                        </p>
                      )}
                    </div>

                    {/* Task Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          Project:{' '}
                          {watch('project_id') || 'Not assigned'}
                        </div>
                        <div>
                          Assigned to: {currentUser?.name || 'Current User'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {createTaskMutation.error && (
            <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to create task. Please try again.</span>
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
                {createTaskMutation.isSuccess && (
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

export default AddTask;