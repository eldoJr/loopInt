import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, FileText, Calendar, TrendingUp, Users, Target } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DashboardStatCard from '../../components/ui/DashboardStatCard';

interface ReportsProps {
  onNavigateBack?: () => void;
  onNavigateToNewReport?: () => void;
  onNavigateToEditReport?: (id: string) => void;
  onNavigateToViewReport?: (id: string) => void;
}

interface Report {
  id: string;
  title: string;
  type: 'analytics' | 'financial' | 'project' | 'team' | 'custom';
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

const Reports = ({ onNavigateBack, onNavigateToNewReport, onNavigateToEditReport, onNavigateToViewReport }: ReportsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Monthly Performance Report',
      type: 'analytics',
      description: 'Comprehensive analysis of team performance and project metrics',
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      created_by: 'John Doe',
      status: 'published',
      tags: ['performance', 'monthly', 'analytics'],
      schedule: 'monthly'
    },
    {
      id: '2',
      title: 'Q1 Financial Summary',
      type: 'financial',
      description: 'Quarterly financial overview with budget analysis',
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      created_by: 'Jane Smith',
      status: 'published',
      tags: ['financial', 'quarterly', 'budget'],
      schedule: 'quarterly'
    },
    {
      id: '3',
      title: 'Project Status Dashboard',
      type: 'project',
      description: 'Real-time project tracking and milestone analysis',
      created_at: '2024-01-12',
      updated_at: '2024-01-22',
      created_by: 'Mike Johnson',
      status: 'draft',
      tags: ['projects', 'status', 'milestones']
    },
    {
      id: '4',
      title: 'Team Productivity Analysis',
      type: 'team',
      description: 'Weekly team productivity metrics and insights',
      created_at: '2024-01-08',
      updated_at: '2024-01-21',
      created_by: 'Sarah Wilson',
      status: 'published',
      tags: ['team', 'productivity', 'weekly'],
      schedule: 'weekly'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analytics': return TrendingUp;
      case 'financial': return Target;
      case 'project': return FileText;
      case 'team': return Users;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      case 'draft': return 'text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-yellow-500/10 border-amber-200 dark:border-yellow-500/20';
      case 'archived': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20';
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Reports' }
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <DashboardStatCard
              title="Total Reports"
              value={reports.length.toString()}
              icon={FileText}
              color="text-blue-500 dark:text-blue-400"
            />
            <DashboardStatCard
              title="Published"
              value={reports.filter(r => r.status === 'published').length.toString()}
              icon={TrendingUp}
              color="text-green-500 dark:text-green-400"
            />
            <DashboardStatCard
              title="Drafts"
              value={reports.filter(r => r.status === 'draft').length.toString()}
              icon={Edit}
              color="text-amber-500 dark:text-yellow-400"
            />
            <DashboardStatCard
              title="Scheduled"
              value={reports.filter(r => r.schedule).length.toString()}
              icon={Calendar}
              color="text-purple-500 dark:text-purple-400"
            />
          </div>

          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Generate and manage your reports</p>
                </div>
                <button
                  onClick={onNavigateToNewReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  New Report
                </button>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Types</option>
                  <option value="analytics">Analytics</option>
                  <option value="financial">Financial</option>
                  <option value="project">Project</option>
                  <option value="team">Team</option>
                  <option value="custom">Custom</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            <div className="p-5">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 mb-2">No reports found</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">Create your first report to get started</p>
                  <button
                    onClick={onNavigateToNewReport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Create Report
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredReports.map((report) => {
                    const TypeIcon = getTypeIcon(report.type);
                    return (
                      <div
                        key={report.id}
                        className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-800/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {report.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{report.type} Report</p>
                            </div>
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status}
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{report.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {report.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {report.schedule && (
                            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs rounded border border-purple-200 dark:border-purple-500/20">
                              {report.schedule}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span>By {report.created_by}</span>
                          <span>Updated {new Date(report.updated_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onNavigateToViewReport?.(report.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={() => onNavigateToEditReport?.(report.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-xs font-medium"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors text-xs font-medium">
                            <Download className="w-3 h-3" />
                            Export
                          </button>
                          <button className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs font-medium ml-auto">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;