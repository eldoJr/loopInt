import './App.css';
import { AppRouter } from './router/AppRouter';
import FloatingChatIcon from './components/ui/FloatingChatIcon';
import { ToastContainer } from './components/ui/Toast';
import { ErrorBoundary } from './components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <FloatingChatIcon onChatOpen={() => console.log('Chat opened')} />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
