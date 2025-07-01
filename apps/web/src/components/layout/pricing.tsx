import { Check, Star, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for individuals and small teams getting started',
      features: [
        'Up to 3 projects',
        '5 team members',
        'Basic templates',
        'Email support',
        '1GB storage'
      ],
      color: 'blue',
      popular: false
    },
    {
      name: 'Professional',
      price: '$0',
      period: 'per month',
      description: 'Ideal for growing businesses and professional teams',
      features: [
        'Unlimited projects',
        '25 team members',
        'Advanced templates',
        'Priority support',
        '100GB storage',
        'Custom integrations',
        'Advanced analytics'
      ],
      color: 'purple',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'Tailored solutions for large organizations',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Custom development',
        'Dedicated support',
        'Unlimited storage',
        'Advanced security',
        'SLA guarantee'
      ],
      color: 'emerald',
      popular: false
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/20',
        text: 'text-blue-400'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/20',
        text: 'text-purple-400'
      },
      emerald: {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Pricing Plans
            </span>
          </h2>
          <p className="text-base text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. Start free and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const colorClasses = getColorClasses(plan.color);
            return (
              <div
                key={index}
                className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 shadow-lg shadow-purple-500/10' 
                    : `${colorClasses.bg} ${colorClasses.border}`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge icon={Star} variant="warning">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${colorClasses.text}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 text-lg ml-2">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <Check className={`w-5 h-5 mr-3 ${colorClasses.text}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  icon={ArrowRight}
                  className="w-full"
                  href={plan.name === 'Enterprise' ? '#contact' : '#signup'}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Need a custom solution? We're here to help you find the perfect fit.
          </p>
          <Button href="#contact" variant="secondary" icon={ArrowRight}>
            Contact Our Sales Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;