import { useState, useRef, useEffect } from 'react';
import { Bell, ExternalLink, MoreHorizontal, Flag, MessageSquare } from 'lucide-react';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('direct');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
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

  const handleGiveFeedback = () => {
    console.log('Give Feedback clicked');
    setShowMoreMenu(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only show unread</span>
                  <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      showUnreadOnly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        showUnreadOnly ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        onClick={handleGiveFeedback}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Give Feedback</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('direct')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'direct'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setActiveTab('watching')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'watching'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Watching
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="p-8 text-center">
            <div className="mb-4">
              <Flag className="w-12 h-12 text-blue-500 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You have no notifications from the last 30 days.
            </p>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press ↓ ↑ to move through notifications. esc to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;