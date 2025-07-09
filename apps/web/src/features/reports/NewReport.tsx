import { useState, useEffect, useCallback } from 'react';
import { Save, Calendar, Target, Users, TrendingUp, FileText, Clock, Repeat, AlertCircle, Check, ChevronDown, Tag } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface NewReportProps {
  onNavigateBack?: () => void;
  onNavigateToReports?: () => void;
}

const reportTypes = [
  { value: 'analytics', label: 'Analytics Report', icon: TrendingUp, description: 'Performance metrics and data analysis' },
  { value: 'financial', label: 'Financial Report', icon: Target, description: 'Budget, expenses, and revenue tracking' },
  { value: 'project', label: 'Project Report', icon: FileText, description: 'Project status and milestone tracking' },
  { value: 'team', label: 'Team Report', icon: Users, description: 'Team productivity and performance' },
  { value: 'custom', label: 'Custom Report', icon: FileText, description: 'Build your own custom report' }
];

const scheduleOptions = [
  { value: '', label: 'No Schedule' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' }
];

const tagOptions = [
  'performance', 'analytics', 'financial', 'budget', 'team', 'productivity',
  'projects', 'milestones', 'quarterly', 'monthly', 'weekly', 'daily'
];

const NewReport = ({ onNavigateBack, onNavigateToReports }: NewReportProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'analytics',
    description: '',
    status: 'draft',
    schedule: '',
    tags: [] as string[],
    content: {
      sections: [] as string[],
      dataSource: '',
      filters: {},
      visualization: 'charts'
    },
    settings: {
      autoGenerate: false,
      includeCharts: true,
      includeData: true,
      format: 'pdf'
    }
  });

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isFormValid()) {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(fakeEvent);
        }
      }
      if (e.key === 'Escape') {
        onNavigateToReports?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateToReports]);

  const isFormValid = useCallback(() => {
    return formData.title.trim().length > 0 && formData.type && formData.description.trim().length > 0;
  }, [formData.title, formData.type, formData.description]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Report title is required';
    if (!formData.type) newErrors.type = 'Report type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be under 500 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const reportData = {
        title: formData.title.trim(),
        type: formData.type,
        description: formData.description.trim(),
        status: formData.status,
        schedule: formData.schedule || null,
        tags: formData.tags,
        content: formData.content,
        settings: formData.settings,
        created_by: currentUser?.id || 'unknown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Creating report:', reportData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
      setTimeout(() => onNavigateToReports?.(), 1000);
    } catch (error) {
      console.error('Error creating report:', error);
      setErrors({ submit: 'Failed to create report. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleTagSelect = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value }
    }));
  };

  const selectedReportType = reportTypes.find(type => type.value === formData.type);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Reports', onClick: onNavigateToReports },
    { label: 'New Report' }
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
            <h1 className="text-2xl font-semibold text-white">Create New Report</h1>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onNavigateToReports}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!isFormValid() || saving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isFormValid() && !saving
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                <span>{saving ? 'Creating...' : 'Create Report'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Report Title *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.title 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Enter report title"
                  />
                  {errors.title && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Report Type *
                </label>
                <div className="col-span-9">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {reportTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            formData.type === type.value
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className="w-5 h-5" />
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                  Schedule
                </label>
                <div className="col-span-4">
                  <select
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {scheduleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                      className="w-full flex items-center justify-between bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                        <div className="p-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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

              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                  Description *
                </label>
                <div className="col-span-9">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.description 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-700/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Describe what this report will contain..."
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${
                      formData.description.length > 450 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {formData.description.length}/500 characters
                    </span>
                    {errors.description && (
                      <div className="flex items-center text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Report Settings
              </h2>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Output Format
                </label>
                <div className="col-span-9">
                  <div className="flex gap-3">
                    {['pdf', 'excel', 'html'].map(format => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleSettingChange('format', format)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.settings.format === format
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Options
                </label>
                <div className="col-span-9 space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.includeCharts}
                      onChange={(e) => handleSettingChange('includeCharts', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Include charts and visualizations</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.includeData}
                      onChange={(e) => handleSettingChange('includeData', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Include raw data tables</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoGenerate}
                      onChange={(e) => handleSettingChange('autoGenerate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Auto-generate based on schedule</span>
                  </label>
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
                  <span>Created</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReport;