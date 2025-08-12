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
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';
import { coworkerSchema } from '../../schemas/coworkerSchema';
import { useUpdateCoworker } from '../../hooks/useCoworkers';
import { mockTeamMembers } from '../../data/mockTeamData';

interface EditCoworkerProps {
  memberId: string;
  onNavigateBack?: () => void;
  onNavigateToTeam?: () => void;
}

const EditCoworker = ({
  memberId,
  onNavigateBack,
  onNavigateToTeam,
}: EditCoworkerProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const updateCoworkerMutation = useUpdateCoworker();

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


  useEffect(() => {
    const loadMemberData = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const member = mockTeamMembers.find(m => m.id === memberId);
        
        if (member) {
          setValue('firstName', member.firstName);
          setValue('lastName', member.lastName);
          setValue('email', member.email);
          setValue('phone', member.phone);
          setValue('position', member.position);
          setValue('company', member.company);
          setValue('location', member.location);
          setValue('status', member.status);
          setValue('contractType', member.contractType || 'full-time');
          setValue('department', member.department || '');
          setValue('skills', member.skills || []);
          setValue('salary', member.salary || 0);
          setValue('positionDescription', '');
          setValue('linkedin', member.linkedin || '');
          setValue('skype', member.skype || '');
          setValue('isIndividual', member.isIndividual);

          if (member.photo) {
            setPhotoPreview(member.photo);
          }
        }
      } catch (error) {
        console.error('Error loading member data:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setShowContent(true), 200);
      }
    };

    loadMemberData();
  }, [memberId, setValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isValid) {
          handleSubmit(onSubmit)();
        }
      }
      if (e.key === 'Escape') {
        onNavigateToTeam?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isValid, onNavigateToTeam, handleSubmit]);

  const onSubmit = (data: any) => {
    updateCoworkerMutation.mutate({ id: memberId, data }, {
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

  const addNewSkill = () => {
    const skillName = prompt('Enter new skill:');
    if (skillName && skillName.trim()) {
      handleSkillSelect(skillName.trim());
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team', onClick: onNavigateToTeam },
    { label: 'Edit Coworker' },
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
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
                  Edit Team Member
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
                  disabled={!isValid || updateCoworkerMutation.isPending}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    isValid && !updateCoworkerMutation.isPending
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={14} />
                  <span>{updateCoworkerMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
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
                        {...register('firstName')}
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
                        {...register('lastName')}
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
                        {errors.firstName?.message || errors.lastName?.message}
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
                        {...register('email')}
                        type="email"
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
                        {...register('phone')}
                        type="tel"
                        placeholder="Phone number"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.phone
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-emerald-500/50'
                        }`}
                      />
                    </div>
                  </div>
                  {(errors.email || errors.phone) && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email?.message || errors.phone?.message}
                      </p>
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
                      <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
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
                        )}
                      />
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Controller
                        name="company"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
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
                        )}
                      />
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {(errors.position || errors.company) && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">
                        {errors.position?.message || errors.company?.message}
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
                        {...register('location')}
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
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        )}
                      />
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1 relative">
                      <Controller
                        name="contractType"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                          >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contractor">Contractor</option>
                            <option value="intern">Intern</option>
                          </select>
                        )}
                      />
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
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                          >
                            <option value="">Select department...</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        )}
                      />
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register('salary', { valueAsNumber: true })}
                        type="number"
                        placeholder="Annual salary"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-right">
                      Skills
                    </label>
                    <button
                      type="button"
                      onClick={addNewSkill}
                      className="ml-2 p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded transition-colors"
                      title="Add new skill"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
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
                            {watchedSkills && watchedSkills.length > 0
                              ? `${watchedSkills.length} skills selected`
                              : 'Select skills...'}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform flex-shrink-0 ${showSkillDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showSkillDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                          <div className="p-3">
                            <button
                              type="button"
                              onClick={addNewSkill}
                              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/30 transition-colors text-sm"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add New Skill</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {watchedSkills && watchedSkills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {watchedSkills.map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-400 text-xs rounded-md"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleSkillSelect(skill)}
                              className="hover:text-orange-800 dark:hover:text-orange-300"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Position Description */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-start">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right sm:pt-2">
                    Position Description
                  </label>
                  <div className="sm:col-span-9">
                    <textarea
                      {...register('positionDescription')}
                      rows={3}
                      placeholder="Describe the role and responsibilities..."
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm resize-none ${
                        errors.positionDescription
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {watchedPositionDescription?.length || 0}/500 characters
                      </span>
                      {errors.positionDescription && (
                        <p className="text-red-500 text-xs">{errors.positionDescription.message}</p>
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
                        {...register('linkedin')}
                        type="url"
                        placeholder="LinkedIn profile URL"
                        className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg pl-10 pr-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                          errors.linkedin
                            ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                            : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register('skype')}
                        placeholder="Skype username"
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                      />
                    </div>
                  </div>
                  {errors.linkedin && (
                    <div className="sm:col-span-9 sm:col-start-4">
                      <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
                    </div>
                  )}
                </div>

                {/* Individual Contractor Toggle */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Contractor Type
                  </label>
                  <div className="sm:col-span-9">
                    <Controller
                      name="isIndividual"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto ${
                            field.value
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
                              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700/50'
                          }`}
                        >
                          <span>
                            {field.value ? 'Individual Contractor' : 'Company Employee'}
                          </span>
                        </button>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 - File Upload */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Documents
                  </h2>
                </div>

                {/* Resume Upload */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 sm:col-span-3 sm:text-right">
                    Resume/CV
                  </label>
                  <div className="sm:col-span-9">
                    <Controller
                      name="resumeFile"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file || null);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Upload className="w-4 h-4" />
                                <span>Choose file</span>
                              </div>
                            </div>
                          </div>
                          {field.value && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                              <span>{field.value.name}</span>
                              <button
                                type="button"
                                onClick={() => field.onChange(null)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {updateCoworkerMutation.isError && (
            <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <span>Failed to update team member. Please try again.</span>
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
                {updateCoworkerMutation.isSuccess && (
                  <div className="flex items-center space-x-1 text-green-500 dark:text-green-400">
                    <Check size={14} />
                    <span>Saved</span>
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

export default EditCoworker;