import { useState, useEffect, useCallback, useMemo } from 'react';
import { Save, Sparkles, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Code, Check, Calendar, DollarSign, Tag, ChevronDown, AlertCircle, Star } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Slider } from '../../components/ui/Slider';
import { Toggle } from '../../components/ui/Toggle';

interface NewProjectProps {
  onNavigateBack?: () => void;
  onNavigateToProjects?: () => void;
}

const tagOptions = [
  'onboarding', 'automation', 'AI', 'crm', 
  'task-manager', 'marketing', 'sales', 'support'
];

const NewProject = ({ onNavigateBack, onNavigateToProjects }: NewProjectProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
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
    is_favorite: false
  });

  const [descriptionLength, setDescriptionLength] = useState(0);
  const maxDescriptionLength = 2000;

  const isFormValid = useMemo(() => {
    return formData.name.trim().length > 0 && 
           formData.start_date && 
           formData.deadline && 
           new Date(formData.start_date) <= new Date(formData.deadline);
  }, [formData.name, formData.start_date, formData.deadline]);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
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
    if (formData.start_date && formData.deadline && new Date(formData.start_date) > new Date(formData.deadline)) {
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
    
    setSaving(true);
    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date,
        deadline: formData.deadline,
        progress: Number(formData.progress),
        budget: formData.budget?.trim() ? parseFloat(formData.budget) : null,
        team_id: formData.team_id.trim() || null,
        client_id: formData.client_id.trim() || null,
        created_by: currentUser?.id,
        is_favorite: formData.is_favorite,
        tags: formData.tags,
        color: formData.color
      };
      
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => onNavigateToProjects?.(), 1000);
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      setDescriptionLength(value.length);
    }
    
    // Clear field-specific errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleToggleFavorite = () => {
    setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
  };

  const handleTagSelect = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ];

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Projects', onClick: onNavigateToProjects },
    { label: 'New Project' }
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
            <h1 className="text-2xl font-semibold text-white">New Project</h1>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30">
                <Sparkles size={16} />
                <span>AI Task Generator</span>
              </button>
              <button 
                onClick={onNavigateToProjects}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                Cancel
              </button>

              <button 
                onClick={handleSubmit}
                disabled={!isFormValid || saving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isFormValid && !saving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6 max-w-4xl mx-auto ml-auto">
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Project Name *
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                      : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                  }`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <div className="flex items-center mt-1 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Project Signature
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  value={currentUser?.name || ''}
                  readOnly
                  className="w-full bg-gray-800/20 border border-gray-700/50 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
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
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Priority
              </label>
              <div className="col-span-4">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Start Date
              </label>
              <div className="col-span-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                Deadline
              </label>
              <div className="col-span-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Budget
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-48 bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Progress: {formData.progress}%
              </label>
              <div className="col-span-9">
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Team ID
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  placeholder="Enter team ID (optional)"
                  className="w-64 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Client ID
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  placeholder="Enter client ID (optional)"
                  className="w-64 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Tags
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    className="w-auto flex items-center justify-between bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span>
                        {formData.tags.length > 0 
                          ? formData.tags.join(', ') 
                          : 'Select tags...'}
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showTagDropdown && (
                    <div className="absolute z-10 mt-1 w-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                      <div className="p-2 grid grid-cols-2 gap-2">
                        {tagOptions.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagSelect(tag)}
                            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                              formData.tags.includes(tag)
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-gray-300 hover:bg-gray-700'
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

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Color
              </label>
              <div className="col-span-9 flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                Favorite
              </label>
              <div className="col-span-9">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-2 px-4 py-3 w-full rounded-lg transition-colors ${
                    formData.is_favorite 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                  }`}
                >
                  <Star className={`w-5 h-5 ${formData.is_favorite ? 'fill-current' : ''}`} />
                  <span>{formData.is_favorite ? 'Remove from Favorites' : 'Mark as Favorite'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-start">
              <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                Description
              </label>
              <div className="col-span-9">
                  <div className="flex items-center space-x-1 p-2 bg-gray-800/30 border border-gray-700/50 rounded-t-lg">
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
                    
                    <div className="h-6 w-px bg-gray-600 mx-1" />
                    
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
                    
                    <div className="h-6 w-px bg-gray-600 mx-1" />
                    
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
                      rows={8}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-b-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                      placeholder="Enter project description..."
                    />
                    
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-4">
                      <span className={`text-xs ${
                        descriptionLength > maxDescriptionLength * 0.9 
                          ? 'text-red-400' 
                          : 'text-gray-400'
                      }`}>
                        {descriptionLength}/{maxDescriptionLength} characters
                      </span>
                      <div className="flex items-center space-x-2">
                        {isSaved && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Check size={14} />
                            <span className="text-xs">Saved</span>
                          </div>
                        )}
                        {errors.description && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <AlertCircle size={14} />
                            <span className="text-xs">{errors.description}</span>
                          </div>
                        )}
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

export default NewProject;