import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  DollarSign,
  Tag,
  ChevronDown,
  Check,
  Star,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Slider } from '../../components/ui/Slider';
import { useCreateProject } from '../../hooks/useProjects';
import { projectSchema, type ProjectFormData } from '../../schemas/projectSchema';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';

interface NewProjectProps {
  onNavigateBack?: () => void;
  onNavigateToProjects?: () => void;
}

const tagOptions = [
  'onboarding',
  'automation',
  'AI',
  'crm',
  'task-manager',
  'marketing',
  'sales',
  'support',
];

const NewProject = ({
  onNavigateBack,
  onNavigateToProjects,
}: NewProjectProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const createProjectMutation = useCreateProject();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      status: 'planning' as const,
      priority: 'medium' as const,
      start_date: format(new Date(), 'yyyy-MM-dd'),
      deadline: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      progress: 0,
      tags: [],
      color: '#3B82F6',
      is_favorite: false,
    },
  });
  
  const watchedTags = watch('tags');
  const watchedDescription = watch('description');

  useEffect(() => {
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isValid) {
          handleSubmit(onSubmit)();
        }
      }
      if (e.key === 'Escape') {
        onNavigateToProjects?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isValid, onNavigateToProjects, handleSubmit]);

  const onSubmit = (data: ProjectFormData) => {
    const projectData = {
      ...data,
      created_by: currentUser?.id,
    };

    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        setTimeout(() => onNavigateToProjects?.(), 1000);
      },
    });
  };

  const handleToggleFavorite = () => {
    setValue('is_favorite', !watch('is_favorite'));
  };

  const handleTagSelect = (tag: string) => {
    const currentTags = watchedTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setValue('tags', newTags);
  };



  const colorOptions = [
    '#f97316', // tech-orange-500
    '#a855f7', // tech-purple-500
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#EF4444', // red-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F59E0B', // amber-500
  ];

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Projects', onClick: onNavigateToProjects },
    { label: 'New Project' },
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
        className={`transition-all duration-500 ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Sticky Breadcrumb */}
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="mt-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm transition-all duration-300">
          <div className="sticky top-14 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Project
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onNavigateToProjects}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || createProjectMutation.isPending}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    isValid && !createProjectMutation.isPending
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={14} />
                  <span>{createProjectMutation.isPending ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
            {/* Section 1 - Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
              </div>
              
              {/* Project Name */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Project Name *
                </label>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter project name"
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.name
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-orange-500/50'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Project Signature */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Project Signature *
                </label>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    value={currentUser?.name || ''}
                    readOnly
                    className="w-full bg-gray-100 dark:bg-gray-800/20 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              {/* Status & Priority */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-start">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right sm:pt-2">
                  Status & Priority *
                </label>
                <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                  <div className="flex-1 relative">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Status</label>
                    <select
                      {...register('status')}
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                        errors.status
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-orange-500/50'
                      }`}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                    <select
                      {...register('priority')}
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                        errors.priority
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-purple-500/50'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                {(errors.status || errors.priority) && (
                  <div className="sm:col-span-9 sm:col-start-4">
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status?.message || errors.priority?.message}
                    </p>
                  </div>
                )}
              </div>


            </div>

            {/* Section 2 - Project Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Project Details
                </h2>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-start">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right sm:pt-2">
                  Project Duration *
                </label>
                <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register('start_date')}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                    />
                  </div>
                  <span className="hidden sm:block text-gray-500 dark:text-gray-400 mt-6">-</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      {...register('deadline')}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                    />
                  </div>
                </div>
                {(errors.start_date || errors.deadline) && (
                  <div className="sm:col-span-9 sm:col-start-4">
                    <div className="text-red-500 text-sm mt-1">
                      {errors.start_date?.message || errors.deadline?.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Budget
                </label>
                <div className="sm:col-span-9">
                  <div className="relative w-full sm:w-48">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      {...register('budget', { valueAsNumber: true })}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Progress: {watch('progress')}%
                </label>
                <div className="sm:col-span-9">
                  <Slider
                    value={[watch('progress')]}
                    onValueChange={(value: number[]) => setValue('progress', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Team & Client */}
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-start">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right sm:pt-2">
                  Team & Client *
                </label>
                <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                  <div className="flex-1 relative">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Team</label>
                    <select
                      {...register('team_id')}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option value="">Select a team...</option>
                      <option value="Team 1">Team 1</option>
                      <option value="Team 2">Team 2</option>
                      <option value="Team 3">Team 3</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Client</label>
                    <select
                      {...register('client_id')}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    >
                      <option value="">Select a client...</option>
                      <option value="Client 1">Client 1</option>
                      <option value="Client 2">Client 2</option>
                      <option value="Client 3">Client 3</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Tags *
                </label>
                <div className="sm:col-span-9">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="truncate">
                          {watchedTags && watchedTags.length > 0
                            ? watchedTags.join(', ')
                            : 'Select tags...'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform flex-shrink-0 ${showTagDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showTagDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tagOptions.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagSelect(tag)}
                              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                watchedTags?.includes(tag)
                                  ? 'bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-400'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span>{tag}</span>
                              {watchedTags?.includes(tag) && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Color *
                </label>
                <div className="sm:col-span-9 flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        watch('color') === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                  Favorite
                </label>
                <div className="sm:col-span-9">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto ${
                      watch('is_favorite')
                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700/50'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${watch('is_favorite') ? 'fill-current' : ''}`}
                    />
                    <span>
                      {watch('is_favorite')
                        ? 'Remove from Favorites'
                        : 'Mark as Favorite'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Project Description
                  </h2>
                </div>
                <div className="-mr-10 sm:-mr-16 md:-mr-24 lg:-mr-40 xl:-mr-56 2xl:-mr-80">
                  <RichTextEditor
                    value={watchedDescription}
                    onChange={(value) => setValue('description', value)}
                    error={errors.description?.message}
                    placeholder="Enter project description..."
                    minHeight="200px"
                  />
                </div>
              </div>
              </div>
            </div>
          </form>

          {createProjectMutation.isError && (
            <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <span>Failed to save project. Please try again.</span>
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
                {createProjectMutation.isSuccess && (
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

export default NewProject;
