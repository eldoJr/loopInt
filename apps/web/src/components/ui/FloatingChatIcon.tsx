import { useState } from 'react';
import { MessageCircle, X, Search, ChevronRight, Home, Bot, Phone } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';

interface FloatingChatIconProps {
  hasNotification?: boolean;
  onChatOpen?: () => void;
}

const FloatingChatIcon = ({ hasNotification = false, onChatOpen }: FloatingChatIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const helpItems = [
    { title: 'Getting Started', description: 'Learn the basics of LoopInt' },
    { title: 'Project Management', description: 'How to manage your projects' },
    { title: 'AI Features', description: 'Using AI-powered tools' },
    { title: 'Task Automation', description: 'Setting up workflow loops' },
    { title: 'CRM Integration', description: 'Managing client relationships' },
    { title: 'Account Settings', description: 'Customize your account' }
  ];

  const filteredItems = helpItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
    onChatOpen?.();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      {/* Help Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[32rem] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden transform transition-all duration-300 ease-out mb-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-indigo-700 text-white p-5 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={logoImg} alt="Loopint" className="h-8 w-auto" />
              <div>
                <h3 className="font-semibold">Help Center</h3>
                <p className="text-xs opacity-80">How can we help you today?</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1.5 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm placeholder-gray-400 transition-all"
              />
            </div>
          </div>
          
          {/* Help Items */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left hover:bg-blue-50/50 border-b border-gray-100/50 flex items-center justify-between group transition-all duration-200"
                  onClick={() => console.log(`Clicked: ${item.title}`)}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 truncate">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 truncate">{item.description}</p>
                  </div>
                  <ChevronRight className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-2" />
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Search className="w-10 h-10 text-gray-300 mb-3" />
                <h4 className="font-medium text-gray-700">No results found</h4>
                <p className="text-sm text-gray-500 mt-1">Try different search terms</p>
              </div>
            )}
          </div>
          
          {/* Bottom Navigation */}
          <div className="border-t border-gray-100 bg-gray-50 flex">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'chatbot', icon: Bot, label: 'AI Assistant' },
              { id: 'contact', icon: Phone, label: 'Support' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 flex flex-col items-center space-y-1 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-blue-100' : ''}`}>
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className={`relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/30 hover:shadow-xl'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:scale-110" />
        )}
        
        {hasNotification && !isOpen && (
          <div className="absolute top-1 right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white animate-ping" />
        )}
      </button>
    </div>
  );
};

export default FloatingChatIcon;