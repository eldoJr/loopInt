import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { AppRouter } from './router/AppRouter';
import FloatingChatIcon from './components/ui/FloatingChatIcon';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/error/ErrorBoundary';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppRouter />
        <FloatingChatIcon onChatOpen={() => console.log('Chat opened')} />
        <ToastContainer />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
