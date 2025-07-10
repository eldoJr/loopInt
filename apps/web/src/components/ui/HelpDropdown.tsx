import { useState, useRef, useEffect } from 'react';
import { HelpCircle, Book, MessageCircle, Video, ExternalLink, Mail } from 'lucide-react';

const helpItems = [
  {
    title: 'Documentation',
    description: 'Browse our comprehensive guides',
    icon: Book,
    action: () => window.open('https://docs.loopint.com', '_blank')
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Video,
    action: () => window.open('https://youtube.com/loopint', '_blank')
  },
  {
    title: 'Community Forum',
    description: 'Get help from the community',
    icon: MessageCircle,
    action: () => window.open('https://community.loopint.com', '_blank')
  },
  {
    title: 'Contact Support',
    description: 'Reach out to our support team',
    icon: Mail,
    action: () => window.open('mailto:support@loopint.com', '_blank')
  }
];

const HelpDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        title="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Help & Support</h3>
          </div>
          
          <div className="p-2">
            {helpItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Need more help? Contact us at{' '}
              <a href="mailto:support@loopint.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@loopint.com
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDropdown;