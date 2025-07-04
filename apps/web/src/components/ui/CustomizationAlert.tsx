import { motion } from 'framer-motion';
import { Settings, X } from 'lucide-react';

interface CustomizationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onGotIt: () => void;
  onNotNow: () => void;
}

const CustomizationAlert = ({ isOpen, onClose, onGotIt, onNotNow }: CustomizationAlertProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gray-900/95 backdrop-blur-md border border-gray-800/50 rounded-2xl shadow-2xl max-w-md mx-4 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Dashboard Customization</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-300 leading-relaxed mb-6">
          Customize your dashboard by enabling the switch next to the chosen features. 
          Drag & drop to change the order. Click the "finish" button to complete the dashboard configuration.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onGotIt}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Got It
          </button>
          <button
            onClick={onNotNow}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Not Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomizationAlert;