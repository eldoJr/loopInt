import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  X,
  Upload,
  Plus,
  Linkedin,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Check,
  ChevronDown,
  Tag,
  Briefcase,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';
import { coworkerSchema } from '../../schemas/coworkerSchema';
import { useCreateCoworker } from '../../hooks/useCoworkers';
import NewOptionModal from '../../components/ui/NewOptionModal';

interface NewCoworkerProps {
  onNavigateBack?: () => void;
  onNavigateToTeam?: () => void;
}

const NewCoworker = ({
  onNavigateBack,
  onNavigateToTeam,
}: NewCoworkerProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showNewOptionModal, setShowNewOptionModal] = useState(false);
  const [newOptionContext, setNewOptionContext] = useState<{ type: 'skill' | 'position' | 'company' | 'department' } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
    } catch {
      return {};
    }
  });

  const createCoworkerMutation = useCreateCoworker();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(coworkerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      company: '',
      location: '',
      status: 'active' as const,
      contractType: 'full-time' as const,
      department: '',
      skills: [],
      salary: 0,
      positionDescription: '',
      linkedin: '',
      skype: '',
      isIndividual: false,
    },
  });

  const watchedSkills = watch('skills');
  const watchedPositionDescription = watch('positionDescription');

  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Data', 'Operations', 'Sales', 'Support', 'HR'];
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
        if (isValid) {
          handleSubmit(onSubmit)();
        }
      }
      if (e.key === 'Escape') {
        if (showNewOptionModal) {
          setShowNewOptionModal(false);
          setNewOptionContext(null);
        } else if (showTagDropdown) {
          setShowTagDropdown(false);
        } else {
          onNavigateToTeam?.();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isValid, onNavigateToTeam, handleSubmit, showNewOptionModal, showTagDropdown]);

  const onSubmit = (data: any) => {
    createCoworkerMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => onNavigateToTeam?.(), 1000);
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setValue('photo', file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSkillSelect = (skill: string) => {
    const currentSkills = watchedSkills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    setValue('skills', newSkills);
  };

  const handleNewOptionSave = (data: {
    module: string;
    field: string;
    language: string;
    optionName: string;
    isDefault: boolean;
    useInField: boolean;
  }) => {
    if (newOptionContext?.type === 'skill') {
      handleSkillSelect(data.optionName);
    } else if (newOptionContext?.type === 'position') {
      setValue('position', data.optionName);
    } else if (newOptionContext?.type === 'company') {
      setValue('company', data.optionName);
    } else if (newOptionContext?.type === 'department') {
      setValue('department', data.optionName);
    }
    setShowNewOptionModal(false);
    setNewOptionContext(null);
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
                  onClick={handleSubmit(onSubmit)}
                  disabled={createCoworkerMutation.isPending || !isValid}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    createCoworkerMutation.isPending || !isValid
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  <Save size={14} />
                  <span>{createCoworkerMutation.isPending ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User className="text-white w-3 h-3" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Profile Photo
                  </h2>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors text-sm"
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="text-white w-3 h-3" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Professional Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Position *
                        </label>
                        <div className="relative">
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter or select position"
                            className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewOptionContext({ type: 'position' });
                              setShowNewOptionModal(true);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {errors.position && (
                          <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Company *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter company name"
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewOptionContext({ type: 'company' });
                              setShowNewOptionModal(true);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {errors.company && (
                          <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Department
                        </label>
                        <div className="relative">
                          <select
                            {...field}
                            className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                          >
                            <option value="">Select department</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                          <button
                            type="button"
                            onClick={() => {
                              setNewOptionContext({ type: 'department' });
                              setShowNewOptionModal(true);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('location')}
                        type="text"
                        placeholder="City, Country"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position Description
                    {watchedPositionDescription && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({watchedPositionDescription.length}/500 characters)
                      </span>
                    )}
                  </label>
                  <textarea
                    {...register('positionDescription')}
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe the role and responsibilities..."
                  />
                  {errors.positionDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.positionDescription.message}</p>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Tag className="text-white w-3 h-3" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Skills & Expertise
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOptionContext({ type: 'skill' });
                      setShowNewOptionModal(true);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Add Skill</span>
                  </button>
                </div>
                
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-orange-500 dark:hover:border-orange-400 transition-colors"
                      >
                        <span className="text-sm">
                          {field.value?.length ? `${field.value.length} skills selected` : 'Select skills'}
                        </span>
                        <ChevronDown size={16} className={`transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showTagDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {skillOptions.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleSkillSelect(skill)}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                field.value?.includes(skill)
                                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{skill}</span>
                                {field.value?.includes(skill) && <Check size={14} />}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-md text-xs"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => handleSkillSelect(skill)}
                                className="hover:text-orange-800 dark:hover:text-orange-200"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Contract Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Contract Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contract Type
                    </label>
                    <select
                      {...register('contractType')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contractor">Contractor</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary (Optional)
                    </label>
                    <input
                      {...register('salary', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.salary && (
                      <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Social Links
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('linkedin')}
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-red-500 text-xs mt-1">{errors.linkedin.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Skype
                    </label>
                    <input
                      {...register('skype')}
                      type="text"
                      placeholder="skype-username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <NewOptionModal
          isOpen={showNewOptionModal}
          onClose={() => {
            setShowNewOptionModal(false);
            setNewOptionContext(null);
          }}
          context={newOptionContext}
          onSave={handleNewOptionSave}
        />
      </div>
    </ErrorBoundary>
  );
};

export default NewCoworker;