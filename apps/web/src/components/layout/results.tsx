import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Users, Zap, Shield } from 'lucide-react';

const results = [
  {
    icon: TrendingUp,
    value: 85,
    suffix: "%",
    description: "Increase in team productivity with streamlined workflows and automation.",
    color: "blue",
  },
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    description: "Businesses trust our platform for their daily operations worldwide.",
    color: "purple",
  },
  {
    icon: Zap,
    value: 99.9,
    suffix: "%",
    description: "Platform uptime ensuring your business never stops running.",
    color: "emerald",
  },
  {
    icon: Shield,
    value: 100,
    suffix: "%",
    description: "Secure data protection with enterprise-grade security measures.",
    color: "blue",
  },
];

const Results = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/20',
        icon: 'bg-blue-500/10 text-blue-400',
        text: 'text-blue-400'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/20',
        icon: 'bg-purple-500/10 text-purple-400',
        text: 'text-purple-400'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-500/20',
        icon: 'bg-emerald-500/10 text-emerald-400',
        text: 'text-emerald-400'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Mobile Scroll */}
        <div className="lg:hidden overflow-hidden">
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="flex gap-6 snap-x snap-mandatory w-full px-4">
              {results.map(({ icon: Icon, value, suffix, description, color }, index) => {
                const colorClasses = getColorClasses(color);
                return (
                  <div
                    key={index}
                    className="snap-center shrink-0 w-72"
                  >
                    <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${colorClasses.bg} ${colorClasses.border} h-full`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${colorClasses.text}`}>
                        {inView ? (
                          <CountUp start={0} end={value} duration={2.5} decimals={value % 1 !== 0 ? 1 : 0} />
                        ) : (
                          0
                        )}
                        {suffix}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {results.map(({ icon: Icon, value, suffix, description, color }, index) => {
            const colorClasses = getColorClasses(color);
            return (
              <div
                key={index}
                className={`group p-8 rounded-2xl backdrop-blur-sm border duration-300 hover: ${colorClasses.bg} ${colorClasses.border}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${colorClasses.icon}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className={`text-3xl font-bold mb-4 ${colorClasses.text}`}>
                  {inView ? (
                    <CountUp start={0} end={value} duration={2.5} decimals={value % 1 !== 0 ? 1 : 0} />
                  ) : (
                    0
                  )}
                  {suffix}
                </div>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Results;
