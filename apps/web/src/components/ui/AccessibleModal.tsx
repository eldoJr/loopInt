import { memo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import Button from './Button';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const AccessibleModal = memo(({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: AccessibleModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    onEscape: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('aria-hidden', 'true');
    } else {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={containerRef}
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            icon={X}
            className="p-2"
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});