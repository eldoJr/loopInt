import './App.css';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FloatingChatIcon from './components/ui/FloatingChatIcon';
import { Toaster } from './lib/toast';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      case '/dashboard':
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      {renderPage()}
      <FloatingChatIcon 
        onChatOpen={() => console.log('Chat opened')} 
      />
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;
