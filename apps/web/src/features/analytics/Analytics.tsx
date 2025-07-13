import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,} from 'recharts';
import { TrendingUp, TrendingDown, Eye, Settings, Info} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsProps {
  onNavigateBack?: () => void;
}

const Analytics = ({ onNavigateBack }: AnalyticsProps) => {
  useTheme();
  
  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Analytics' }
  ];

  // Traffic Sources Data
  const trafficData = [
    { month: 'Jan', website: 500, social: 300, websiteGrowth: 20, socialGrowth: 15 },
    { month: 'Feb', website: 450, social: 280, websiteGrowth: 18, socialGrowth: 12 },
    { month: 'Mar', website: 400, social: 320, websiteGrowth: 22, socialGrowth: 18 },
    { month: 'Apr', website: 650, social: 350, websiteGrowth: 28, socialGrowth: 20 },
    { month: 'May', website: 200, social: 250, websiteGrowth: 15, socialGrowth: 10 },
    { month: 'Jun', website: 400, social: 280, websiteGrowth: 25, socialGrowth: 16 },
    { month: 'Jul', website: 180, social: 200, websiteGrowth: 12, socialGrowth: 8 },
    { month: 'Aug', website: 320, social: 240, websiteGrowth: 18, socialGrowth: 14 },
    { month: 'Sep', website: 750, social: 400, websiteGrowth: 35, socialGrowth: 25 },
    { month: 'Oct', website: 300, social: 220, websiteGrowth: 16, socialGrowth: 11 },
    { month: 'Nov', website: 250, social: 180, websiteGrowth: 14, socialGrowth: 9 },
    { month: 'Dec', website: 150, social: 160, websiteGrowth: 10, socialGrowth: 8 }
  ];

  const donutData = [
    { name: 'Used', value: 75, color: '#3B82F6' },
    { name: 'Available', value: 25, color: '#E5E7EB' }
  ];

  const kpiData: KPICardProps[] = [
    { title: 'Active Projects', value: '28', trend: 1, score: '92', color: 'blue' },
    { title: 'Completed Tasks', value: '156', trend: 1, score: '88', color: 'green' },
    { title: 'Team Productivity', value: '87%', trend: 1, score: '85', color: 'yellow' },
    { title: 'Client Satisfaction', value: '94%', trend: 1, score: '96', color: 'green' }
  ];

  const projectMetrics = [
    { title: 'Projects Delivered', value: '42', change: '+18%', trend: 1 },
    { title: 'On-Time Delivery', value: '89%', change: '+5%', trend: 1 },
    { title: 'Budget Efficiency', value: '92%', change: '+3%', trend: 1 },
    { title: 'Client Retention', value: '96%', change: '+2%', trend: 1 }
  ];

  const targetData: TargetBarProps[] = [
    { label: 'Project Completion', percentage: 78, color: 'blue' },
    { label: 'Team Utilization', percentage: 85, color: 'green' },
    { label: 'Quality Score', percentage: 92, color: 'yellow' },
    { label: 'Client Goals', percentage: 89, color: 'blue' }
  ];

  interface KPICardProps {
    title: string;
    value: string;
    trend: number;
    score: string;
    color?: 'blue' | 'red' | 'yellow' | 'green';
  }

  interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    trend: number;
  }

  interface TargetBarProps {
    label: string;
    percentage: number;
    color: 'red' | 'green' | 'yellow' | 'blue';
  }

  const KPICard = ({ title, value, trend, score, color = 'blue' }: KPICardProps) => {
    const colorClasses = {
      blue: 'border-blue-500 text-blue-600 bg-blue-500',
      red: 'border-red-500 text-red-600 bg-red-500',
      yellow: 'border-yellow-500 text-yellow-600 bg-yellow-500',
      green: 'border-green-500 text-green-600 bg-green-500'
    };

    return (
      <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800/50 p-6 relative backdrop-blur-sm hover:shadow-md transition-all duration-200">
        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]}`}></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
              <div className={`flex items-center ${trend > 0 ? 'text-green-600 dark:text-green-400' : trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
              </div>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
            <span className={`text-xs font-bold ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]}`}>{score}</span>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, change, trend }: MetricCardProps) => (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`flex items-center text-sm px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );

  const TargetBar = ({ percentage, color }: Omit<TargetBarProps, 'label'>) => {
    const colorMap = {
      red: '#EF4444',
      green: '#10B981',
      yellow: '#F59E0B',
      blue: '#3B82F6'
    };
    
    return (
      <div className="w-full">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: colorMap[color as keyof typeof colorMap],
              boxShadow: `0 0 8px ${colorMap[color as keyof typeof colorMap]}40`
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Monitor your project performance, team efficiency, and delivery metrics to optimize workflow and achieve better results.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Project Performance Chart */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Performance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monthly project delivery and team collaboration metrics</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Export Data
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" className="dark:stroke-gray-700" opacity={0.5} />
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
                <Bar 
                  dataKey="website" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="Projects Completed"
                />
                <Bar 
                  dataKey="social" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="Team Collaboration"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Collaboration</span>
            </div>
          </div>
        </div>

        {/* Team Efficiency Chart */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Efficiency</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall team productivity and task completion rate</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors" />
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">87%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Efficiency</div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">+5% this month</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-gray-900 dark:text-white">156</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-gray-900 dark:text-white">28</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Performance Goals Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Goals</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track progress towards quarterly objectives and KPIs</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>

      {/* Performance Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {targetData.map((target, index) => (
          <div key={index} className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{target.label}</h4>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{target.percentage}%</span>
            </div>
            <TargetBar {...target} />
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Current Progress</span>
              <span className={`font-medium ${
                target.percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                target.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {target.percentage >= 80 ? 'Excellent' :
                 target.percentage >= 60 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;