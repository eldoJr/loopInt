import { motion } from 'framer-motion';
import { Plus, FileX, Users, FolderOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Action {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface DashboardEmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  actions?: Action[];
  // Legacy props for backward compatibility
  actionText?: string;
  onAction?: () => void;
}

const DashboardEmptyState = ({
  message,
  description,
  icon: Icon,
  actions,
  actionText,
  onAction,
}: DashboardEmptyStateProps) => {
  // Convert legacy props to new format
  const finalActions =
    actions ||
    (actionText && onAction
      ? [{ text: actionText, onClick: onAction, variant: 'primary' as const }]
      : []);

  // Default icon based on message content
  const DefaultIcon =
    Icon ||
    (message.toLowerCase().includes('task')
      ? FileX
      : message.toLowerCase().includes('project')
        ? FolderOpen
        : message.toLowerCase().includes('team')
          ? Users
          : Plus);

  return (
    <motion.div
      className="text-center py-12 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className="mx-auto w-16 h-16 bg-gray-800/30 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <DefaultIcon className="w-8 h-8 text-gray-500" />
      </motion.div>

      {/* Message */}
      <h3 className="text-gray-300 font-medium text-lg mb-2">{message}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions */}
      {finalActions.length > 0 && (
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {finalActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                action.variant === 'primary'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                  : 'text-gray-400 hover:text-gray-300 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
              }`}
            >
              {action.text}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardEmptyState;
