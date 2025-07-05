import { useState, useEffect } from 'react';
import { Save, Sparkles, Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Code, Check, Calendar, DollarSign, Tag, ChevronDown } from 'lucide-react';
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
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        progress: Number(formData.progress),
        created_by: currentUser?.id,
        team_id: formData.team_id || null,
        client_id: formData.client_id || null
      };
      
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => onNavigateToProjects?.(), 1000);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      setDescriptionLength(value.length);
    }
  };

  const handleToggleFavorite = () => {
    setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
  };

  const handleTagSelect = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

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
                type="button"
                className="px-4 py-2 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/30 transition-colors border border-orange-500/30"
              >
                Edit
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-6 max-w-3xl mx-auto">
            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Project Signature
              </label>
              <input
                type="text"
                value={currentUser?.name || ''}
                readOnly
                className="flex-1 bg-gray-800/20 border border-gray-700/50 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="col-span-12 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="col-span-12 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                  Start Date
                </label>
                <div className="relative flex-1">
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
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                  Deadline
                </label>
                <div className="relative flex-1">
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

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Budget
              </label>
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Progress: {formData.progress}%
              </label>
              <div className="flex-1">
                <Slider
                  value={[formData.progress]}
                  onValueChange={(value: number[]) => setFormData(prev => ({ ...prev, progress: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Team ID (optional)
              </label>
              <input
                type="text"
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                placeholder="Enter team ID"
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Client ID (optional)
              </label>
              <input
                type="text"
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                placeholder="Enter client ID"
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Tags
              </label>
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="w-full flex items-center justify-between bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
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

            <div className="col-span-12 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap">
                Color
              </label>
              <div className="flex space-x-2 flex-1">
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

            <div className="col-span-12">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`flex items-center space-x-2 px-4 py-3 w-full rounded-lg transition-colors ${
                  formData.is_favorite 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={formData.is_favorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span>Mark as Favorite</span>
              </button>
            </div>

            <div className="col-span-12 flex gap-4">
              <label className="text-sm font-medium text-gray-300 whitespace-nowrap self-start mt-2">
                Description
              </label>
              <div className="flex-1">
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
                    <span className="text-xs text-gray-400">
                      {descriptionLength} characters
                    </span>
                    {isSaved && (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Check size={14} />
                        <span className="text-xs">Saved</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;