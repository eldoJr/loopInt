import './App.css';
import { AppRouter } from './router/AppRouter';
import FloatingChatIcon from './components/ui/FloatingChatIcon';
import { ToastContainer } from './components/ui/Toast';

function App() {
  return (
    <>
      <AppRouter />
      <FloatingChatIcon 
        onChatOpen={() => console.log('Chat opened')} 
      />
      <ToastContainer />
    </>
  );
}

export default App;
