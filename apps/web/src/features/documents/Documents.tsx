import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Filter,
  Play,
  HelpCircle,
  MessageCircle,
  FileText,
  Folder,
  Search,
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface DocumentsProps {
  onNavigateBack?: () => void;
  onNavigateToNewDocument?: () => void;
}

const Documents = ({
  onNavigateBack,
  onNavigateToNewDocument,
}: DocumentsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    project: '',
    status: '',
  });
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilter = (field: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Documents' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={`transition-all duration-500 ${
            showContent
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800/70">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activeTab === 'documents'
                      ? 'Documents'
                      : 'Document Templates'}
                  </h1>
                </div>
                <button
                  onClick={onNavigateToNewDocument}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 flex items-center gap-1.5 text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {activeTab === 'documents' ? 'New Document' : 'New Template'}
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800/70 px-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'documents'
                        ? 'Document name'
                        : 'Template name'
                    }
                    value={filters.name}
                    onChange={e => handleFilterChange('name', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.name && (
                    <button
                      onClick={() => clearFilter('name')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Document type"
                    value={filters.type}
                    onChange={e => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.type && (
                    <button
                      onClick={() => clearFilter('type')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Project"
                    value={filters.project}
                    onChange={e =>
                      handleFilterChange('project', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.project && (
                    <button
                      onClick={() => clearFilter('project')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Status"
                      value={filters.status}
                      onChange={e =>
                        handleFilterChange('status', e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    {filters.status && (
                      <button
                        onClick={() => clearFilter('status')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-900/70 px-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 ${
                    activeTab === 'documents'
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Documents
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 ${
                    activeTab === 'templates'
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5" />
                    Templates
                  </div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {activeTab === 'documents' ? (
              <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-4xl">
                  {/* Illustration */}
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 relative">
                      {/* Blue circular background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full transform rotate-12"></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-20 h-20 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 max-w-md text-center md:text-left">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      No documents yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                      Create your first document to start organizing your
                      project files. You can use templates to speed up the
                      process.
                    </p>

                    <button
                      onClick={onNavigateToNewDocument}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 text-sm font-medium mb-6 mx-auto md:mx-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create first document
                    </button>

                    {/* Help Links */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400">
                        <Play className="w-3.5 h-3.5" />
                        Watch tutorial
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Help Center
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900/30">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 max-w-4xl">
                  {/* Illustration */}
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 relative">
                      {/* Green circular background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-full transform rotate-12"></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Folder className="w-20 h-20 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 max-w-md text-center md:text-left">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      No templates available
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                      Create reusable templates for your documents to save time
                      and maintain consistency across your projects.
                    </p>

                    <button
                      onClick={onNavigateToNewDocument}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2 text-sm font-medium mb-6 mx-auto md:mx-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create first template
                    </button>

                    {/* Help Links */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <button className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400">
                        <Search className="w-3.5 h-3.5" />
                        Browse examples
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Get assistance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
