import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Edit, Share2, Calendar, User, Tag, Clock, FileText, Printer, Mail, Copy, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ViewReportProps {
  reportId: string;
  onNavigateBack?: () => void;
  onNavigateToReports?: () => void;
  onNavigateToEdit?: (id: string) => void;
}

interface Report {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  tags: string[];
  schedule?: string;
}

const ViewReport = ({ reportId, onNavigateBack, onNavigateToReports, onNavigateToEdit }: ViewReportProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data for charts
  const performanceData = [
    { month: 'Jan', tasks: 45, projects: 12 },
    { month: 'Feb', tasks: 52, projects: 15 },
    { month: 'Mar', tasks: 61, projects: 18 },
    { month: 'Apr', tasks: 58, projects: 16 },
    { month: 'May', tasks: 67, projects: 20 },
    { month: 'Jun', tasks: 73, projects: 22 }
  ];

  const statusData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 10, color: '#f59e0b' }
  ];

  const trendData = [
    { week: 'W1', efficiency: 85 },
    { week: 'W2', efficiency: 88 },
    { week: 'W3', efficiency: 82 },
    { week: 'W4', efficiency: 91 }
  ];

  useEffect(() => {
    const loadReport = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock report data
        const mockReport: Report = {
          id: reportId,
          title: 'Monthly Performance Report',
          type: 'analytics',
          description: 'Comprehensive analysis of team performance and project metrics for the current month',
          status: 'published',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z',
          created_by: 'John Doe',
          tags: ['performance', 'monthly', 'analytics'],
          schedule: 'monthly'
        };
        
        setReport(mockReport);
        setLoading(false);
        setTimeout(() => setShowContent(true), 200);
      } catch (error) {
        console.error('Error loading report:', error);
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (method: string) => {
    if (method === 'copy') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
    setShowShareMenu(false);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    // Implement export logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'draft': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'archived': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Reports', onClick: onNavigateToReports },
    { label: report?.title || 'View Report' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Report not found</h3>
            <p className="text-gray-500 mb-4">The requested report could not be loaded</p>
            <button
              onClick={onNavigateToReports}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
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
    <div className={`space-y-6 transition-all duration-500 ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-white">{report.title}</h1>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                  {report.status}
                </div>
              </div>
              <p className="text-gray-400 mb-4">{report.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Created by {report.created_by}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(report.updated_at).toLocaleDateString()}</span>
                </div>
                {report.schedule && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="capitalize">{report.schedule} schedule</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => onNavigateToEdit?.(report.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Send via Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-700/50">
          <div className="flex space-x-8">
            {['overview', 'data', 'charts', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="projects" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-300">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Efficiency Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Raw Data</h3>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tasks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Projects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {performanceData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-700/20">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{row.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{row.tasks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{row.projects}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {trendData[index]?.efficiency || 'N/A'}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Chart Gallery</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                  <h4 className="text-md font-medium text-white mb-4">Monthly Tasks</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                  <h4 className="text-md font-medium text-white mb-4">Project Growth</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Report Settings</h3>
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-generate report</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Include charts</span>
                    <span className="text-green-400">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Include data tables</span>
                    <span className="text-green-400">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Output format</span>
                    <span className="text-blue-400">PDF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Schedule</span>
                    <span className="text-purple-400 capitalize">{report.schedule || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReport;