import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import Button from '../ui/Button';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses already using our platform to streamline operations and boost productivity.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button href="#join" icon={ArrowRight} size="lg">
              Start Your Free Trial
            </Button>
            <Button href="#demo" variant="secondary" size="lg">
              Schedule a Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">10,000+ Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;