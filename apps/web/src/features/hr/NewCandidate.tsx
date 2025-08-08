import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  X,
  Upload,
  Plus,
  Linkedin,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Calendar,
  Star,
  ChartArea,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Toggle } from '../../components/ui/Toggle';
import CustomSelect from '../../components/ui/CustomSelect';

interface NewCandidateProps {
  onNavigateBack?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  secondEmail: string;
  phone: string;
  secondPhone: string;
  skype: string;
  linkedin: string;
  location: string;
  source: string;
  appliedPosition: string;
  addDate: string;
  assignedTo: string[];
  blockCandidate: boolean;
  hrProject: string;
  mainSkills: string[];
  skills: string[];
  experience: string;
  foreignLanguages: string[];
  currentPosition: string;
  positionDescription: string;
  currentCompany: string;
  previousCompanies: string;
  previousPosts: string;
  education: string;
  schools: string;
  courses: string;
  certifications: string;
  salaryFrom: string;
  salaryTo: string;
  salaryType: string;
  salaryPeriod: string;
  contractType: string;
  availableFrom: string;
  remoteWork: string;
  businessTrips: boolean;
  specialRequirements: string;
  description: string;
  photo: File | null;
}

const NewCandidate = ({ onNavigateBack }: NewCandidateProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  // Removed unused textAlign state
  const [positionDescLength, setPositionDescLength] = useState(0);
  const maxPositionDescLength = 300;

  const [ratings, setRatings] = useState({
    general: 0,
    interpersonal: 0,
    technical: 0,
  });

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    secondEmail: '',
    phone: '',
    secondPhone: '',
    skype: '',
    linkedin: '',
    location: '',
    source: '',
    appliedPosition: '',
    addDate: '',
    assignedTo: [],
    blockCandidate: false,
    hrProject: '',
    mainSkills: [],
    skills: [],
    experience: '',
    foreignLanguages: [],
    currentPosition: '',
    positionDescription: '',
    currentCompany: '',
    previousCompanies: '',
    previousPosts: '',
    education: '',
    schools: '',
    courses: '',
    certifications: '',
    salaryFrom: '',
    salaryTo: '',
    salaryType: 'net',
    salaryPeriod: 'month',
    contractType: '',
    availableFrom: '',
    remoteWork: 'Choose',
    businessTrips: false,
    specialRequirements: '',
    description: '',
    photo: null,
  });

  const positions = [
    'Choose position',
    'Software Engineer',
    'Product Manager',
    'UX Designer',
    'Data Scientist',
    'Marketing Specialist',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst',
    'Operations Manager',
    'Customer Support',
  ];

  const sources = [
    'Choose source',
    'LinkedIn',
    'Indeed',
    'Referral',
    'Company Website',
    'Job Fair',
    'University',
    'Recruitment Agency',
    'Other',
  ];

  const hrProjects = [
    'Select HR project',
    'HR/2023/001',
    'HR/2023/002',
    'HR/2023/003',
    'HR/2023/004',
  ];

  const experiences = [
    'Choose experience',
    'Junior (0-2 years)',
    'Mid (2-5 years)',
    'Senior (5+ years)',
    'Lead (8+ years)',
    'Executive (10+ years)',
  ];

  const educationLevels = [
    'Choose education',
    'High School',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Other',
  ];

  const contractTypes = [
    'Choose contract type',
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
  ];

  const remoteOptions = ['Choose', 'Remote', 'On-site', 'Hybrid'];

  const specialRequirementOptions = [
    'Choose requirement',
    'Accessibility needs',
    'Visa sponsorship',
    'Flexible hours',
    'Other',
  ];

  const skillOptions = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'SQL',
    'AWS',
    'UI/UX',
    'Project Management',
    'Communication',
    'Leadership',
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Russian',
    'Arabic',
    'Portuguese',
    'Hindi',
  ];

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
        onNavigateBack?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigateBack]);

  const handleInputChange = useCallback(
    (
      field: keyof FormData,
      value: string | boolean | string[] | File | null | undefined
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (field === 'positionDescription' && typeof value === 'string') {
        setPositionDescLength(value.length);
      }
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handleRatingChange = (
    category: keyof typeof ratings,
    rating: number
  ) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating,
    }));
  };

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

  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));
  };

  // Removed unused handleTextAlign function

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.positionDescription.length > maxPositionDescLength) {
      newErrors.positionDescription = `Position description must be under ${maxPositionDescLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const userData =
        localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;

      const formDataToSend = new FormData();

      // Add photo file if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      // Add all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'photo') {
          if (typeof value === 'string' && value.trim()) {
            formDataToSend.append(key, value.trim());
          } else if (typeof value === 'boolean') {
            formDataToSend.append(key, String(value));
          } else if (Array.isArray(value) && value.length > 0) {
            formDataToSend.append(key, JSON.stringify(value));
          }
        }
      });

      // Add ratings
      formDataToSend.append('ratings', JSON.stringify(ratings));

      if (currentUser?.id) formDataToSend.append('createdBy', currentUser.id);

      const response = await fetch('http://localhost:3000/candidates', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        console.log('Candidate created successfully');
        onNavigateBack?.();
      } else {
        let errorMessage = 'Failed to create candidate';
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
      console.error('Error saving candidate:', error);
      setErrors({ submit: 'Failed to save candidate. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    label,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }) => (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${
              star <= rating
                ? 'fill-blue-500 text-blue-500'
                : 'text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-blue-400'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'HR', onClick: onNavigateBack },
    { label: 'New Candidate' },
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

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Candidate
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNavigateBack}
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
                <Save size={14} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Section 1 - Basic Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Basic Information
              </h2>

              {/* Photo Upload */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Photo
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        JPG, JPEG, PNG (max 5MB)
                      </p>
                    </div>
                  </div>
                  {errors.photo && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.photo}
                    </div>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  First Name *
                </label>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e =>
                      handleInputChange('firstName', e.target.value)
                    }
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
                    onChange={e =>
                      handleInputChange('lastName', e.target.value)
                    }
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
                    onChange={e => handleInputChange('email', e.target.value)}
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

              {/* Status */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Status
                </label>
                <div className="col-span-9">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    New
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Rating
                </label>
                <div className="col-span-9">
                  <div className="flex flex-wrap gap-6">
                    <StarRating
                      rating={ratings.general}
                      onRatingChange={rating =>
                        handleRatingChange('general', rating)
                      }
                      label="General rating"
                    />
                    <StarRating
                      rating={ratings.interpersonal}
                      onRatingChange={rating =>
                        handleRatingChange('interpersonal', rating)
                      }
                      label="Interpersonal skills"
                    />
                    <StarRating
                      rating={ratings.technical}
                      onRatingChange={rating =>
                        handleRatingChange('technical', rating)
                      }
                      label="Technical skills"
                    />
                  </div>
                </div>
              </div>

              {/* Applied Position */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Applied Position *
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={positions}
                    value={formData.appliedPosition}
                    onChange={value =>
                      handleInputChange('appliedPosition', value)
                    }
                  />
                </div>
              </div>

              {/* Source */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Source
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={sources}
                    value={formData.source}
                    onChange={value => handleInputChange('source', value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Contact and Address */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Contact and Address
              </h2>

              {/* LinkedIn */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  LinkedIn
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={e =>
                        handleInputChange('linkedin', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>

              {/* Skype */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Skype
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <ChartArea className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Skype username"
                      value={formData.skype}
                      onChange={e => handleInputChange('skype', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Phone *
                </label>
                <div className="col-span-8">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {formData.secondPhone !== undefined && (
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Phone 2
                  </label>
                  <div className="col-span-8">
                    <input
                      type="tel"
                      value={formData.secondPhone}
                      onChange={e =>
                        handleInputChange('secondPhone', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Enter second phone number"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange('secondPhone', undefined)
                      }
                      className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {formData.secondPhone === undefined && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={() => handleInputChange('secondPhone', '')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add 2nd phone number</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Location
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={remoteOptions}
                    value={formData.location}
                    onChange={value => handleInputChange('location', value)}
                  />
                </div>
              </div>

              {/* Second Email */}
              {formData.secondEmail !== undefined && (
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Second Email
                  </label>
                  <div className="col-span-8">
                    <input
                      type="email"
                      value={formData.secondEmail}
                      onChange={e =>
                        handleInputChange('secondEmail', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Enter second email address"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange('secondEmail', undefined)
                      }
                      className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {formData.secondEmail === undefined && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={() => handleInputChange('secondEmail', '')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add 2nd email address</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3 - HR Project and Assignment */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                HR Project and Assignment
              </h2>

              {/* HR Project */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  HR Project
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={hrProjects}
                    value={formData.hrProject}
                    onChange={value => handleInputChange('hrProject', value)}
                  />
                </div>
              </div>

              {/* Add Date */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Add Date
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.addDate}
                      onChange={e =>
                        handleInputChange('addDate', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Assigned To
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        A
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        B
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Block Candidate */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Block Candidate
                </label>
                <div className="col-span-9">
                  <Toggle
                    pressed={formData.blockCandidate}
                    onPressedChange={pressed =>
                      handleInputChange('blockCandidate', pressed)
                    }
                  >
                    <span className="text-sm">
                      {formData.blockCandidate
                        ? 'Candidate blocked'
                        : 'Candidate active'}
                    </span>
                  </Toggle>
                </div>
              </div>

              {/* Files */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Files
                </label>
                <div className="col-span-9">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-700/50 text-white dark:text-gray-300 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add resume</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>New file</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 - Qualifications */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Qualifications
              </h2>

              {/* Main Skills */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Main Skills (max 3)
                </label>
                <div className="col-span-9">
                  <CustomSelect
                    options={skillOptions}
                    value={formData.mainSkills.join(', ')}
                    onChange={value =>
                      handleInputChange('mainSkills', value.split(', '))
                    }
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Skills
                </label>
                <div className="col-span-9">
                  <CustomSelect
                    options={skillOptions}
                    value={formData.skills.join(', ')}
                    onChange={value =>
                      handleInputChange('skills', value.split(', '))
                    }
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Experience
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={experiences}
                    value={formData.experience}
                    onChange={value => handleInputChange('experience', value)}
                  />
                </div>
              </div>

              {/* Foreign Languages */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Foreign Languages
                </label>
                <div className="col-span-9">
                  <CustomSelect
                    options={languageOptions}
                    value={formData.foreignLanguages.join(', ')}
                    onChange={value =>
                      handleInputChange('foreignLanguages', value.split(', '))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 5 - Employment History */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Employment History
              </h2>

              {/* Current Position */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Current Position
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={positions}
                    value={formData.currentPosition}
                    onChange={value =>
                      handleInputChange('currentPosition', value)
                    }
                  />
                </div>
              </div>

              {/* Position Description */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Position Description
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-1 p-2 bg-gray-100 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700/50 rounded-t-lg">
                    <Toggle
                      pressed={textStyles.bold}
                      onPressedChange={() => handleTextStyle('bold')}
                      aria-label="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.italic}
                      onPressedChange={() => handleTextStyle('italic')}
                      aria-label="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.underline}
                      onPressedChange={() => handleTextStyle('underline')}
                      aria-label="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </Toggle>
                  </div>

                  <div className="relative">
                    <textarea
                      placeholder="Describe the position..."
                      value={formData.positionDescription}
                      onChange={e =>
                        handleInputChange('positionDescription', e.target.value)
                      }
                      rows={3}
                      maxLength={maxPositionDescLength}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 border-t-0 rounded-b-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-sm"
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration: textStyles.underline
                          ? 'underline'
                          : 'none',
                      }}
                    />

                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-3">
                      <span
                        className={`text-xs ${
                          positionDescLength > maxPositionDescLength * 0.9
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {positionDescLength}/{maxPositionDescLength} characters
                      </span>
                      <div className="flex items-center space-x-2">
                        {errors.positionDescription && (
                          <div className="flex items-center space-x-1 text-red-500 dark:text-red-400">
                            <AlertCircle size={14} />
                            <span className="text-xs">
                              {errors.positionDescription}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Company */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Current Company
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter current company"
                    value={formData.currentCompany}
                    onChange={e =>
                      handleInputChange('currentCompany', e.target.value)
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>

              {/* Previous Companies */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Previous Companies
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter previous companies"
                    value={formData.previousCompanies}
                    onChange={e =>
                      handleInputChange('previousCompanies', e.target.value)
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>

              {/* Previous Posts */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Previous Posts
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter previous posts"
                    value={formData.previousPosts}
                    onChange={e =>
                      handleInputChange('previousPosts', e.target.value)
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 6 - Education History */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Education History
              </h2>

              {/* Education Level */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Education Level
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={educationLevels}
                    value={formData.education}
                    onChange={value => handleInputChange('education', value)}
                  />
                </div>
              </div>

              {/* Schools */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Schools
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter schools"
                    value={formData.schools}
                    onChange={e => handleInputChange('schools', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>

              {/* Courses */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Courses
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter courses"
                    value={formData.courses}
                    onChange={e => handleInputChange('courses', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Certifications
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    placeholder="Enter certifications"
                    value={formData.certifications}
                    onChange={e =>
                      handleInputChange('certifications', e.target.value)
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 7 - Candidate's Expectations */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Candidate's Expectations
              </h2>

              {/* Salary Expectations */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Salary Expectations
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      placeholder="From"
                      value={formData.salaryFrom}
                      onChange={e =>
                        handleInputChange('salaryFrom', e.target.value)
                      }
                      className="w-24 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="To"
                      value={formData.salaryTo}
                      onChange={e =>
                        handleInputChange('salaryTo', e.target.value)
                      }
                      className="w-24 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <select
                      value={formData.salaryType}
                      onChange={e =>
                        handleInputChange('salaryType', e.target.value)
                      }
                      className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option value="net">net</option>
                      <option value="gross">gross</option>
                    </select>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <select
                      value={formData.salaryPeriod}
                      onChange={e =>
                        handleInputChange('salaryPeriod', e.target.value)
                      }
                      className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option value="month">month</option>
                      <option value="year">year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contract Type */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Contract Type
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={contractTypes}
                    value={formData.contractType}
                    onChange={value => handleInputChange('contractType', value)}
                  />
                </div>
              </div>

              {/* Available From */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Available From
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={e =>
                        handleInputChange('availableFrom', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Remote Work */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Remote Work
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={remoteOptions}
                    value={formData.remoteWork}
                    onChange={value => handleInputChange('remoteWork', value)}
                  />
                </div>
              </div>

              {/* Business Trips */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Business Trips
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.businessTrips}
                      onChange={e =>
                        handleInputChange('businessTrips', e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Available for business trips
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Special Requirements
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={specialRequirementOptions}
                    value={formData.specialRequirements}
                    onChange={value =>
                      handleInputChange('specialRequirements', value)
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Description
                </label>
                <div className="col-span-9">
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <Toggle
                        pressed={textStyles.bold}
                        onPressedChange={() => handleTextStyle('bold')}
                        aria-label="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={textStyles.italic}
                        onPressedChange={() => handleTextStyle('italic')}
                        aria-label="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </Toggle>
                      <Toggle
                        pressed={textStyles.underline}
                        onPressedChange={() => handleTextStyle('underline')}
                        aria-label="Underline"
                      >
                        <Underline className="h-4 w-4" />
                      </Toggle>
                    </div>
                    <textarea
                      placeholder="Add description of candidate's expectations..."
                      value={formData.description}
                      onChange={e =>
                        handleInputChange('description', e.target.value)
                      }
                      rows={6}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm"
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration: textStyles.underline
                          ? 'underline'
                          : 'none',
                      }}
                    />
                  </div>
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

export default NewCandidate;
