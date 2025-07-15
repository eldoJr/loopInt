import toast, { Toaster } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 4000,
    style: {
      background: '#10B981',
      color: '#fff',
    },
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 5000,
    style: {
      background: '#EF4444',
      color: '#fff',
    },
  }),
  
  loading: (message: string) => toast.loading(message, {
    style: {
      background: '#3B82F6',
      color: '#fff',
    },
  }),
  
  promise: <T>(promise: Promise<T>, messages: {
    loading: string;
    success: string;
    error: string;
  }) => toast.promise(promise, messages, {
    style: {
      minWidth: '250px',
    },
    success: {
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#fff',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    },
  })
};

export { Toaster };