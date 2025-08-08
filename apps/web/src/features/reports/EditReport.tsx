import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Target,
  Users,
  TrendingUp,
  FileText,
  AlertCircle,
  Check,
  ChevronDown,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface EditReportProps {
  reportId: string;
  onNavigateBack?: () => void;
  onNavigateToReports?: () => void;
}

const reportTypes = [
  {
    value: 'analytics',
    label: 'Analytics Report',
    icon: TrendingUp,
    description: 'Performance metrics and data analysis',
  },
  {
    value: 'financial',
    label: 'Financial Report',
    icon: Target,
    description: 'Budget, expenses, and revenue tracking',
  },
  {
    value: 'project',
    label: 'Project Report',
    icon: FileText,
    description: 'Project status and milestone tracking',
  },
  {
    value: 'team',
    label: 'Team Report',
    icon: Users,
    description: 'Team productivity and performance',
  },
  {
    value: 'custom',
    label: 'Custom Report',
    icon: FileText,
    description: 'Build your own custom report',
  },
];

const scheduleOptions = [
  { value: '', label: 'No Schedule' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const tagOptions = [
  'performance',
  'analytics',
  'financial',
  'budget',
  'team',
  'productivity',
  'projects',
  'milestones',
  'quarterly',
  'monthly',
  'weekly',
  'daily',
];

const EditReport = ({
  reportId,
  onNavigateBack,
  onNavigateToReports,
}: EditReportProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
      visualization: 'charts',
    },
    settings: {
      autoGenerate: false,
      includeCharts: true,
      includeData: true,
      format: 'pdf',
    },
  });

  useEffect(() => {
    const userData =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      try {
        // Simulate loading existing report data
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data based on reportId
        const mockData = {
          title: 'Monthly Performance Report',
          type: 'analytics',
          description:
            'Comprehensive analysis of team performance and project metrics for the current month',
          status: 'published',
          schedule: 'monthly',
          tags: ['performance', 'monthly', 'analytics'],
          content: {
            sections: ['overview', 'metrics', 'trends'],
            dataSource: 'analytics_db',
            filters: { period: 'monthly' },
            visualization: 'charts',
          },
          settings: {
            autoGenerate: true,
            includeCharts: true,
            includeData: true,
            format: 'pdf',
          },
        };

        setFormData(mockData);
        setLoading(false);
        setTimeout(() => setShowForm(true), 200);
      } catch (error) {
        console.error('Error loading report:', error);
        setErrors({ load: 'Failed to load report data' });
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

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
    return (
      formData.title.trim().length > 0 &&
      formData.type &&
      formData.description.trim().length > 0
    );
  }, [formData.title, formData.type, formData.description]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Report title is required';
    if (!formData.type) newErrors.type = 'Report type is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (formData.description.length > 500)
      newErrors.description = 'Description must be under 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const reportData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        updated_at: new Date().toISOString(),
        updated_by: currentUser?.id || 'unknown',
      };

      console.log('Updating report:', reportData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating report:', error);
      setErrors({ submit: 'Failed to update report. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleTagSelect = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const handleSettingChange = (setting: string, value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [setting]: value },
    }));
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Reports', onClick: onNavigateToReports },
    { label: 'Edit Report' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-400 mb-2">
              Error Loading Report
            </h3>
            <p className="text-gray-400 mb-4">{errors.load}</p>
            <button
              onClick={onNavigateToReports}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Reports
            </button>
          </div>
        </div>
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

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Report
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Update your report settings and content
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNavigateToReports}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || saving}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isFormValid() && !saving
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Report Title *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.title
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="Enter report title"
                  />
                  {errors.title && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Report Type *
                </label>
                <div className="col-span-9">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {reportTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setFormData(prev => ({ ...prev, type: type.value }))
                          }
                          className={`p-3 rounded-lg border transition-all text-left ${
                            formData.type === type.value
                              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {type.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {type.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Status
                </label>
                <div className="col-span-4">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Schedule
                </label>
                <div className="col-span-4">
                  <select
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    {scheduleOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Tags
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                      className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span>
                          {formData.tags.length > 0
                            ? formData.tags.join(', ')
                            : 'Select tags...'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showTagDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        <div className="p-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {tagOptions.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTagSelect(tag)}
                              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                formData.tags.includes(tag)
                                  ? 'bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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

              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Description *
                </label>
                <div className="col-span-9">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none text-sm ${
                      errors.description
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                    placeholder="Describe what this report will contain..."
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-xs ${
                        formData.description.length > 450
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {formData.description.length}/500 characters
                    </span>
                    {errors.description && (
                      <div className="flex items-center text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Settings */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Report Settings
              </h2>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Output Format
                </label>
                <div className="col-span-9">
                  <div className="flex gap-2">
                    {['pdf', 'excel', 'html'].map(format => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleSettingChange('format', format)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.settings.format === format
                            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                            : 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Options
                </label>
                <div className="col-span-9 space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.includeCharts}
                      onChange={e =>
                        handleSettingChange('includeCharts', e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Include charts and visualizations
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.includeData}
                      onChange={e =>
                        handleSettingChange('includeData', e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Include raw data tables
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoGenerate}
                      onChange={e =>
                        handleSettingChange('autoGenerate', e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Auto-generate based on schedule
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {errors.submit && (
          <div className="mx-5 mb-5 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.submit}</span>
            </div>
          </div>
        )}

        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Ctrl+S to save</span>
              <span>•</span>
              <span>Press Esc to cancel</span>
            </div>
            <div className="flex items-center space-x-2">
              {isSaved && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
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

export default EditReport;
