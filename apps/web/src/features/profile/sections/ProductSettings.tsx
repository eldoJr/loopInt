import { useState, useEffect } from 'react';
import { ExternalLink, Settings } from 'lucide-react';

interface User {
  id?: string;
  name?: string;
  email?: string;
}

const ProductSettings = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getUserDomain = () => {
    if (user?.email) {
      const username = user.email.split('@')[0];
      return `${username}.loopint.net`;
    }
    return 'user.loopint.net';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product settings</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">Configure settings for individual products and features.</p>
      </div>

      {/* Jira Settings Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Loopint settings</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage language, time zone, issue watching, and notifications settings for Loopint, or sign up for Loopint labs.
          </p>
          
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline flex items-center space-x-1">
              <span>{getUserDomain()}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Configure general application settings and preferences.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
            Manage general settings
          </button>
        </div>

        {/* Notification Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Control how and when you receive notifications from Loopint.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
            Manage notification settings
          </button>
        </div>

        {/* Integration Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Integration Settings</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Configure integrations with third-party tools and services.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
            Manage integrations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSettings;