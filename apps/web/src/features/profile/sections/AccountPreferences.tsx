import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

const AccountPreferences = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [selectedTimeZone, setSelectedTimeZone] = useState('Your time zone');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    language: false,
    timeZone: false,
  });

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'pt-BR', label: 'Português (Brasil)' },
  ];

  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  ];

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
    setIsLoading(prev => ({ ...prev, language: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Language updated to:', language);
    } finally {
      setIsLoading(prev => ({ ...prev, language: false }));
    }
  };

  const handleTimeZoneSelect = async (timeZone: string) => {
    setSelectedTimeZone(timeZone);
    setIsTimeZoneOpen(false);
    setIsLoading(prev => ({ ...prev, timeZone: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Time zone updated to:', timeZone);
    } finally {
      setIsLoading(prev => ({ ...prev, timeZone: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Account preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">
          Set your general account preferences and defaults.
        </p>
      </div>

      {/* Language & Region Section */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Language & Region
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Changes to your language and timezone will be reflected across Jira,
            Confluence, Trello, Bitbucket and directory. Update your language
            and timezone for other products from your{' '}
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
              product settings
            </button>
            .
          </p>

          <div className="space-y-4 max-w-md">
            {/* Language Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  disabled={isLoading.language}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span>
                    {isLoading.language ? 'Updating...' : selectedLanguage}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isLanguageOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
                    {languages.map(lang => (
                      <button
                        key={lang.value}
                        onClick={() => handleLanguageSelect(lang.label)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Time Zone Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time zone
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTimeZoneOpen(!isTimeZoneOpen)}
                  disabled={isLoading.timeZone}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                >
                  <span>
                    {isLoading.timeZone ? 'Updating...' : selectedTimeZone}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isTimeZoneOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isTimeZoneOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
                    {timeZones.map(tz => (
                      <button
                        key={tz.value}
                        onClick={() => handleTimeZoneSelect(tz.label)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm"
                      >
                        {tz.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Delete your account
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          When you delete your account, you lose access to Atlassian account
          services, and we permanently delete your personal data. You can cancel
          the deletion within 14 days.
        </p>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
            Delete account
          </button>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline flex items-center space-x-1">
            <span>Learn more</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPreferences;
