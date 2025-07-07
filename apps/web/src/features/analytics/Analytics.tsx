import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertTriangle, Download, RefreshCw, Users, Zap, Target, Eye, EyeOff } from 'lucide-react';

interface AnalyticsProps {
  onNavigateBack?: () => void;
}

const Analytics = ({ onNavigateBack }: AnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [isRealTime, setIsRealTime] = useState(true);
  const [visibleCharts, setVisibleCharts] = useState({
    performance: true,
    efficiency: true,
    errors: true,
    usage: true
  });

  // Mock data generation
  const generateTimeSeriesData = (days = 7) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        performance: Math.floor(Math.random() * 30) + 70,
        efficiency: Math.floor(Math.random() * 25) + 75,
        errors: Math.floor(Math.random() * 15) + 5,
        usage: Math.floor(Math.random() * 40) + 60,
        activeUsers: Math.floor(Math.random() * 50) + 100,
        completedTasks: Math.floor(Math.random() * 200) + 300
      });
    }
    return data;
  };

  const [chartData, setChartData] = useState(generateTimeSeriesData(7));

  const kpiData = [
    { title: 'Active Automations', value: '2,847', change: '+12.5%', trend: 'up', icon: Activity, color: 'text-blue-600' },
    { title: 'Success Rate', value: '94.2%', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'text-green-600' },
    { title: 'Avg Response Time', value: '1.24s', change: '-0.3s', trend: 'down', icon: Clock, color: 'text-purple-600' },
    { title: 'Error Rate', value: '5.8%', change: '-1.2%', trend: 'down', icon: AlertTriangle, color: 'text-red-600' }
  ];

  const automationTypeData = [
    { name: 'Data Processing', value: 35, color: '#8884d8' },
    { name: 'Notifications', value: 28, color: '#82ca9d' },
    { name: 'File Management', value: 22, color: '#ffc658' },
    { name: 'API Integration', value: 15, color: '#ff7300' }
  ];

  const hourlyUsageData = [
    { hour: '00:00', usage: 45 }, { hour: '02:00', usage: 32 }, { hour: '04:00', usage: 28 },
    { hour: '06:00', usage: 52 }, { hour: '08:00', usage: 87 }, { hour: '10:00', usage: 95 },
    { hour: '12:00', usage: 78 }, { hour: '14:00', usage: 92 }, { hour: '16:00', usage: 88 },
    { hour: '18:00', usage: 75 }, { hour: '20:00', usage: 65 }, { hour: '22:00', usage: 58 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);

    const interval = setInterval(() => {
      if (isRealTime) {
        setChartData(generateTimeSeriesData(parseInt(timeRange)));
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isRealTime, timeRange]);

  const toggleChartVisibility = (chartName: string) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Rate') || entry.name.includes('efficiency') || entry.name.includes('performance') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Automation Analytics' }
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
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl">
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Automation Analytics</h1>
                    <p className="text-gray-600">Real-time insights into your automation performance</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsRealTime(!isRealTime)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isRealTime 
                          ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      {isRealTime ? 'Live' : 'Paused'}
                    </button>
                    
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1d">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                    </select>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${kpi.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {kpi.change}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                    <p className="text-gray-600 text-sm">{kpi.title}</p>
                  </div>
                ))}
              </div>

              {/* Chart Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-medium text-gray-700">Visible Charts:</span>
                  {Object.entries(visibleCharts).map(([chart, visible]) => (
                    <button
                      key={chart}
                      onClick={() => toggleChartVisibility(chart)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        visible 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {chart.charAt(0).toUpperCase() + chart.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Performance Over Time */}
                {visibleCharts.performance && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Performance Trends</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Performance %</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="performance" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fill="url(#colorPerformance)" 
                        />
                        <defs>
                          <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Efficiency Metrics */}
                {visibleCharts.efficiency && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Efficiency & Usage</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Efficiency</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>Usage</span>
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="efficiency" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="usage" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Error Analytics */}
                {visibleCharts.errors && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Error Rate Analysis</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Error Rate %</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="errors" 
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Automation Types Distribution */}
                {visibleCharts.usage && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Automation Types</h3>
                      <div className="text-sm text-gray-600">Distribution by category</div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={automationTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {automationTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {automationTypeData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hourly Usage Pattern */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">24-Hour Usage Pattern</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Peak hours: 10 AM - 4 PM</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hourlyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fill="url(#colorUsage)" 
                    />
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-8 h-8 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">Performance Goal</h4>
                  </div>
                  <p className="text-blue-700 text-sm mb-2">Current: 94.2% | Target: 95%</p>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-8 h-8 text-green-600" />
                    <h4 className="text-lg font-semibold text-green-900">Efficiency Score</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-2">Excellent performance this month</p>
                  <div className="text-2xl font-bold text-green-800">A+</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    <h4 className="text-lg font-semibold text-purple-900">Active Users</h4>
                  </div>
                  <p className="text-purple-700 text-sm mb-2">Currently online</p>
                  <div className="text-2xl font-bold text-purple-800">1,247</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;