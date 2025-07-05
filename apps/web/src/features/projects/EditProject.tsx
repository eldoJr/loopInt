import { useState, useEffect } from 'react';
import { Save, X, Sparkles, Bold, Italic, Underline, Strikethrough, List, AlignLeft, Link, Code, Check, Calendar, DollarSign, Flag, Users, Palette } from 'lucide-react';
import { format } from 'date-fns';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EditProjectProps {
  projectId: string;
  onNavigateBack?: () => void;
  onNavigateToProjects?: () => void;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  start_date?: string;
  deadline?: string;
  progress: number;
  budget?: number;
  tags: string[];
  color: string;
}

const EditProject = ({ projectId, onNavigateBack, onNavigateToProjects }: EditProjectProps) => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    deadline: '',
    progress: 0,
    budget: '',
    tags: '',
    color: '#3B82F6'
  });

  const [descriptionLength, setDescriptionLength] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${projectId}`);
        if (response.ok) {
          const projectData = await response.json();
          setProject(projectData);
          setFormData({
            name: projectData.name || '',
            description: projectData.description || '',
            status: projectData.status || 'planning',
            priority: projectData.priority || 'medium',
            start_date: projectData.start_date || '',
            deadline: projectData.deadline || '',
            progress: projectData.progress || 0,
            budget: projectData.budget?.toString() || '',
            tags: projectData.tags?.join(', ') || '',
            color: projectData.color || '#3B82F6'
          });
          setDescriptionLength(projectData.description?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

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
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        progress: parseInt(formData.progress.toString())
      };
      
      const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => onNavigateToProjects?.(), 1000);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      setDescriptionLength(value.length);
    }
  };

  const handleDescriptionFormat = (format: string) => {
    console.log('Format:', format);
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
  ];

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Projects', onClick: onNavigateToProjects },
    { label: 'Edit Project' }
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Edit Project</h1>
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Project Name */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                Project Name *
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Enter project name"
                />
              </div>
            </div>

            {/* Status & Priority */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                Status & Priority
              </label>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                <Calendar className="w-4 h-4 inline mr-1" />
                Dates
              </label>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Budget & Progress */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Budget & Progress
              </label>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Project budget"
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="Progress %"
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                Tags
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags separated by commas"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Color */}
            <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300">
                <Palette className="w-4 h-4 inline mr-1" />
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

            {/* Description */}
            <div className="col-span-12 grid grid-cols-12 gap-4">
              <label className="col-span-3 text-right text-sm font-medium text-gray-300 pt-2">
                Description
              </label>
              <div className="col-span-9">
                {/* Toolbar */}
                <div className="flex items-center space-x-1 p-2 bg-gray-800/30 border border-gray-700/50 rounded-t-lg border-b-0">
                  {[
                    { icon: Bold, action: 'bold' },
                    { icon: Italic, action: 'italic' },
                    { icon: Underline, action: 'underline' },
                    { icon: Strikethrough, action: 'strikethrough' },
                    { icon: List, action: 'list' },
                    { icon: AlignLeft, action: 'align' },
                    { icon: Link, action: 'link' },
                    { icon: Code, action: 'code' }
                  ].map(({ icon: Icon, action }) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleDescriptionFormat(action)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-colors"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                
                {/* Text Area */}
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-b-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                    placeholder="Enter project description..."
                  />
                  
                  {/* Footer */}
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

export default EditProject;