import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Edit,
  Share2,
  Calendar,
  User,
  Tag,
  Clock,
  FileText,
  Printer,
  Mail,
  Copy,
  Check,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Treemap,
} from 'recharts';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

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

const ViewReport = ({
  reportId,
  onNavigateBack,
  onNavigateToReports,
  onNavigateToEdit,
}: ViewReportProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Project performance data
  const performanceData = [
    { month: 'Jan', completed: 45, active: 12, efficiency: 85 },
    { month: 'Feb', completed: 52, active: 15, efficiency: 88 },
    { month: 'Mar', completed: 61, active: 18, efficiency: 82 },
    { month: 'Apr', completed: 58, active: 16, efficiency: 91 },
    { month: 'May', completed: 67, active: 20, efficiency: 87 },
    { month: 'Jun', completed: 73, active: 22, efficiency: 93 },
  ];

  const projectStatusData = [
    { name: 'Completed', value: 68, color: '#10B981' },
    { name: 'In Progress', value: 24, color: '#3B82F6' },
    { name: 'On Hold', value: 5, color: '#F59E0B' },
    { name: 'Planning', value: 3, color: '#8B5CF6' },
  ];

  useEffect(() => {
    const loadReport = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock report data
        const mockReport: Report = {
          id: reportId,
          title: 'Project Performance Dashboard',
          type: 'project',
          description:
            'Comprehensive analysis of project delivery, team productivity, and client satisfaction metrics for Q1 2024',
          status: 'published',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z',
          created_by: 'Project Manager',
          tags: ['performance', 'projects', 'kpi', 'quarterly'],
          schedule: 'monthly',
        };

        setReport(mockReport);
        setLoading(false);
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
      case 'published':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      case 'draft':
        return 'text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-yellow-500/10 border-amber-200 dark:border-yellow-500/20';
      case 'archived':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 border-gray-200 dark:border-gray-500/20';
    }
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
          <p className="text-gray-700 dark:text-gray-300 text-xs font-medium">
            {label}
          </p>
          {payload.map(
            (
              entry: { dataKey: string; value: number; color: string },
              index: number
            ) => (
              <p
                key={index}
                className="text-gray-900 dark:text-white text-xs"
                style={{ color: entry.color }}
              >
                {`${entry.dataKey}: ${entry.value}`}
              </p>
            )
          )}
        </div>
      );
    }
    return null;
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Reports', onClick: onNavigateToReports },
    { label: report?.title || 'View Report' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin border-t-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-8">
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Report not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The requested report could not be loaded or does not exist
            </p>
            <button
              onClick={onNavigateToReports}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-blue-900 dark:text-blue-100 font-semibold text-lg">
              Report Analysis
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Detailed insights and performance metrics for data-driven decision
              making.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700/50 print:px-6 print:py-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white print:text-black">
                  {report.title}
                </h1>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)} print:bg-gray-100 print:text-gray-800 print:border-gray-300 w-fit`}
                >
                  {report.status}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 print:text-gray-700">
                {report.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 print:hidden" />
                  <span>Created by {report.created_by}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 print:hidden" />
                  <span>
                    Created {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 print:hidden" />
                  <span>
                    Updated {new Date(report.updated_at).toLocaleDateString()}
                  </span>
                </div>
                {report.schedule && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 print:hidden" />
                    <span className="capitalize">
                      {report.schedule} schedule
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs rounded print:bg-gray-200 print:text-gray-800"
                  >
                    <Tag className="w-3 h-3 print:hidden" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                onClick={() => onNavigateToEdit?.(report.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
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
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all text-sm font-medium"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700/50 print:hidden">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            {['overview', 'data', 'charts', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 print:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 print:grid-cols-2 print:gap-4">
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 shadow-sm print:bg-white print:border-gray-300 print:shadow-none">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 print:text-black">
                    Performance Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="#f1f5f9"
                        className="dark:stroke-gray-600"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="completed"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Completed"
                      />
                      <Bar
                        dataKey="active"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        name="Active"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 shadow-sm print:bg-white print:border-gray-300 print:shadow-none">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 print:text-black">
                    Project Status
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
                    {projectStatusData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 print:text-gray-700 truncate">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 print:text-black">
                  Team Efficiency Trend
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="2 2"
                      stroke="#f1f5f9"
                      className="dark:stroke-gray-600"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      className="dark:stroke-gray-400"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      className="dark:stroke-gray-400"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
                      name="Efficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white print:text-black">
                Project Performance Data
              </h3>
              <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg overflow-hidden print:bg-white print:border-gray-300 print:shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 print:bg-gray-100">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider print:text-black">
                          Month
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider print:text-black">
                          Completed
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider print:text-black">
                          Active
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-300 uppercase tracking-wider print:text-black">
                          Efficiency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50 print:divide-gray-300">
                      {performanceData.map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/20 print:hover:bg-transparent"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white print:text-black">
                            {row.month}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 print:text-gray-700">
                            {row.completed}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 print:text-gray-700">
                            {row.active}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 print:text-gray-700">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium print:px-1 print:py-0 print:rounded-none print:bg-transparent ${
                                row.efficiency >= 90
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 print:text-green-800'
                                  : row.efficiency >= 80
                                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 print:text-yellow-800'
                                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 print:text-red-800'
                              }`}
                            >
                              {row.efficiency}%
                            </span>
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
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white print:text-black">
                Visual Analytics
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 print:grid-cols-2 print:gap-4">
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 print:text-black flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500 print:hidden" />
                    Completed Projects
                  </h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="#f1f5f9"
                        className="dark:stroke-gray-600"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="completed"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name="Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 print:text-black flex items-center gap-2">
                    <Treemap className="w-5 h-5 text-green-500 print:hidden" />
                    Active Projects Growth
                  </h4>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="#f1f5f9"
                        className="dark:stroke-gray-600"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        className="dark:stroke-gray-400"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                        name="Active"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white print:text-black">
                Report Configuration
              </h3>
              <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 sm:p-6 print:bg-white print:border-gray-300 print:shadow-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Auto-generate report
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold print:text-green-800">
                      Enabled
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Include charts
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold print:text-green-800">
                      Yes
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Include data tables
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold print:text-green-800">
                      Yes
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Output format
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold print:text-blue-800">
                      PDF
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Schedule
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold capitalize print:text-purple-800">
                      {report.schedule || 'None'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium print:text-gray-800">
                      Last generated
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 print:text-gray-700">
                      {new Date().toLocaleDateString()}
                    </span>
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
