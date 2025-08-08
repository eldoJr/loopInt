import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import lightModeIcon from '../../assets/icons/light-mode.9ae6186d.svg';
import darkModeIcon from '../../assets/icons/dark-mode.fd95cecc.svg';

interface GeneralProps {
  onNavigateBack?: () => void;
}

const General = ({ onNavigateBack }: GeneralProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [selectedTimeZone, setSelectedTimeZone] = useState('Your time zone');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    language: false,
    timeZone: false,
  });
  const { theme, setTheme } = useTheme();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'General Settings' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            General Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">
            Manage language, timezone and other personal preferences.
          </p>
        </div>

        {/* Language & Region */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Language & Region
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Changes to your language and timezone will be reflected across all
              LoopInt products.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Theme */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Theme
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Choose your preferred theme appearance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={lightModeIcon}
                alt="Light mode"
                className="w-full h-20 object-cover rounded mb-2"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Light
              </p>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={darkModeIcon}
                alt="Dark mode"
                className="w-full h-20 object-cover rounded mb-2"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Dark
              </p>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Personal Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Start week on Monday
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Choose which day your week starts on
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  24-hour time format
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Display time in 24-hour format
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Compact view
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Show more content in less space
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
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
    </div>
  );
};

export default General;
