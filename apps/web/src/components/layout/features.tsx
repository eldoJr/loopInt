import { LayoutDashboard, Users, CreditCard, BarChart2, Settings, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Project Management',
      description: 'Streamline workflows with intuitive project tracking, task management, and team collaboration tools.',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Connect your team with real-time messaging, file sharing, and collaborative workspaces.',
      color: 'purple'
    },
    {
      icon: CreditCard,
      title: 'Financial Management',
      description: 'Track expenses, generate invoices, and manage budgets with comprehensive financial tools.',
      color: 'emerald'
    },
    {
      icon: BarChart2,
      title: 'Analytics & Reports',
      description: 'Make data-driven decisions with detailed analytics, custom reports, and performance insights.',
      color: 'blue'
    },
    {
      icon: Settings,
      title: 'Automation Tools',
      description: 'Automate repetitive tasks, set up workflows, and boost productivity across your organization.',
      color: 'purple'
    },
    {
      icon: Zap,
      title: 'Integrations',
      description: 'Connect with 100+ popular tools and services to create a unified business ecosystem.',
      color: 'emerald'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20',
      purple: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to manage, grow, and scale your business operations in one comprehensive platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl hover:bg-gray-800/30 hover:border-gray-700/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;