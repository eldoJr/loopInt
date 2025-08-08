// Simple toast implementation without external dependency
let toastContainer: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToast = (
  message: string,
  type: 'success' | 'error' | 'loading'
) => {
  const container = createToastContainer();
  const toast = document.createElement('div');

  const colors = {
    success: '#10B981',
    error: '#EF4444',
    loading: '#3B82F6',
  };

  toast.style.cssText = `
    background: ${colors[type]};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
  `;

  toast.textContent = message;
  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Auto remove
  setTimeout(
    () => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    },
    type === 'error' ? 5000 : 4000
  );
};

export const showToast = {
  success: (message: string) => createToast(message, 'success'),
  error: (message: string) => createToast(message, 'error'),
  loading: (message: string) => createToast(message, 'loading'),
};

// Empty component for compatibility
export const Toaster = () => null;
