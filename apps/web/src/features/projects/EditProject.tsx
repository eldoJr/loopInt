import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Code,
  Check,
  Calendar,
  DollarSign,
  Tag,
  ChevronDown,
  AlertCircle,
  Star,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Slider } from '../../components/ui/Slider';
import { Toggle } from '../../components/ui/Toggle';
import CustomSelect from '../../components/ui/CustomSelect';
import { useProject, useUpdateProject } from '../../hooks/useProjects';

interface EditProjectProps {
  projectId: string;
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

const EditProject = ({
  projectId,
  onNavigateBack,
  onNavigateToProjects,
}: EditProjectProps) => {
  useTheme();
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const { data: project, isLoading } = useProject(projectId);
  const updateProjectMutation = useUpdateProject();
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(
    'left'
  );
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    deadline: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    progress: 0,
    budget: '',
    team_id: '',
    client_id: '',
    tags: [] as string[],
    color: '#3B82F6',
    is_favorite: false,
  });

  const [descriptionLength, setDescriptionLength] = useState(0);
  const maxDescriptionLength = 2000;

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.start_date &&
      formData.deadline &&
      new Date(formData.start_date) <= new Date(formData.deadline)
    );
  }, [formData.name, formData.start_date, formData.deadline]);

  useEffect(() => {
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        start_date: project.start_date
          ? format(new Date(project.start_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        deadline: project.deadline
          ? format(new Date(project.deadline), 'yyyy-MM-dd')
          : format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        progress: project.progress || 0,
        budget: project.budget?.toString() || '',
        team_id: project.team_id || '',
        client_id: project.client_id || '',
        tags: project.tags || [],
        color: project.color || '#3B82F6',
        is_favorite: project.is_favorite || false,
      });
      setDescriptionLength(project.description?.length || 0);
    }
  }, [project]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isFormValid) {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(fakeEvent);
        }
      }
      if (e.key === 'Escape') {
        onNavigateToProjects?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormValid, onNavigateToProjects]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (
      formData.start_date &&
      formData.deadline &&
      new Date(formData.start_date) > new Date(formData.deadline)
    ) {
      newErrors.deadline = 'Deadline must be after start date';
    }
    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget must be positive';
    }
    if (formData.description.length > maxDescriptionLength) {
      newErrors.description = `Description must be under ${maxDescriptionLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, maxDescriptionLength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status as 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled',
      priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent',
      start_date: formData.start_date,
      deadline: formData.deadline,
      progress: Number(formData.progress),
      budget: formData.budget?.trim() ? parseFloat(formData.budget) : undefined,
      team_id: formData.team_id.trim() ? formData.team_id.trim() : undefined,
      client_id: formData.client_id.trim() ? formData.client_id.trim() : undefined,
      is_favorite: formData.is_favorite,
      tags: formData.tags,
      color: formData.color,
    };

    updateProjectMutation.mutate(
      { id: projectId, data: projectData },
      {
        onSuccess: () => {
          setTimeout(() => onNavigateToProjects?.(), 1000);
        },
        onError: () => {
          setErrors({ submit: 'Failed to update project. Please try again.' });
        },
      }
    );
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      if (name === 'description') {
        setDescriptionLength(value.length);

        // Apply text styling to selected text if supported by the browser
        const textarea = e.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Store selection for potential formatting
        if (start !== end) {
          // Selection exists, could be used for formatting
          // (This is a placeholder for potential future enhancement)
        }
      }

      // Clear field-specific errors
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleToggleFavorite = () => {
    setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
  };

  const handleTagSelect = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));

    // Apply style to selected text if there's a selection
    const textarea = document.querySelector(
      'textarea[name="description"]'
    ) as HTMLTextAreaElement;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      // This is a placeholder for potential future enhancement with a more sophisticated rich text editor
      // For now, we're just toggling the global style state
    }
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const colorOptions = [
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#F59E0B',
    '#EF4444',
    '#06B6D4',
    '#84CC16',
    '#F97316',
  ];

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Projects', onClick: onNavigateToProjects },
    { label: 'Edit Project' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${
        showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Project
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNavigateToProjects}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || updateProjectMutation.isPending}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  isFormValid && !updateProjectMutation.isPending
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={14} />
                <span>{updateProjectMutation.isPending ? 'Updating...' : 'Update'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Section 1 - Basic Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Project Name *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.name
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Enter project name"
                  />
                  {errors.name && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Project Signature *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={currentUser?.name || ''}
                    readOnly
                    className="w-full bg-gray-100 dark:bg-gray-800/20 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Status *
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={[
                      'planning',
                      'active',
                      'on-hold',
                      'completed',
                      'cancelled',
                    ]}
                    value={formData.status}
                    onChange={value =>
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Priority *
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={['low', 'medium', 'high', 'urgent']}
                    value={formData.priority}
                    onChange={value =>
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Project Details */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Project Details
              </h2>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Start Date *
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Deadline
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Budget *
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Progress: {formData.progress}%
                </label>
                <div className="col-span-9">
                  <Slider
                    value={[formData.progress]}
                    onValueChange={(value: number[]) =>
                      setFormData(prev => ({ ...prev, progress: value[0] }))
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Team *
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <CustomSelect
                      options={['', 'Team 1', 'Team 2', 'Team 3']}
                      value={formData.team_id || 'Select a team...'}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          team_id: value === 'Select a team...' ? '' : value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Client *
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <CustomSelect
                      options={['', 'Client 1', 'Client 2', 'Client 3']}
                      value={formData.client_id || 'Select a client...'}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          client_id:
                            value === 'Select a client...' ? '' : value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 - Configuration */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Configuration
              </h2>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Tags *
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm min-h-[36px]"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1 flex-1">
                          {formData.tags.length > 0 ? (
                            formData.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs rounded border border-blue-200 dark:border-blue-500/30"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              Select tags...
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform flex-shrink-0 ${showTagDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showTagDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                        <div className="p-2 grid grid-cols-2 gap-2">
                          {tagOptions.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagSelect(tag)}
                              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                formData.tags.includes(tag)
                                  ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span>{tag}</span>
                              {formData.tags.includes(tag) && (
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

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Color *
                </label>
                <div className="col-span-9 flex space-x-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Favorite *
                </label>
                <div className="col-span-9">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className={`flex items-center space-x-2 px-3 py-1.5 w-full rounded-lg transition-colors text-sm ${
                      formData.is_favorite
                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700/50'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${formData.is_favorite ? 'fill-current' : ''}`}
                    />
                    <span>
                      {formData.is_favorite
                        ? 'Remove from Favorites'
                        : 'Mark as Favorite'}
                    </span>
                  </button>
                </div>
              </div>

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
                      rows={6}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-b-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-sm"
                      placeholder="Enter project description..."
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration:
                          `${textStyles.underline ? 'underline' : ''} ${textStyles.strikethrough ? 'line-through' : ''}`.trim(),
                        textAlign: textAlign,
                      }}
                    />

                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-3">
                      <span
                        className={`text-xs ${
                          descriptionLength > maxDescriptionLength * 0.9
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {descriptionLength}/{maxDescriptionLength} characters
                      </span>
                      <div className="flex items-center space-x-2">
                        {updateProjectMutation.isSuccess && (
                          <div className="flex items-center space-x-1 text-green-500 dark:text-green-400">
                            <Check size={14} />
                            <span className="text-xs">Saved</span>
                          </div>
                        )}
                        {errors.description && (
                          <div className="flex items-center space-x-1 text-red-500 dark:text-red-400">
                            <AlertCircle size={14} />
                            <span className="text-xs">
                              {errors.description}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {errors.submit && (
          <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
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
              {updateProjectMutation.isSuccess && (
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

export default EditProject;
