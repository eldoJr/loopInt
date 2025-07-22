import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Plus, Check, Upload, AlertCircle } from 'lucide-react';
import { format, parse } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

interface NewDocumentProps {
  onNavigateBack?: () => void;
  onNavigateToDocuments?: () => void;
}

interface FormData {
  documentName: string;
  documentType: string;
  status: string;
  startDate: string;
  endDate: string;
  project: string;
  contractor: string;
  coworker: string;
  documentContent: string;
}

type TabType = 'details' | 'preview';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const NewDocument = ({ onNavigateBack, onNavigateToDocuments }: NewDocumentProps) => {
  useTheme();
  
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

  const documentTypes = [
    'Contract',
    'Invoice',
    'Report',
    'Proposal',
    'Agreement',
    'Other'
  ];

  const projects = [
    'Choose project',
    'Project A',
    'Project B',
    'Project C'
  ];

  const contractors = [
    'Choose contractor',
    'Contractor A',
    'Contractor B',
    'Contractor C'
  ];

  const coworkers = [
    'Choose coworker',
    'John Doe',
    'Jane Smith',
    'Alex Johnson'
  ];

  const [formData, setFormData] = useState<FormData>({
    documentName: '',
    documentType: 'Contract',
    status: 'New',
    startDate: '07/22/2025',
    endDate: '',
    project: 'Choose project',
    contractor: 'Choose contractor',
    coworker: 'Choose coworker',
    documentContent: ''
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.documentName.trim()) newErrors.documentName = 'Document name is required';
    if (formData.project === 'Choose project') newErrors.project = 'Please select a project';
    if (formData.documentContent.length > maxContentLength) {
      newErrors.documentContent = `Content must be under ${maxContentLength} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (formData.documentName.trim() || formData.documentContent.trim()) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Document created successfully', formData);
      if (onNavigateToDocuments) {
        onNavigateToDocuments();
      } else if (onNavigateBack) {
        onNavigateBack();
      }
    } catch (error) {
      console.error('Error saving document:', error);
      setErrors({ submit: 'Failed to save document. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Documents', onClick: onNavigateToDocuments },
    { label: 'New Document' }
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Document</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
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
                Document Details
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

            {/* Document Details Tab */}
            <div className={activeTab === 'details' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                  Document Information
                </h2>
                
                {/* Document Name */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Document name *
                  </label>
                  <div className="col-span-9">
                    <input
                      type="text"
                      value={formData.documentName}
                      onChange={(e) => handleInputChange('documentName', e.target.value)}
                      placeholder="Document name"
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                        errors.documentName 
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                    />
                    {errors.documentName && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.documentName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Type */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Document type *
                  </label>
                  <div className="col-span-4">
                    <div className="relative">
                      <select
                        value={formData.documentType}
                        onChange={(e) => handleInputChange('documentType', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Status
                  </label>
                  <div className="col-span-4">
                    <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm inline-block">
                      {formData.status}
                    </div>
                  </div>
                </div>

                {/* Time of preparing */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Time of preparing *
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.startDate ? format(parse(formData.startDate, 'MM/dd/yyyy', new Date()), 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? format(new Date(e.target.value), 'MM/dd/yyyy') : '';
                            handleInputChange('startDate', date);
                          }}
                          className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.endDate ? format(parse(formData.endDate, 'MM/dd/yyyy', new Date()), 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? format(new Date(e.target.value), 'MM/dd/yyyy') : '';
                            handleInputChange('endDate', date);
                          }}
                          className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Project *
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.project}
                        onChange={(e) => handleInputChange('project', e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.project 
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      >
                        {projects.map((project) => (
                          <option key={project} value={project}>{project}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                    {errors.project && (
                      <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.project}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contractor */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Contractor
                  </label>
                  <div className="col-span-9">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <select
                          value={formData.contractor}
                          onChange={(e) => handleInputChange('contractor', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          {contractors.map((contractor) => (
                            <option key={contractor} value={contractor}>{contractor}</option>
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
                  </div>
                </div>

                {/* Coworker */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Coworker
                  </label>
                  <div className="col-span-6">
                    <div className="relative">
                      <select
                        value={formData.coworker}
                        onChange={(e) => handleInputChange('coworker', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {coworkers.map((coworker) => (
                          <option key={coworker} value={coworker}>{coworker}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="mt-8">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2 mb-4">
                    Document Content
                  </h2>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm flex items-center space-x-1"
                    >
                      <Upload size={14} />
                      <span>Import</span>
                    </button>
                  </div>
                  
                  <div className="-mr-10 sm:-mr-16 md:-mr-24 lg:-mr-40 xl:-mr-56 2xl:-mr-80">
                    <RichTextEditor
                      value={formData.documentContent}
                      onChange={(value) => handleInputChange('documentContent', value)}
                      placeholder="Document content..."
                      maxLength={maxContentLength}
                      showPreview={activeTab === 'preview'}
                    />
                  </div>
                  
                  {errors.documentContent && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.documentContent}
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
                    Document Preview
                  </h2>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mx-auto max-w-3xl w-full">
                  {/* Document Header */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {formData.documentName || 'Document Title'}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Type: {formData.documentType}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm inline-block">
                        {formData.status}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Created: {formData.startDate}
                      </p>
                    </div>
                  </div>
                  
                  {/* Document Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    {formData.documentContent ? (
                      <div dangerouslySetInnerHTML={{ __html: formData.documentContent.replace(/\n/g, '<br />') }} />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">Document content will appear here...</p>
                    )}
                  </div>
                  
                  {/* Document Footer */}
                  <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        Project: {formData.project !== 'Choose project' ? formData.project : 'Not specified'}
                      </div>
                      <div>
                        {formData.contractor !== 'Choose contractor' && (
                          <span>Contractor: {formData.contractor}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDocument;