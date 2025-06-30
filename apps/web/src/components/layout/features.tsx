import { useState } from 'react';
import { 
  MonitorSpeaker, 
  Cog, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Users, 
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';

import itImg from "/src/assets/img/IT.webp"
import maketingImg from "/src/assets/img/marketing.webp"
import operationsImg from "/src/assets/img/operations.webp"
import peopleImg  from "/src/assets/img/people.webp"
import salesImg from "/src/assets/img/sales-automation.webp"
import financeImg from "/src/assets/img/finance.webp"
import costumerImg from "/src/assets/img/costumer.webp"

type Stat = {
  label: string;
  value: string;
};

type DepartmentName =
  | 'IT'
  | 'Operations'
  | 'Marketing'
  | 'Sales'
  | 'Finance'
  | 'Customer Experience'
  | 'People';

const Features = () => {
  const [activeTab, setActiveTab] = useState<DepartmentName>('Customer Experience');

  const departments: Department[] = [
    {
      name: 'IT',
      icon: MonitorSpeaker,
      color: 'blue'
    },
    {
      name: 'Operations',
      icon: Cog,
      color: 'gray'
    },
    {
      name: 'Marketing',
      icon: TrendingUp,
      color: 'green'
    },
    {
      name: 'Sales',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      name: 'Finance',
      icon: CreditCard,
      color: 'blue'
    },
    {
      name: 'Customer Experience',
      icon: Users,
      color: 'pink'
    },
    {
      name: 'People',
      icon: Users,
      color: 'purple'
    }
  ];

  const departmentContent: Record<DepartmentName, {
    title: string;
    description: string;
    buttonText: string;
    image: string;
    features: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }[];
    stats: Stat[];
  }> = {
    'IT': {
      title: 'IT Infrastructure',
      description: 'Streamline your technology stack with automated deployments, infrastructure monitoring, and seamless integrations that keep your systems running smoothly.',
      buttonText: 'Optimize IT',
      image: itImg,
      features: [
        { icon: Zap, text: 'Automated deployment' },
        { icon: CheckCircle, text: 'System monitoring' },
        { icon: Target, text: 'Infrastructure scaling' }
      ],
      stats: [
        { label: 'Uptime', value: '99.9%' },
        { label: 'Deploy time', value: '2 min' }
      ]
    },
    'Operations': {
      title: 'Operations Excellence',
      description: 'Optimize workflows, reduce bottlenecks, and improve efficiency across all operational processes with intelligent automation and real-time insights.',
      buttonText: 'Streamline Ops',
      image: operationsImg,
      features: [
        { icon: Cog, text: 'Process automation' },
        { icon: BarChart3, text: 'Performance metrics' },
        { icon: Target, text: 'Quality control' }
      ],
      stats: [
        { label: 'Efficiency gain', value: '45%' },
        { label: 'Cost reduction', value: '30%' }
      ]
    },
    'Marketing': {
      title: 'Marketing Automation',
      description: 'Drive growth with data-driven marketing campaigns, automated lead nurturing, and comprehensive analytics that turn prospects into customers.',
      buttonText: 'Boost Marketing',
      image: maketingImg,
      features: [
        { icon: TrendingUp, text: 'Campaign automation' },
        { icon: Target, text: 'Lead scoring' },
        { icon: BarChart3, text: 'ROI tracking' }
      ],
      stats: [
        { label: 'Lead conversion', value: '3.2x' },
        { label: 'Campaign ROI', value: '250%' }
      ]
    },
    'Sales': {
      title: 'Sales Acceleration',
      description: 'Close deals faster with intelligent pipeline management, automated follow-ups, and predictive analytics that identify your best opportunities.',
      buttonText: 'Accelerate Sales',
      image: salesImg,
      features: [
        { icon: DollarSign, text: 'Pipeline management' },
        { icon: Target, text: 'Lead prioritization' },
        { icon: BarChart3, text: 'Sales forecasting' }
      ],
      stats: [
        { label: 'Deal velocity', value: '40%' },
        { label: 'Close rate', value: '28%' }
      ]
    },
    'Finance': {
      title: 'Financial Intelligence',
      description: 'Gain complete financial visibility with automated reporting, expense tracking, and predictive budgeting that keeps your business profitable.',
      buttonText: 'Optimize Finance',
      image: financeImg,
      features: [
        { icon: CreditCard, text: 'Expense automation' },
        { icon: BarChart3, text: 'Financial reporting' },
        { icon: Target, text: 'Budget forecasting' }
      ],
      stats: [
        { label: 'Processing time', value: '85%' },
        { label: 'Accuracy', value: '99.8%' }
      ]
    },
    'Customer Experience': {
      title: 'Customer Experience',
      description: 'Deliver a smoother CX than you ever imagined by automating onboarding, records management, SLAs, support management and more.',
      buttonText: 'Automate CX',
      image: costumerImg,
      features: [
        { icon: Users, text: 'Customer onboarding' },
        { icon: CheckCircle, text: 'SLA management' },
        { icon: Target, text: 'Support automation' }
      ],
      stats: [
        { label: 'Customer satisfaction', value: '94%' },
        { label: 'Response time', value: '2.3 min' }
      ]
    },
    'People': {
      title: 'People Operations',
      description: 'Empower your workforce with streamlined HR processes, automated onboarding, and comprehensive employee lifecycle management.',
      buttonText: 'Empower People',
      image: peopleImg,
      features: [
        { icon: Users, text: 'Employee onboarding' },
        { icon: BarChart3, text: 'Performance tracking' },
        { icon: Target, text: 'Skills development' }
      ],
      stats: [
        { label: 'Employee satisfaction', value: '91%' },
        { label: 'Onboarding time', value: '50%' }
      ]
    }
  };

  interface Department {
    name: DepartmentName;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: 'blue' | 'gray' | 'green' | 'yellow' | 'pink' | 'purple';
  }

  interface TabColorMap {
    [key: string]: string;
  }

  const getTabColor = (dept: Department): string => {
    if (dept.name === activeTab) {
      const colors: TabColorMap = {
        blue: 'border-blue-500 text-blue-600 bg-blue-50',
        gray: 'border-gray-500 text-gray-600 bg-gray-50',
        green: 'border-green-500 text-green-600 bg-green-50',
        yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50',
        pink: 'border-pink-500 text-pink-600 bg-pink-50',
        purple: 'border-purple-500 text-purple-600 bg-purple-50'
      };
      return colors[dept.color] || colors.blue;
    }
    return 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 bg-white';
  };

  const activeContent = departmentContent[activeTab];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Accelerate innovation across{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              your business
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Make drives efficiencies, solves problems and speeds innovation by breaking down silos across your business
          </p>
        </div>

        {/* Department Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.name}
                onClick={() => setActiveTab(dept.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 transform hover:scale-105 ${getTabColor(dept)}`}
              >
                <Icon className="w-5 h-5" />
                <span>{dept.name}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {activeContent.title}
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {activeContent.description}
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {activeContent.features.map((feature: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }, index: number) => {
                  const FeatureIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <FeatureIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-8">
                {activeContent.stats.map((stat: Stat, index: number) => (
                  <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl self-start">
                {activeContent.buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right Image/Visual */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-12 flex items-center justify-center">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img
                  src={activeContent.image}
                  alt={activeContent.title}
                  className="object-cover w-full h-full rounded-xl shadow-lg"
                />
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;