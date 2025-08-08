import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  CreditCard,
  Users,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button';

const Solutions = () => {
  const solutions = [
    {
      icon: LayoutDashboard,
      title: 'Project Management',
      description:
        'Complete project lifecycle management with task tracking, team collaboration, and deadline management.',
      features: [
        'Task Management',
        'Team Collaboration',
        'Timeline Tracking',
        'Resource Planning',
      ],
      color: 'blue',
      href: '#project-management',
    },
    {
      icon: Settings,
      title: 'CBM Tools',
      description:
        'Comprehensive Business Management tools for operations, processes, and workflow optimization.',
      features: [
        'Process Automation',
        'Workflow Design',
        'Performance Metrics',
        'Quality Control',
      ],
      color: 'purple',
      href: '#cbm-tools',
    },
    {
      icon: ShoppingBag,
      title: 'Freshwear Management',
      description:
        'Complete inventory and retail management system for fashion and apparel businesses.',
      features: [
        'Inventory Control',
        'Sales Tracking',
        'Supplier Management',
        'Trend Analysis',
      ],
      color: 'emerald',
      href: '#freshwear-management',
      isNew: true,
    },
    {
      icon: CreditCard,
      title: 'Financial Suite',
      description:
        'Advanced financial management with invoicing, expense tracking, and comprehensive reporting.',
      features: [
        'Invoice Generation',
        'Expense Tracking',
        'Financial Reports',
        'Budget Planning',
      ],
      color: 'blue',
      href: '#finances',
    },
    {
      icon: Users,
      title: 'HRMS Platform',
      description:
        'Human Resource Management System for employee lifecycle and organizational management.',
      features: [
        'Employee Records',
        'Payroll Management',
        'Performance Reviews',
        'Attendance Tracking',
      ],
      color: 'purple',
      href: '#hrms',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        hover: 'group-hover:bg-blue-500/20',
        border: 'border-blue-500/20',
      },
      purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        hover: 'group-hover:bg-purple-500/20',
        border: 'border-purple-500/20',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        hover: 'group-hover:bg-emerald-500/20',
        border: 'border-emerald-500/20',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-3xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Complete Business
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Solutions Suite
            </span>
          </h2>
          <p className="text-base text-gray-400 max-w-3xl mx-auto">
            Specialized tools designed for different aspects of your business
            operations, all integrated into one powerful platform.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {solutions.map((solution, index) => {
            const colorClasses = getColorClasses(solution.color);
            return (
              <div
                key={index}
                className={`group relative p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] ${colorClasses.hover}`}
              >
                {solution.isNew && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </div>
                )}

                <div className="flex items-start space-x-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${colorClasses.bg} ${colorClasses.hover}`}
                  >
                    <solution.icon className={`w-8 h-8 ${colorClasses.text}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {solution.title}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {solution.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {solution.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-sm text-gray-500"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-fuscale-105ll mr-2 ${colorClasses.bg.replace('/10', '/60')}`}
                          ></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      href={solution.href}
                      variant="outline"
                      size="sm"
                      icon={ArrowRight}
                      className="group-hover:border-blue-500/50 group-hover:text-blue-400"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button href="#solutions" size="lg" icon={ArrowRight}>
            Explore All Solutions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
