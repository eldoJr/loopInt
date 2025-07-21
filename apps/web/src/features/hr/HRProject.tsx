import { useState, useEffect } from 'react';
import { Plus, X, Filter, Play, HelpCircle, MessageCircle } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface HRProjectProps {
  onNavigateBack?: () => void;
  onNavigateToJobAd?: () => void;
}

const HRProject = ({ onNavigateBack, onNavigateToJobAd }: HRProjectProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    project: '',
    reference: ''
  });
  const [activeTab, setActiveTab] = useState('job-ads');

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
      [field]: value
    }));
  };

  const clearFilter = (field: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Human Resources'},
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800/70">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Job ads</h1>
                </div>
                <button 
                  onClick={onNavigateToJobAd}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New job ad
                </button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800/70 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name of job ad"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.name && (
                    <button 
                      onClick={() => clearFilter('name')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Position"
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.position && (
                    <button 
                      onClick={() => clearFilter('position')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Project"
                    value={filters.project}
                    onChange={(e) => handleFilterChange('project', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {filters.project && (
                    <button 
                      onClick={() => clearFilter('project')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Reference number"
                      value={filters.reference}
                      onChange={(e) => handleFilterChange('reference', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    {filters.reference && (
                      <button 
                        onClick={() => clearFilter('reference')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-900/70 px-6">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('job-ads')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'job-ads' 
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    Job ads
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === 'templates' 
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    Job ad templates
                  </div>
                </button>
              </div>
            </div>

            {/* Empty State Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-gray-50 dark:bg-gray-900/30">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl">
                {/* Illustration */}
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 relative">
                    {/* Yellow circular background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full transform rotate-12"></div>
                    
                    {/* Person illustration */}
                    <div className="absolute inset-8 flex items-center justify-center">
                      <div className="relative">
                        {/* Laptop */}
                        <div className="w-24 h-16 bg-gray-300 rounded-lg mb-4 relative">
                          <div className="w-20 h-12 bg-gray-800 rounded-sm absolute top-1 left-2"></div>
                          <div className="w-1 h-1 bg-white rounded-full absolute top-2 left-3"></div>
                        </div>
                        
                        {/* Person body */}
                        <div className="w-32 h-40 relative">
                          {/* Head */}
                          <div className="w-16 h-16 bg-pink-200 rounded-full absolute top-0 left-8 border-4 border-white"></div>
                          
                          {/* Hair */}
                          <div className="w-12 h-8 bg-amber-800 rounded-t-full absolute -top-2 left-10"></div>
                          
                          {/* Glasses */}
                          <div className="absolute top-4 left-10 w-8 h-4 flex items-center justify-center">
                            <div className="w-6 h-3 border-2 border-gray-800 rounded-sm bg-transparent"></div>
                          </div>
                          
                          {/* Body */}
                          <div className="w-20 h-24 bg-blue-300 rounded-lg absolute top-14 left-6">
                            {/* Shirt buttons */}
                            <div className="flex flex-col items-center gap-1 mt-2">
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Arms */}
                          <div className="w-6 h-12 bg-blue-300 rounded-lg absolute top-16 left-0 transform -rotate-12"></div>
                          <div className="w-6 h-12 bg-blue-300 rounded-lg absolute top-16 right-0 transform rotate-45">
                            {/* OK hand gesture */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-200 rounded-full">
                              <div className="absolute top-1 left-1 w-1 h-1 bg-pink-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 max-w-lg text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Here you will find a list of <span className="text-yellow-500">job ads</span> related to certain HR projects
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                    When creating a job ad you can use your previously saved templates.
                  </p>
                  
                  <button 
                    onClick={onNavigateToJobAd}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 flex items-center gap-2 text-lg font-medium mb-8 mx-auto md:mx-0"
                  >
                    <span>→</span>
                    Create first job ad
                  </button>

                  {/* Help Links */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <button className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                      <Play className="w-4 h-4" />
                      Watch the video
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                      <HelpCircle className="w-4 h-4" />
                      Help Center
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                      <MessageCircle className="w-4 h-4" />
                      Contact us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRProject;