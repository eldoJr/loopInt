import { useState, useEffect } from 'react';

const ProfileAndVisibility = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile and visibility</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">Control how others see your profile and information.</p>
      </div>

      {/* Profile photo and cover/header image */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile photo and cover/header image</h3>
        </div>
        <div className="p-6">
          {/* Banner/Header */}
          <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg mb-8">
            <div className="absolute -bottom-6 left-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white dark:border-gray-900 shadow-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          
          {/* Privacy Control */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Who can see your profile photo?</span>
            <select className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>
        </div>
      </div>

      {/* About you */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About you</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Full name */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full name</label>
              <input 
                type="text" 
                defaultValue={user?.name || ''}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Public name */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Public name 
                <span className="ml-1 text-blue-500" title="This is how your name appears to others">ℹ️</span>
              </label>
              <input 
                type="text" 
                placeholder="Your public name"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Job title */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job title</label>
              <input 
                type="text" 
                placeholder="Your job title"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <input 
                type="text" 
                placeholder="Your department"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Organization */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
              <input 
                type="text" 
                placeholder="Your organization"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Based in */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Based in</label>
              <input 
                type="text" 
                placeholder="Your location"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>

          {/* Local time */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local time</label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-500 dark:text-gray-400">
                You have not set your time zone yet
              </div>
            </div>
            <select className="ml-4 px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              <option value="anyone">🌍 Anyone</option>
              <option value="only-you">👤 Only you</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            <div className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300">
              🔒 Only you and administrators
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Save changes
        </button>
        <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileAndVisibility;