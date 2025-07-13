import { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, FileText, Calendar, TrendingUp, Users, Target, Info, BarChart3, PieChart, Settings } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

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
  useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Project Performance Dashboard',
      type: 'project',
      description: 'Comprehensive analysis of project delivery, timeline adherence, and resource utilization across all active projects',
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      created_by: 'Project Manager',
      status: 'published',
      tags: ['performance', 'projects', 'kpi'],
      schedule: 'weekly'
    },
    {
      id: '2',
      title: 'Team Productivity Insights',
      type: 'team',
      description: 'Weekly team efficiency metrics, task completion rates, and collaboration patterns for optimal workflow management',
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      created_by: 'Team Lead',
      status: 'published',
      tags: ['productivity', 'team', 'efficiency'],
      schedule: 'weekly'
    },
    {
      id: '3',
      title: 'Client Satisfaction Report',
      type: 'analytics',
      description: 'Monthly client feedback analysis, satisfaction scores, and improvement recommendations for better service delivery',
      created_at: '2024-01-12',
      updated_at: '2024-01-22',
      created_by: 'Client Success Manager',
      status: 'draft',
      tags: ['clients', 'satisfaction', 'feedback']
    },
    {
      id: '4',
      title: 'Budget & Resource Analysis',
      type: 'financial',
      description: 'Quarterly financial overview with project budget tracking, resource allocation, and cost optimization insights',
      created_at: '2024-01-08',
      updated_at: '2024-01-21',
      created_by: 'Finance Manager',
      status: 'published',
      tags: ['budget', 'resources', 'financial'],
      schedule: 'monthly'
    },
    {
      id: '5',
      title: 'Quality Assurance Metrics',
      type: 'analytics',
      description: 'Bi-weekly quality control analysis, bug tracking, and testing efficiency metrics for continuous improvement',
      created_at: '2024-01-05',
      updated_at: '2024-01-19',
      created_by: 'QA Lead',
      status: 'published',
      tags: ['quality', 'testing', 'metrics'],
      schedule: 'weekly'
    },
    {
      id: '6',
      title: 'Sprint Retrospective Summary',
      type: 'team',
      description: 'Agile sprint analysis with velocity tracking, burndown charts, and team retrospective insights',
      created_at: '2024-01-03',
      updated_at: '2024-01-17',
      created_by: 'Scrum Master',
      status: 'draft',
      tags: ['agile', 'sprint', 'retrospective']
    }
  ]);



  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analytics': return BarChart3;
      case 'financial': return PieChart;
      case 'project': return Target;
      case 'team': return Users;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'analytics': return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'financial': return 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20';
      case 'project': return 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      case 'team': return 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20';
      default: return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20';
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

  interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    subtitle?: string;
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: StatCardProps) => (
    <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">Generate comprehensive reports, track KPIs, and gain actionable insights to drive project success and team performance.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon={FileText}
          color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
          subtitle="All report types"
        />
        <StatCard
          title="Published"
          value={reports.filter(r => r.status === 'published').length}
          icon={TrendingUp}
          color="bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
          subtitle="Live reports"
        />
        <StatCard
          title="Scheduled"
          value={reports.filter(r => r.schedule).length}
          icon={Calendar}
          color="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
          subtitle="Automated reports"
        />
        <StatCard
          title="Draft Reports"
          value={reports.filter(r => r.status === 'draft').length}
          icon={Edit}
          color="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
          subtitle="In progress"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Report Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create, schedule, and manage comprehensive project reports</p>
            </div>
            <button
              onClick={onNavigateToNewReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-32"
            >
              <option value="all">All Types</option>
              <option value="analytics">Analytics</option>
              <option value="financial">Financial</option>
              <option value="project">Project</option>
              <option value="team">Team</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-32"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all text-sm ${
                showAdvanced 
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Advanced
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
                <select className="w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created By</label>
                <select className="w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>All Authors</option>
                  <option>Project Manager</option>
                  <option>Team Lead</option>
                  <option>Finance Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schedule</label>
                <select className="w-full bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>All Schedules</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No reports found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">Get started by creating your first report to track project performance and team productivity</p>
              <button
                onClick={onNavigateToNewReport}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Your First Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                return (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 hover:shadow-lg dark:hover:bg-gray-800/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${getTypeColor(report.type)}`}>
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                            {report.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{report.type} Report</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{report.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {report.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {report.schedule && (
                        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs rounded-lg border border-purple-200 dark:border-purple-500/20 font-medium">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {report.schedule}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-medium">By {report.created_by}</span>
                      <span>Updated {new Date(report.updated_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToViewReport?.(report.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-sm font-medium flex-1 justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => onNavigateToEditReport?.(report.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
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
  );
};

export default Reports;