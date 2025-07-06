interface DashboardEmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const DashboardEmptyState = ({
  message,
  actionText,
  onAction
}: DashboardEmptyStateProps) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>{message}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default DashboardEmptyState;