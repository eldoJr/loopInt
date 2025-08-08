import { useState } from 'react';
import {
  MessageCircle,
  X,
  Search,
  ChevronRight,
  Home,
  Bot,
  Phone,
} from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';

interface FloatingChatIconProps {
  onChatOpen?: () => void;
}

const FloatingChatIcon = ({ onChatOpen }: FloatingChatIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isHovered, setIsHovered] = useState(false);

  const helpItems = [
    { title: 'Getting Started', description: 'Learn the basics of LoopInt' },
    { title: 'Project Management', description: 'How to manage your projects' },
    { title: 'AI Features', description: 'Using AI-powered tools' },
    { title: 'Task Automation', description: 'Setting up workflow loops' },
    { title: 'CRM Integration', description: 'Managing client relationships' },
    { title: 'Account Settings', description: 'Customize your account' },
  ];

  const filteredItems = helpItems.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
    onChatOpen?.();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[10000]">
      {/* Help Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-96 h-[32rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transform transition-all duration-300 ease-out mb-2 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-5 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img src={logoImg} alt="Loopint" className="h-6 w-auto" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Help Center</h3>
                <p className="text-sm opacity-90">How can we help you today?</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 dark:text-gray-500 w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Help Items */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between group transition-all duration-200"
                  onClick={() => console.log(`Clicked: ${item.title}`)}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  No results found
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try different search terms
                </p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex rounded-b-2xl">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'chatbot', icon: Bot, label: 'AI Assistant' },
              { id: 'contact', icon: Phone, label: 'Support' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-100 dark:bg-blue-500/20 scale-110' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  <tab.icon className="w-4 h-4 transition-transform" />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-16 h-16 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden z-10 ${
            isOpen
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30'
              : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 shadow-blue-500/30 hover:shadow-xl hover:scale-105'
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isOpen ? (
            <X className="w-6 h-6 text-white transform transition-all duration-300 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white transform transition-all duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* Tooltip */}
        {isHovered && !isOpen && (
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg whitespace-nowrap transform transition-all duration-200 opacity-100">
            Need help?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </div>
        )}

        {/* Pulse animation ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-pulse scale-110 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default FloatingChatIcon;
