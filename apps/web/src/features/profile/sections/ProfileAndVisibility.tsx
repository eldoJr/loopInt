import { useState, useEffect } from 'react';
import { Globe, User, Info, Lock } from 'lucide-react';

const ProfileAndVisibility = () => {
  const [user, setUser] = useState<any>(null);
  const [profilePhotoPrivacy, setProfilePhotoPrivacy] = useState('anyone');
  const [fullNamePrivacy, setFullNamePrivacy] = useState('anyone');
  const [publicNamePrivacy, setPublicNamePrivacy] = useState('anyone');
  const [jobTitlePrivacy, setJobTitlePrivacy] = useState('anyone');
  const [departmentPrivacy, setDepartmentPrivacy] = useState('anyone');
  const [organizationPrivacy, setOrganizationPrivacy] = useState('anyone');
  const [locationPrivacy, setLocationPrivacy] = useState('anyone');
  const [timeZonePrivacy, setTimeZonePrivacy] = useState('anyone');

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
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
              {profilePhotoPrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={profilePhotoPrivacy}
                onChange={(e) => setProfilePhotoPrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
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
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full name</label>
              <input 
                type="text" 
                defaultValue={user?.name || ''}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {fullNamePrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={fullNamePrivacy}
                onChange={(e) => setFullNamePrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Public name */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Public name 
                <Info className="ml-1 w-4 h-4 text-blue-500" title="This is how your name appears to others" />
              </label>
              <input 
                type="text" 
                placeholder="Your public name"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {publicNamePrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={publicNamePrivacy}
                onChange={(e) => setPublicNamePrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Job title */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job title</label>
              <input 
                type="text" 
                placeholder="Your job title"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {jobTitlePrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={jobTitlePrivacy}
                onChange={(e) => setJobTitlePrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
              <input 
                type="text" 
                placeholder="Your department"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {departmentPrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={departmentPrivacy}
                onChange={(e) => setDepartmentPrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Organization */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization</label>
              <input 
                type="text" 
                placeholder="Your organization"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {organizationPrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={organizationPrivacy}
                onChange={(e) => setOrganizationPrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Based in */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Based in</label>
              <input 
                type="text" 
                placeholder="Your location"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {locationPrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={locationPrivacy}
                onChange={(e) => setLocationPrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>

          {/* Local time */}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Local time</label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-500 dark:text-gray-400">
                You have not set your time zone yet
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white min-w-[120px]">
              {timeZonePrivacy === 'anyone' ? <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" /> : <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              <select 
                value={timeZonePrivacy}
                onChange={(e) => setTimeZonePrivacy(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white flex-1"
              >
                <option value="anyone">Anyone</option>
                <option value="only-you">Only you</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 min-w-[200px]">
              <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Only you and administrators</span>
            </div>
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

export default ProfileAndVisibility;