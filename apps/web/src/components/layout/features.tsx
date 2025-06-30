import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Target, Cog, BarChart3, TrendingUp, DollarSign, CreditCard, Users, type LucideIcon } from 'lucide-react';
import AnimatedTab from '../ui/AnimatedTab';
import FeatureItem from '../ui/FeatureItem';
import StatCard from '../ui/StatCard';
import FloatingIcon from '../ui/FloatingIcon';
import { departments } from '../../lib/featuresData';
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

  const departmentContent: Record<DepartmentName, {
    title: string;
    description: string;
    buttonText: string;
    image: string;
    features: { icon: LucideIcon; text: string }[];
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
    <section className="py-14 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-3">
            Accelerate innovation across{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              your business
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Make drives efficiencies, solves problems and speeds innovation by breaking down silos across your business
          </p>
        </motion.div>

        {/* Department Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {departments.map((dept, index) => (
            <AnimatedTab
              key={dept.name}
              name={dept.name}
              icon={dept.icon}
              isActive={dept.name === activeTab}
              onClick={() => setActiveTab(dept.name)}
              index={index}
              colorClass={getTabColor(dept)}
            />
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                className="p-8 lg:p-12 flex flex-col justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3 
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {activeContent.title}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {activeContent.description}
                </motion.p>

                {/* Features */}
                <motion.div 
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {activeContent.features.map((feature, index) => (
                    <FeatureItem
                      key={index}
                      icon={feature.icon}
                      text={feature.text}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* Stats */}
                <motion.div 
                  className="flex gap-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {activeContent.stats.map((stat, index) => (
                    <StatCard key={index} value={stat.value} label={stat.label} />
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl self-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeContent.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Right Image/Visual */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-8 lg:p-12 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={activeContent.image}
                    alt={activeContent.title}
                    className="object-cover w-full h-full rounded-xl shadow-lg"
                  />
                  
                  {/* Floating elements */}
                  <FloatingIcon 
                    icon={CheckCircle} 
                    position="top-right" 
                    bgColor="bg-green-500" 
                  />
                  <FloatingIcon 
                    icon={Zap} 
                    position="bottom-left" 
                    bgColor="bg-yellow-500" 
                    delay={0.5}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;