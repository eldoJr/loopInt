import { useState, useEffect, useCallback } from 'react';
import { Share, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface InviteUserProps {
  onNavigateBack?: () => void;
  onNavigateToTeam?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  position: string;
  hourlyRate: string;
  language: string;
}

const InviteUser = ({ onNavigateBack, onNavigateToTeam }: InviteUserProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    position: 'Position',
    hourlyRate: '',
    language: ''
  });

  const role = [
    'Choose', 
    'Admin', 
    'Default User', 
    'HR and payroll', 
    'Manager HR', 
    'Sales', 
    'Marketing', 
    'Customer service', 
    'Accounting', 
    'HR specialist', 
    'Manager'
  ];

  const positions = [
    'Position'
  ];

  const languages = ['Select language', 'English', 'Spanish', 'Portuguese', 'French', 'German', 'Hindi'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(fakeEvent);
      }
      if (e.key === 'Escape') {
        onNavigateToTeam?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateToTeam]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    //if (!formData.role === 'Choose') newErrors.role = 'Role is required';
    if (formData.position === 'Choose') newErrors.position = 'Position is required';
    if (formData.language === 'Select language') newErrors.language = 'Language is required';
    if (!formData.hourlyRate.trim()) newErrors.hourlyRate = 'Hourly rate is required';
    if (formData.hourlyRate.trim() && !/^\d+(\.\d{1,2})?$/.test(formData.hourlyRate.trim())) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      
      const formDataToSend = new FormData();
      
      // Add all fields
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('role', formData.role);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('hourlyRate', formData.hourlyRate.trim());
      formDataToSend.append('language', formData.language);
      formDataToSend.append('status', 'invited');
      if (currentUser?.id) formDataToSend.append('invitedBy', currentUser.id);
      
      const response = await fetch('http://localhost:3000/team/invite', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        console.log('User invited successfully');
        onNavigateToTeam?.();
      } else {
        let errorMessage = 'Failed to invite user';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      setErrors({ submit: 'Failed to invite user. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team', onClick: onNavigateToTeam },
    { label: 'Invite User' }
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
    <div className={`space-y-6 transition-all duration-500 ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Invite User</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNavigateToTeam}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  saving
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Share size={14} />
                <span>{saving ? 'Sending...' : 'Send Invitation'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* User Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                User Information
              </h2>
              
              {/* Name Fields */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  First Name *
                </label>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.firstName 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                
              </div>
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Last Name *
                </label>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.lastName 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Email *
                </label>
                <div className="col-span-9">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Role Field */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Role *
                </label>
                <div className="col-span-9">
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.role 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                  >
                    {role.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Position Field */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Position *
                </label>
                <div className="col-span-9">
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.position 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {errors.position && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.position}
                    </div>
                  )}
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Hourly rate (INR) *
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.hourlyRate 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter hourly rate"
                  />
                  {errors.hourlyRate && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.hourlyRate}
                    </div>
                  )}
                </div>
              </div>

              {/* Language Field */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Language *
                </label>
                <div className="col-span-9">
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.language 
                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                  {errors.language && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.language}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {errors.submit && (
          <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.submit}</span>
            </div>
          </div>
        )}
        
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press Ctrl+S to save</span>
              <span>•</span>
              <span>Press Esc to cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;