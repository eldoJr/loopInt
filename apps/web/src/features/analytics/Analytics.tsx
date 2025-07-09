import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, Target, Activity, Calendar, Zap, AlertTriangle, Award, Download, RefreshCw, Eye } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DashboardStatCard from '../../components/ui/DashboardStatCard';
import Button from '../../components/ui/Button';

interface AnalyticsProps {
  onNavigateBack?: () => void;
}

const Analytics = ({ onNavigateBack }: AnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Analytics' }
  ];

  // Mock data - replace with real API calls
  const taskCompletionData = [
    { month: 'Jan', completed: 45, pending: 12 },
    { month: 'Feb', completed: 52, pending: 8 },
    { month: 'Mar', completed: 61, pending: 15 },
    { month: 'Apr', completed: 58, pending: 10 },
    { month: 'May', completed: 67, pending: 7 },
    { month: 'Jun', completed: 73, pending: 9 }
  ];

  const projectStatusData = [
    { name: 'Active', value: 12, color: '#10b981' },
    { name: 'Completed', value: 8, color: '#3b82f6' },
    { name: 'On Hold', value: 3, color: '#f59e0b' },
    { name: 'Planning', value: 5, color: '#8b5cf6' }
  ];

  const priorityData = [
    { priority: 'High', tasks: 23, projects: 4 },
    { priority: 'Medium', tasks: 45, projects: 8 },
    { priority: 'Low', tasks: 32, projects: 6 },
    { priority: 'Urgent', tasks: 12, projects: 2 }
  ];

  const productivityData = [
    { day: 'Mon', hours: 7.5, efficiency: 85 },
    { day: 'Tue', hours: 8.2, efficiency: 92 },
    { day: 'Wed', hours: 6.8, efficiency: 78 },
    { day: 'Thu', hours: 8.5, efficiency: 95 },
    { day: 'Fri', hours: 7.1, efficiency: 82 },
    { day: 'Sat', hours: 4.2, efficiency: 88 },
    { day: 'Sun', hours: 2.1, efficiency: 75 }
  ];

  const teamPerformanceData = [
    { member: 'Alice', tasks: 23, quality: 95, speed: 88, collaboration: 92 },
    { member: 'Bob', tasks: 19, quality: 87, speed: 94, collaboration: 85 },
    { member: 'Carol', tasks: 21, quality: 91, speed: 82, collaboration: 89 },
    { member: 'David', tasks: 18, quality: 89, speed: 90, collaboration: 87 },
    { member: 'Eve', tasks: 25, quality: 93, speed: 85, collaboration: 94 }
  ];

  const workflowData = [
    { stage: 'Planning', tasks: 12, avgTime: 2.5, bottleneck: false },
    { stage: 'Development', tasks: 34, avgTime: 5.2, bottleneck: true },
    { stage: 'Review', tasks: 28, avgTime: 1.8, bottleneck: false },
    { stage: 'Testing', tasks: 22, avgTime: 3.1, bottleneck: false },
    { stage: 'Deployment', tasks: 15, avgTime: 1.2, bottleneck: false }
  ];

  const burndownData = [
    { week: 'W1', planned: 100, actual: 95, ideal: 100 },
    { week: 'W2', planned: 80, actual: 78, ideal: 80 },
    { week: 'W3', planned: 60, actual: 65, ideal: 60 },
    { week: 'W4', planned: 40, actual: 42, ideal: 40 },
    { week: 'W5', planned: 20, actual: 18, ideal: 20 },
    { week: 'W6', planned: 0, actual: 5, ideal: 0 }
  ];

  const aiInsights = [
    {
      type: 'performance',
      title: 'Peak Performance',
      description: 'Team productivity peaks on Thursdays with 95% efficiency',
      impact: 'high',
      action: 'Schedule critical tasks on Thursdays'
    },
    {
      type: 'bottleneck',
      title: 'Development Bottleneck',
      description: 'Development stage shows 40% longer completion times',
      impact: 'medium',
      action: 'Consider adding developer resources'
    },
    {
      type: 'opportunity',
      title: 'Weekend Optimization',
      description: 'Low weekend activity presents automation opportunities',
      impact: 'low',
      action: 'Implement automated weekend deployments'
    }
  ];

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number | string;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-white text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="1w">Last Week</option>
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
              <select 
                value={selectedMetric} 
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Metrics</option>
                <option value="tasks">Tasks Only</option>
                <option value="projects">Projects Only</option>
                <option value="team">Team Performance</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 1000);
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <DashboardStatCard
              title="Total Tasks"
              value="142"
              icon={CheckCircle}
              color="text-green-400"
            />
            <DashboardStatCard
              title="Active Projects"
              value="28"
              icon={Target}
              color="text-blue-400"
            />
            <DashboardStatCard
              title="Team Members"
              value="16"
              icon={Users}
              color="text-purple-400"
            />
            <DashboardStatCard
              title="Completion Rate"
              value="87%"
              icon={TrendingUp}
              color="text-emerald-400"
            />
            <DashboardStatCard
              title="Avg Velocity"
              value="23"
              icon={Zap}
              color="text-yellow-400"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Completion Trends */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Task Completion Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Project Status Distribution */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Project Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Analysis */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-400" />
                Priority Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="priority" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="projects" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Team Productivity */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Weekly Productivity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Team Performance Radar */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                Team Performance Matrix
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={teamPerformanceData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="member" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar name="Quality" dataKey="quality" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Radar name="Speed" dataKey="speed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Collaboration" dataKey="collaboration" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Workflow Bottlenecks */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Workflow Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={workflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="stage" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="avgTime" stroke="#f59e0b" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-2">
                {workflowData.map((stage, index) => (
                  <div key={index} className={`px-3 py-1 rounded-full text-xs ${
                    stage.bottleneck ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {stage.stage}: {stage.avgTime}h avg
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sprint Burndown */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Sprint Burndown Chart
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ideal" stroke="#6b7280" strokeDasharray="5 5" strokeWidth={2} name="Ideal" />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={3} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                AI-Powered Insights
              </h3>
              <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                Last updated: 2 min ago
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => {
                const colors = {
                  performance: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: TrendingUp },
                  bottleneck: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
                  opportunity: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: CheckCircle }
                };
                const config = colors[insight.type as keyof typeof colors];
                const IconComponent = config.icon;
                
                return (
                  <div key={index} className={`${config.bg} border ${config.border} rounded-lg p-4 hover:scale-105 transition-transform`}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className={`w-4 h-4 ${config.text}`} />
                      <span className={`${config.text} font-medium text-sm`}>{insight.title}</span>
                      <div className={`ml-auto px-2 py-1 rounded text-xs ${
                        insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {insight.impact}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                    <div className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                      💡 {insight.action}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Analytics;