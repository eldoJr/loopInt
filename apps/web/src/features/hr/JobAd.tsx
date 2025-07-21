import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Plus, Info, Check, Notebook, AlertCircle, Printer } from 'lucide-react';
import { format, parse } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

interface JobAdProps {
  onNavigateBack?: () => void;
}

interface FormData {
  jobName: string;
  status: string;
  referenceNumber: string;
  jobWebsite: string;
  startDate: string;
  endDate: string;
  remindMe: boolean;
  jobLink: string;
  hrProject: string;
  company: string;
  position: string;
  skills: string;
  location: string;
  jobContent: string;
}

type TabType = 'details' | 'preview';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const JobAd = ({ onNavigateBack }: JobAdProps) => {
  useTheme();
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const showConfirmation = (props: ConfirmationDialogProps) => {
    if (window.confirm(props.message)) {
      props.onConfirm();
    }
  };
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const maxContentLength = 9999;

  const statuses = [
    'Draft',
    'Published',
    'Closed',
    'Archived'
  ];

  const websites = [
    'Company Website',
    'LinkedIn',
    'Indeed',
    'Glassdoor',
    'Monster',
    'ZipRecruiter',
    'Other service'
  ];

  const companies = [
    'Choose customer',
    'Acme Inc',
    'TechCorp',
    'Global Industries',
    'Innovate Solutions',
    'Summit Enterprises',
    'Other'
  ];

  const positions = [
    'Position',
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'Marketing Specialist',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst',
    'Operations Manager',
    'Customer Support',
    'Other'
  ];

  const skills = [
    'Skills',
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'SQL',
    'AWS',
    'UI/UX',
    'Project Management',
    'Communication',
    'Leadership',
    'Other'
  ];

  const locations = [
    'Localizations',
    'Remote',
    'Hybrid',
    'On-site',
    'New York',
    'San Francisco',
    'London',
    'Berlin',
    'Tokyo',
    'Sydney',
    'Other'
  ];

  const hrProjects = [
    'Select HR project',
    'HR/2023/001',
    'HR/2023/002',
    'HR/2023/003',
    'HR/2023/004'
  ];

  const [formData, setFormData] = useState<FormData>({
    jobName: '',
    status: 'Draft',
    referenceNumber: 'HR/17/2025',
    jobWebsite: 'Other service',
    startDate: '',
    endDate: '',
    remindMe: true,
    jobLink: '',
    hrProject: 'Select HR project',
    company: 'Choose customer',
    position: 'Position',
    skills: 'Skills',
    location: 'Localizations',
    jobContent: ''
  });

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
        handleSubmit(fakeEvent);
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const handlePrint = useCallback(() => {
    if (printRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = printRef.current.innerHTML;
      
      // Create a print-optimized version with A4 styling
      document.body.innerHTML = `
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm 15mm;
            margin: 0 auto;
            background: white;
            color: black;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
          }
          @media print {
            .print-container {
              padding: 20mm 15mm;
            }
            html, body {
              width: 210mm;
              height: 297mm;
            }
          }
        </style>
        <div class="print-container">
          ${printContents}
        </div>
      `;
      
      setTimeout(() => {
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      }, 200);
    }
  }, []);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Parse the input date string (assuming MM/DD YYYY format)
      const parsedDate = parse(dateString, 'MM/dd yyyy', new Date());
      // Format the date in a more readable format
      return format(parsedDate, 'MMM d, yyyy');
    } catch {
      return dateString; // Return original string if parsing fails
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.jobName.trim()) newErrors.jobName = 'Job name is required';
    if (formData.status === 'Draft') newErrors.status = 'Please select a status';
    if (formData.company === 'Choose customer') newErrors.company = 'Please select a company';
    if (formData.position === 'Position') newErrors.position = 'Please select a position';
    if (formData.jobContent.length > maxContentLength) {
      newErrors.jobContent = `Content must be under ${maxContentLength} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (formData.jobName.trim() || formData.jobContent.trim()) {
      showConfirmation({
        title: 'Discard changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        cancelText: 'Continue editing',
        onConfirm: () => onNavigateBack?.()
      });
    } else {
      onNavigateBack?.();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      
      const formDataToSend = new FormData();
      
      // Add all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          formDataToSend.append(key, value.trim());
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, String(value));
        }
      });
      
      if (currentUser?.id) formDataToSend.append('createdBy', currentUser.id);
      
      const response = await fetch('http://localhost:3000/job-ads', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        console.log('Job ad created successfully');
        onNavigateBack?.();
      } else {
        let errorMessage = 'Failed to create job ad';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving job ad:', error);
      setErrors({ submit: 'Failed to save job ad. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setFormData(prev => ({ ...prev, status: 'Published' }));
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  const handleSaveAsTemplate = () => {
    // Implementation for saving as template
    console.log('Save as template');
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Human Resource', onClick: onNavigateBack },
    { label: 'New Job Ad' }
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
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Job Ad</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAsTemplate}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm flex items-center space-x-1"
              >
                <Notebook size={14} />
                <span>Save as template</span>
              </button>
              <button 
                onClick={handleSaveAndPublish}
                disabled={saving}
                className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center space-x-1"
              >
                <Check size={14} />
                <span>Save and Publish</span>
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  saving
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Check size={14} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700/50">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'details' 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                Job Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'preview' 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                Preview
              </button>
            </div>

            {/* Job Details Tab */}
            <div className={activeTab === 'details' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                  Job Advertisement Details
                </h2>
                
                {/* Job Name */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Name of job ad *
                  </label>
                  <div className="col-span-9">
                    <input
                      type="text"
                      value={formData.jobName}
                      onChange={(e) => handleInputChange('jobName', e.target.value)}
                      placeholder="Name of job ad"
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                        errors.jobName 
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                    />
                    {errors.jobName && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.jobName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Status *
                  </label>
                  <div className="col-span-4">
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.status 
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.status && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.status}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Reference number
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={formData.referenceNumber}
                        onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      />
                      <button
                        type="button"
                        className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job Website */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Job ad website
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select
                          value={formData.jobWebsite}
                          onChange={(e) => handleInputChange('jobWebsite', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          {websites.map((website) => (
                            <option key={website} value={website}>{website}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Start and End Date */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Publication dates
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.startDate ? format(parse(formData.startDate, 'MM/dd yyyy', new Date()), 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? format(new Date(e.target.value), 'MM/dd yyyy') : '';
                            handleInputChange('startDate', date);
                          }}
                          className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.endDate ? format(parse(formData.endDate, 'MM/dd yyyy', new Date()), 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? format(new Date(e.target.value), 'MM/dd yyyy') : '';
                            handleInputChange('endDate', date);
                          }}
                          className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remind Me */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('remindMe', !formData.remindMe)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          formData.remindMe ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        {formData.remindMe && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </button>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">Remind me</span>
                    </div>
                  </div>
                </div>

                {/* Job Link */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Job ad link
                  </label>
                  <div className="col-span-9">
                    <input
                      type="text"
                      value={formData.jobLink}
                      onChange={(e) => handleInputChange('jobLink', e.target.value)}
                      placeholder="Job ad link"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>

                {/* HR Project */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    HR project
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.hrProject}
                        onChange={(e) => handleInputChange('hrProject', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {hrProjects.map((project) => (
                          <option key={project} value={project}>{project}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Company *
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                            errors.company 
                              ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                              : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                          }`}
                        >
                          {companies.map((company) => (
                            <option key={company} value={company}>{company}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {errors.company && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.company}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
            {/* Section 2 - Job Details */}
              <div className="space-y-4 mt-6">
                
                {/* Position */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Position *
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.position 
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      >
                        {positions.map((position) => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.position && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.position}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Skills
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {skills.map((skill) => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Location
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Job Content */}
                <div className="grid grid-cols-12 gap-3 items-start">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                    Job ad content *
                  </label>
                  <div className="col-span-9">
                    <button
                      type="button"
                      className="mb-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add content from template
                    </button>
                    
                    <div className="-mr-10 sm:-mr-16 md:-mr-24 lg:-mr-40 xl:-mr-56 2xl:-mr-80">
                      <RichTextEditor
                        value={formData.jobContent}
                        onChange={(value) => handleInputChange('jobContent', value)}
                        placeholder="Job ad content..."
                        maxLength={maxContentLength}
                        showPreview={activeTab === 'preview'}
                      />
                    </div>
                    
                    {errors.jobContent && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.jobContent}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview Tab */}
            <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700/50 pb-2">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Job Advertisement Preview
                  </h2>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors text-sm"
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    <span>Print</span>
                  </button>
                </div>
                
                <div ref={printRef} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mx-auto max-w-3xl w-full" style={{ minHeight: '29.7cm', width: '21cm', maxWidth: '100%' }}>
                  {/* Header with logo and reference */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">LOGO</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.company !== 'Choose customer' ? formData.company : 'Company'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Reference</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formData.referenceNumber}</div>
                      {(formData.startDate || formData.endDate) && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Valid: {formData.startDate ? formatDate(formData.startDate) : ''}
                          {formData.startDate && formData.endDate ? ' - ' : ''}
                          {formData.endDate ? formatDate(formData.endDate) : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Job Title and Location */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formData.jobName || 'Job Title'}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <span>{formData.position !== 'Position' ? formData.position : 'Position'}</span>
                      <span>•</span>
                      <span>{formData.location !== 'Localizations' ? formData.location : 'Location'}</span>
                    </div>
                  </div>
                  
                  {/* Skills and Requirements */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills & Requirements</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.skills !== 'Skills' && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                          {formData.skills}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        {formData.position !== 'Position' ? formData.position : 'Job Position'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Job Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Description</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      {formData.jobContent ? (
                        <div dangerouslySetInnerHTML={{ __html: formData.jobContent.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">Job description will appear here...</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Application Process */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How to Apply</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Please submit your application through our website or send your resume to <span className="text-blue-600 dark:text-blue-400">careers@{formData.company !== 'Choose customer' ? formData.company.toLowerCase().replace(/\s+/g, '') : 'company'}.com</span>
                    </p>
                    {formData.jobLink && (
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        Application link: <a href={formData.jobLink} className="text-blue-600 dark:text-blue-400 underline">{formData.jobLink}</a>
                      </p>
                    )}
                  </div>
                  
                  {/* Signatures Section */}
                  <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="h-16 border-b border-gray-300 dark:border-gray-600 mb-2"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">HR Manager</p>
                      </div>
                      <div>
                        <div className="h-16 border-b border-gray-300 dark:border-gray-600 mb-2"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Department Head</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} {formData.company !== 'Choose customer' ? formData.company : 'Company'} - All Rights Reserved</p>
                  </div>
                </div>
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
            <div>
              Your session will expire in: <span className="font-medium">55:11</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAd;