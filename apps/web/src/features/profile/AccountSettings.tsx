import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface AccountSettingsProps {
  onNavigateBack?: () => void;
}

const AccountSettings = ({ onNavigateBack }: AccountSettingsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Account Settings' }
  ];

  const navigationItems = [
    { id: 'profile', label: 'Profile and visibility' },
    { id: 'email', label: 'Email' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'preferences', label: 'Account preferences' },
    { id: 'products', label: 'Product settings' }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile and visibility</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm ">Control how others see your profile and information.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-6">
              <p className="text-gray-600 dark:text-gray-400">Profile visibility settings coming soon.</p>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Configure email notifications and preferences.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-6">
              <p className="text-gray-600 dark:text-gray-400">Email configuration coming soon.</p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage passwords, two-factor authentication, and security settings.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-6">
              <p className="text-gray-600 dark:text-gray-400">Security settings coming soon.</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Privacy</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm ">Control your privacy settings and data sharing preferences.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-6">
              <p className="text-gray-600 dark:text-gray-400">Privacy controls coming soon.</p>
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account preferences</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Set your general account preferences and defaults.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl p-6">
              <p className="text-gray-600 dark:text-gray-400">Account preferences coming soon.</p>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Product settings</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm ">Configure settings for individual products and features.</p>
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400">Product settings coming soon.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <nav className="flex space-x-8 min-w-max px-1">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveSection(item.id);
                    }
                  }}
                  className={`py-4 px-1 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap outline-none focus:outline-none active:outline-none ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

        {/* Content Area */}
        <div className="min-h-[400px] pt-6">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;