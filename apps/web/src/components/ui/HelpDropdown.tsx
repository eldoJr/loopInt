import { useState, useRef, useEffect, memo, useMemo } from 'react';
import {
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  ExternalLink,
  Mail,
  Search,
  Lightbulb,
  Users,
  Zap,
} from 'lucide-react';

const helpCategories = {
  resources: [
    {
      title: 'Documentation',
      description: 'Browse our comprehensive guides and API references',
      icon: Book,
      action: () => window.open('https://docs.loopint.com', '_blank'),
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials and demos',
      icon: Video,
      action: () => window.open('https://youtube.com/loopint', '_blank'),
    },
    {
      title: "What's New",
      description: 'Latest features and product updates',
      icon: Zap,
      action: () => window.open('https://loopint.com/changelog', '_blank'),
    },
  ],
  support: [
    {
      title: 'Community Forum',
      description: 'Get help from the community',
      icon: MessageCircle,
      action: () => window.open('https://community.loopint.com', '_blank'),
    },
    {
      title: 'Contact Support',
      description: 'Reach out to our support team',
      icon: Mail,
      action: () => window.open('mailto:support@loopint.com', '_blank'),
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features and improvements',
      icon: Lightbulb,
      action: () => window.open('https://feedback.loopint.com', '_blank'),
    },
  ],
};

const HelpDropdown = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const currentItems = helpCategories[activeTab as keyof typeof helpCategories];
    return currentItems.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-tech-purple-600 dark:hover:text-tech-purple-400 hover:bg-tech-purple-50 dark:hover:bg-tech-purple-900/20 rounded-lg transition-colors touch-manipulation"
        title="Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 ${isMobile ? 'w-[calc(100vw-1rem)] max-w-sm' : 'w-80'} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Help & Support
              </h3>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-tech-purple-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'resources'
                    ? 'text-tech-purple-600 dark:text-tech-purple-400 border-b-2 border-tech-purple-600 dark:border-tech-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'support'
                    ? 'text-tech-purple-600 dark:text-tech-purple-400 border-b-2 border-tech-purple-600 dark:border-tech-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Support
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`p-3 ${isMobile ? 'max-h-[50vh]' : 'max-h-64'} overflow-y-auto`}>
            {filteredItems.length > 0 ? (
              <div className="space-y-1">
                {filteredItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left group transition-colors touch-manipulation"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <IconComponent className="w-5 h-5 text-tech-purple-500 group-hover:text-tech-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-tech-purple-600 dark:group-hover:text-tech-purple-400 truncate">
                            {item.title}
                          </p>
                          <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Still need help?
              </p>
              <a
                href="mailto:support@loopint.com"
                className="text-xs text-tech-purple-600 dark:text-tech-purple-400 hover:underline font-medium"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HelpDropdown.displayName = 'HelpDropdown';

export default HelpDropdown;
