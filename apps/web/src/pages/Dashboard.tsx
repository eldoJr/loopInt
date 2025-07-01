import { useState, useEffect } from 'react';
import type { User } from '../lib/api';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user from localStorage or context
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
            <p className="text-3xl font-bold text-blue-400">12</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Tasks</h3>
            <p className="text-3xl font-bold text-purple-400">48</p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Team</h3>
            <p className="text-3xl font-bold text-emerald-400">8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;