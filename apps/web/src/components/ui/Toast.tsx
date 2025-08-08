import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'loading';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (toast.type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }, toast.duration || 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.type, onRemove]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    loading: Loader2,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    loading: 'bg-blue-500 text-white',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg shadow-lg transition-all duration-300 ${colors[toast.type]} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Icon
        className={`w-5 h-5 ${toast.type === 'loading' ? 'animate-spin' : ''}`}
      />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

let toastId = 0;
const toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const addToast = (toast: Omit<Toast, 'id'>) => {
  const newToast = { ...toast, id: String(++toastId) };
  toasts = [...toasts, newToast];
  toastListeners.forEach(listener => listener(toasts));
};

const removeToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  toastListeners.forEach(listener => listener(toasts));
};

export const ToastContainer = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    toastListeners.push(listener);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {currentToasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export const showToast = {
  success: (message: string) => addToast({ message, type: 'success' }),
  error: (message: string) =>
    addToast({ message, type: 'error', duration: 5000 }),
  loading: (message: string) => addToast({ message, type: 'loading' }),
};
