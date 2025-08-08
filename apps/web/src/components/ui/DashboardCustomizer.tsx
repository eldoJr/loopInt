import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DashboardWidget {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface DashboardCustomizerProps {
  isCustomizing: boolean;
  widgets: DashboardWidget[];
  onToggleCustomization: () => void;
  onUpdateWidgets: (widgets: DashboardWidget[]) => void;
  onResetLayout: () => void;
}

const DashboardCustomizer = ({
  isCustomizing,
  widgets,
  onToggleCustomization,
  onUpdateWidgets,
  onResetLayout,
}: DashboardCustomizerProps) => {
  const [localWidgets, setLocalWidgets] = useState(widgets);
  useTheme();

  const handleToggleVisibility = (id: string) => {
    const updated = localWidgets.map(widget =>
      widget.id === id ? { ...widget, isVisible: !widget.isVisible } : widget
    );
    setLocalWidgets(updated);
  };

  const handleSave = () => {
    onUpdateWidgets(localWidgets);
    onToggleCustomization();
  };

  const handleCancel = () => {
    setLocalWidgets(widgets);
    onToggleCustomization();
  };

  const handleReset = () => {
    onResetLayout();
    setLocalWidgets(widgets);
  };

  return (
    <AnimatePresence>
      {isCustomizing && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-lg shadow-xl p-3 min-w-[350px]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Customize Dashboard
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              title="Reset Layout"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
            Toggle widgets on/off and drag them to reorder.
          </p>

          <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
            {localWidgets.map(widget => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/30 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {widget.title}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widget.isVisible}
                    onChange={() => handleToggleVisibility(widget.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1 text-sm"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1 text-sm"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardCustomizer;
