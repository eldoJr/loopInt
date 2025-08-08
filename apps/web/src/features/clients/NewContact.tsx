import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Plus,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Bold,
  Italic,
  Underline,
  Link,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Check,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Toggle } from '../../components/ui/Toggle';

interface NewClientProps {
  onNavigateBack?: () => void;
  onNavigateToNewContact?: () => void;
}

interface FormData {
  avatar: File | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  company: string;
  position: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  notes: string;
  status: string;
}

// Define the confirmation dialog props
interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const NewClient = ({
  onNavigateBack,
  onNavigateToNewContact,
}: NewClientProps) => {
  useTheme();
  //const modal = useModal();
  // Add a type-safe showConfirmation function
  const showConfirmation = (props: ConfirmationDialogProps) => {
    // In a real implementation, this would use the modal context
    // For now, just use a simple confirm dialog
    if (window.confirm(props.message)) {
      props.onConfirm();
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(
    'left'
  );
  const [notesLength, setNotesLength] = useState(0);
  const maxNotesLength = 999;

  const companies = [
    'Select company',
    'Acme Inc',
    'TechCorp',
    'Global Industries',
    'Innovate Solutions',
    'Summit Enterprises',
    'Other',
  ];

  const positions = [
    'Select position',
    'CEO',
    'CTO',
    'CFO',
    'COO',
    'Director',
    'Manager',
    'Developer',
    'Designer',
    'Consultant',
    'Analyst',
    'Other',
  ];

  const [formData, setFormData] = useState<FormData>({
    avatar: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumbers: [''],
    company: 'Select company',
    position: 'Select position',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
    notes: '',
    status: 'active',
  });

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
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = useCallback(
    (
      field: keyof FormData,
      value: string | boolean | File | null | string[]
    ) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (field === 'notes' && typeof value === 'string') {
        setNotesLength(value.length);
      }
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
      ];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please upload JPG, JPEG, PNG, or SVG format only',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'File size must be less than 5MB',
        }));
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const addPhoneNumber = () => {
    if (formData.phoneNumbers.length < 3) {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, ''],
      }));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) =>
        i === index ? value : phone
      ),
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.notes.length > maxNotesLength) {
      newErrors.notes = `Notes must be under ${maxNotesLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (
      formData.firstName.trim() ||
      formData.lastName.trim() ||
      formData.avatar ||
      formData.email.trim()
    ) {
      showConfirmation({
        title: 'Discard changes?',
        message:
          'You have unsaved changes. Are you sure you want to discard them?',
        confirmText: 'Discard',
        cancelText: 'Continue editing',
        onConfirm: () => onNavigateToNewContact?.(),
      });
    } else {
      onNavigateToNewContact?.();
    }
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

      // Add avatar file if exists
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      // Add all other fields
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      if (formData.email.trim())
        formDataToSend.append('email', formData.email.trim());
      formDataToSend.append(
        'phoneNumbers',
        JSON.stringify(formData.phoneNumbers.filter(phone => phone.trim()))
      );
      if (formData.company.trim())
        formDataToSend.append('company', formData.company.trim());
      if (formData.position.trim())
        formDataToSend.append('position', formData.position.trim());
      if (formData.addressLine1.trim())
        formDataToSend.append('addressLine1', formData.addressLine1.trim());
      if (formData.addressLine2?.trim())
        formDataToSend.append('addressLine2', formData.addressLine2.trim());
      if (formData.zipCode.trim())
        formDataToSend.append('zipCode', formData.zipCode.trim());
      if (formData.city.trim())
        formDataToSend.append('city', formData.city.trim());
      if (formData.state.trim())
        formDataToSend.append('state', formData.state.trim());
      if (formData.country.trim())
        formDataToSend.append('country', formData.country.trim());
      if (formData.notes.trim())
        formDataToSend.append('notes', formData.notes.trim());
      formDataToSend.append('status', formData.status);
      if (currentUser?.id) formDataToSend.append('createdBy', currentUser.id);

      const response = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        console.log('Client created successfully');
        onNavigateToNewContact?.();
      } else {
        let errorMessage = 'Failed to create client';
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
      console.error('Error saving client:', error);
      setErrors({ submit: 'Failed to save client. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Clients', onClick: onNavigateToNewContact },
    { label: 'New Client' },
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
              New Client
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
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
                <Check size={14} />
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

              <div>
                <ul>
                  {/* Avatar Upload */}
                  <li className="p-4 flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Profile Picture
                    </div>
                    <div className="w-2/3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-full flex items-center justify-center overflow-hidden">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                            onChange={handleAvatarUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Upload photo
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            JPG, JPEG, PNG, SVG (max 5MB)
                          </p>
                        </div>
                      </div>
                      {errors.avatar && (
                        <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.avatar}
                        </div>
                      )}
                    </div>
                  </li>

                  {/* First Name */}
                  <li className="p-4 flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      First Name *
                    </div>
                    <div className="w-2/3">
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
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Last Name */}
                  <li className="p-4 flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Last Name *
                    </div>
                    <div className="w-2/3">
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
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Company */}
                  <li className="p-4 flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Company
                    </div>
                    <div className="w-2/3">
                      <select
                        value={formData.company}
                        onChange={e =>
                          handleInputChange('company', e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {companies.map(company => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>

                  {/* Position */}
                  <li className="p-4 flex items-center">
                    <div className="w-1/3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Position
                    </div>
                    <div className="w-2/3">
                      <select
                        value={formData.position}
                        onChange={e =>
                          handleInputChange('position', e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        {positions.map(position => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 2 - Contact Information */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Contact Information
              </h2>

              {/* Email */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Email *
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className={`w-full bg-gray-50 dark:bg-gray-800/50 border rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                        errors.email
                          ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/50'
                          : 'border-gray-300 dark:border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Numbers */}
              {formData.phoneNumbers.map((phone, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center"
                >
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Phone * {index === 0 ? '' : `${index + 1}`}
                  </label>
                  <div className="col-span-8">
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => updatePhoneNumber(index, e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removePhoneNumber(index)}
                        className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {formData.phoneNumbers.length < 3 && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={addPhoneNumber}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add another phone number</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3 - Address */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Address
              </h2>

              {/* Address Fields */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Address Line 1
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={e =>
                        handleInputChange('addressLine1', e.target.value)
                      }
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Street address"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Address Line 2
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={e =>
                      handleInputChange('addressLine2', e.target.value)
                    }
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Suite, floor, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Location
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={e => handleInputChange('zipCode', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Zip code"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="City"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="State"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => handleInputChange('country', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 - Notes */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Additional Information
              </h2>

              <div className="grid grid-cols-12 gap-3 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Notes
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
                    <Toggle
                      pressed={textStyles.strikethrough}
                      onPressedChange={() => handleTextStyle('strikethrough')}
                      aria-label="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Toggle>

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                    <Toggle
                      pressed={textAlign === 'left'}
                      onPressedChange={() => handleTextAlign('left')}
                      aria-label="Align left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textAlign === 'center'}
                      onPressedChange={() => handleTextAlign('center')}
                      aria-label="Align center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textAlign === 'right'}
                      onPressedChange={() => handleTextAlign('right')}
                      aria-label="Align right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Toggle>

                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                    <Toggle aria-label="List">
                      <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Ordered list">
                      <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Link">
                      <Link className="h-4 w-4" />
                    </Toggle>
                    <Toggle aria-label="Code">
                      <Code className="h-4 w-4" />
                    </Toggle>
                  </div>

                  <div className="relative">
                    <textarea
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      rows={6}
                      maxLength={maxNotesLength}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-b-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-y text-sm"
                      placeholder="Add notes about this client..."
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration:
                          `${textStyles.underline ? 'underline' : ''} ${textStyles.strikethrough ? 'line-through' : ''}`.trim(),
                        textAlign: textAlign,
                        minHeight: '150px',
                      }}
                    />

                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-3">
                      <span
                        className={`text-xs ${
                          notesLength > maxNotesLength * 0.9
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {notesLength}/{maxNotesLength} characters
                      </span>
                      <div className="flex items-center space-x-2">
                        {errors.notes && (
                          <div className="flex items-center space-x-1 text-red-500 dark:text-red-400">
                            <AlertCircle size={14} />
                            <span className="text-xs">{errors.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resize handle indicator */}
                  <div className="w-full flex justify-center">
                    <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mt-1"></div>
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

export default NewClient;
