import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Linkedin,
  AlertCircle,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Check,
  ChevronDown,
  Tag,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';

interface NewCoworkerProps {
  onNavigateBack?: () => void;
  onNavigateToTeam?: () => void;
}

interface FormData {
  photo: File | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isIndividual: boolean;
  company: string;
  position: string;
  location: string;
  skype: string;
  linkedin: string;
  status: 'active' | 'inactive' | 'pending';
  contractType: 'full-time' | 'part-time' | 'contractor' | 'intern';
  department: string;
  skills: string[];
  salary: number;
}

const NewCoworker = ({
  onNavigateBack,
  onNavigateToTeam,
}: NewCoworkerProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isIndividual: false,
    company: '',
    position: '',
    location: '',
    skype: '',
    linkedin: '',
    status: 'active',
    contractType: 'full-time',
    department: '',
    skills: [],
    salary: 0,
  });

  const companies = ['TechCorp Inc.', 'StartupXYZ', 'Independent', 'QualityFirst Agency'];
  const positions = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'DevOps Engineer',
    'UX/UI Designer',
    'Product Manager',
    'Marketing Specialist',
    'QA Engineer',
    'Data Scientist',
    'Graphic Designer',
  ];
  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Data', 'Operations'];
  const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Figma', 'PostgreSQL',
    'Next.js', 'TailwindCSS', 'Kubernetes', 'Django', 'Adobe XD', 'Machine Learning'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        onNavigateToTeam?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateToTeam]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean | File | null | string[] | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please upload JPG, JPEG, or PNG format only',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'File size must be less than 5MB',
        }));
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleSkillSelect = (skill: string) => {
    const currentSkills = formData.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    handleInputChange('skills', newSkills);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Team member created:', formData);
      onNavigateToTeam?.();
    } catch (error) {
      console.error('Error saving team member:', error);
      setErrors({ submit: 'Failed to save team member. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team', onClick: onNavigateToTeam },
    { label: 'New Coworker' },
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
    <ErrorBoundary>
      <div
        className={`transition-all duration-500 ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Sticky Breadcrumb */}
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="mt-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm transition-all duration-300">
          <div className="sticky top-14 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                  <User className="text-white w-4 h-4" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  New Team Member
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onNavigateToTeam}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm text-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    saving
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          <form className="p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Section 1 - Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                </div>

                {/* Photo Upload */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Photo
                  </label>
                  <div className="sm:col-span-9">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg flex items-center justify-center overflow-hidden">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handlePhotoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Upload photo
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, JPEG, PNG (max 5MB)
                        </p>
                      </div>
                    </div>
                    {errors.photo && (
                      <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
                    )}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Full Name *
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => handleInputChange('firstName', e.target.value)}
                        placeholder="First name"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.firstName
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-orange-500/50'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => handleInputChange('lastName', e.target.value)}
                        placeholder="Last name"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.lastName
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-purple-500/50'
                        }`}
                      />
                    </div>
                  </div>
                  {(errors.firstName || errors.lastName) && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName || errors.lastName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Contact *
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        placeholder="Email address"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.email
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      />
                    </div>
                    <div className="flex-1 relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        placeholder="Phone number"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    </div>
                  )}
                </div>

                {/* Position & Company */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Role & Company *
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1 relative">
                      <select
                        value={formData.position}
                        onChange={e => handleInputChange('position', e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.position
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-orange-500/50'
                        }`}
                      >
                        <option value="">Select position...</option>
                        {positions.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <select
                        value={formData.company}
                        onChange={e => handleInputChange('company', e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg pl-10 pr-10 py-2 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.company
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-purple-500/50'
                        }`}
                      >
                        <option value="">Select company...</option>
                        {companies.map(comp => (
                          <option key={comp} value={comp}>{comp}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {(errors.position || errors.company) && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">
                        {errors.position || errors.company}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Location
                  </label>
                  <div className="sm:col-span-9">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={e => handleInputChange('location', e.target.value)}
                        placeholder="City, State/Country"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 - Professional Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Professional Details
                  </h2>
                </div>

                {/* Status & Contract Type */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Employment
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1 relative">
                      <select
                        value={formData.status}
                        onChange={e => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'pending')}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                      <select
                        value={formData.contractType}
                        onChange={e => handleInputChange('contractType', e.target.value as 'full-time' | 'part-time' | 'contractor' | 'intern')}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contractor">Contractor</option>
                        <option value="intern">Intern</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Department & Salary */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Department & Salary
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1 relative">
                      <select
                        value={formData.department}
                        onChange={e => handleInputChange('department', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      >
                        <option value="">Select department...</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={formData.salary || ''}
                        onChange={e => handleInputChange('salary', parseInt(e.target.value) || 0)}
                        placeholder="Annual salary"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Skills
                  </label>
                  <div className="sm:col-span-9">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                        className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="truncate">
                            {formData.skills && formData.skills.length > 0
                              ? formData.skills.join(', ')
                              : 'Select skills...'}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform flex-shrink-0 ${showSkillDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showSkillDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {skillOptions.map(skill => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleSkillSelect(skill)}
                                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                  formData.skills?.includes(skill)
                                    ? 'bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <span>{skill}</span>
                                {formData.skills?.includes(skill) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Social Links
                  </label>
                  <div className="sm:col-span-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="flex-1 relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={e => handleInputChange('linkedin', e.target.value)}
                        placeholder="LinkedIn profile URL"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.skype}
                        onChange={e => handleInputChange('skype', e.target.value)}
                        placeholder="Skype username"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Individual Contractor Toggle */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Contractor Type
                  </label>
                  <div className="sm:col-span-9">
                    <button
                      type="button"
                      onClick={() => handleInputChange('isIndividual', !formData.isIndividual)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto ${
                        formData.isIndividual
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700/50'
                      }`}
                    >
                      <span>
                        {formData.isIndividual ? 'Individual Contractor' : 'Company Employee'}
                      </span>
                    </button>
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
              <div className="flex items-center space-x-2">
                {saving && (
                  <div className="flex items-center space-x-1 text-orange-500 dark:text-orange-400">
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NewCoworker;