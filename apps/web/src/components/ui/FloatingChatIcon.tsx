import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FloatingChatIconProps {
  hasNotification?: boolean;
  onChatOpen?: () => void;
}

const FloatingChatIcon = ({ hasNotification = false, onChatOpen }: FloatingChatIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setIsOpen(!isOpen);
    onChatOpen?.();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-2">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Support Chat</h3>
            <p className="text-sm opacity-90">We're here to help!</p>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-blue-100 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-800">Hi! How can we help you today?</p>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <button
        onClick={handleClick}
        className="relative w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        
        {hasNotification && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default FloatingChatIcon;