import { useState } from 'react';

const PrivacySettings = () => {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [activityVisibility, setActivityVisibility] = useState('public');
  const [searchVisibility, setSearchVisibility] = useState('public');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Privacy
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">
          Control your privacy settings and data sharing preferences.
        </p>
      </div>

      {/* Profile Visibility */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile visibility
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Control who can see your profile information and activity.
          </p>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Who can see your profile?
            </label>
            <select
              value={profileVisibility}
              onChange={e => setProfileVisibility(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Anyone</option>
              <option value="organization">Organization members only</option>
              <option value="private">Only you</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Options */}
      <div className="space-y-4">
        {/* Activity Visibility */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity visibility
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Control who can see your recent activity and contributions.
          </p>
          <div className="max-w-md">
            <select
              value={activityVisibility}
              onChange={e => setActivityVisibility(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Anyone</option>
              <option value="organization">Organization members only</option>
              <option value="private">Only you</option>
            </select>
          </div>
        </div>

        {/* Search Visibility */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search visibility
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Control whether your profile appears in search results.
          </p>
          <div className="max-w-md">
            <select
              value={searchVisibility}
              onChange={e => setSearchVisibility(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Anyone can find me</option>
              <option value="organization">Organization members only</option>
              <option value="private">Don't show in search</option>
            </select>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data management
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage your personal data and account information.{' '}
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
              Learn more
            </button>
          </p>
          <div className="space-y-2">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline block">
              Download your data
            </button>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline block">
              Delete your account
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-3">
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

export default PrivacySettings;
