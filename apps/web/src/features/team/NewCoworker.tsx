import { useState, useEffect, useCallback } from 'react';
import { Save, X, Upload, Plus, Linkedin, MessageSquare, AlertCircle, Bold, Italic, Underline, Link, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Toggle } from '../../components/ui/Toggle';
import CustomSelect from '../../components/ui/CustomSelect';

interface NewCoworkerProps {
  onNavigateBack?: () => void;
  onNavigateToTeam?: () => void;
}

interface FormData {
  photo: File | null;
  firstName: string;
  lastName: string;
  email: string;
  isIndividual: boolean;
  company: string;
  source: string;
  position: string;
  positionDescription: string;
  skype: string;
  linkedin: string;
  additionalLinks: { type: string; url: string }[];
  phoneNumbers: string[];
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  description: string;
}

const NewCoworker = ({ onNavigateBack, onNavigateToTeam }: NewCoworkerProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [textStyles, setTextStyles] = useState({ bold: false, italic: false, underline: false, strikethrough: false });
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [positionDescLength, setPositionDescLength] = useState(0);
  const maxPositionDescLength = 300;

  const [formData, setFormData] = useState<FormData>({
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    isIndividual: false,
    company: '',
    source: '',
    position: '',
    positionDescription: '',
    skype: '',
    linkedin: '',
    additionalLinks: [],
    phoneNumbers: [''],
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
    description: ''
  });

  const companies = ['Choose company', 'Company A', 'Company B', 'Company C'];
  const positions = [
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

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean | File | null | string[] | { type: string; url: string }[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'positionDescription' && typeof value === 'string') {
      setPositionDescLength(value.length);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Please upload JPG, JPEG, or PNG format only' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const addAdditionalLink = () => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: [...prev.additionalLinks, { type: 'Website', url: '' }]
    }));
  };

  const updateAdditionalLink = (index: number, field: 'type' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeAdditionalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks.filter((_, i) => i !== index)
    }));
  };

  const addPhoneNumber = () => {
    if (formData.phoneNumbers.length < 3) {
      setFormData(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => i === index ? value : phone)
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.positionDescription.length > 300) {
      newErrors.positionDescription = 'Position description must be under 300 characters';
    }
    if (formData.description.length > 999) {
      newErrors.description = 'Description must be under 999 characters';
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
      
      // Add photo file if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      
      // Add all other fields
      formDataToSend.append('firstName', formData.firstName.trim());
      formDataToSend.append('lastName', formData.lastName.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('isIndividual', formData.isIndividual.toString());
      if (formData.company !== 'Choose company') formDataToSend.append('company', formData.company);
      if (formData.source !== 'Contact source') formDataToSend.append('source', formData.source);
      if (formData.position !== 'Contact person position') formDataToSend.append('position', formData.position);
      if (formData.positionDescription.trim()) formDataToSend.append('positionDescription', formData.positionDescription.trim());
      formDataToSend.append('phoneNumbers', JSON.stringify(formData.phoneNumbers.filter(phone => phone.trim())));
      if (formData.skype.trim()) formDataToSend.append('skype', formData.skype.trim());
      if (formData.linkedin.trim()) formDataToSend.append('linkedin', formData.linkedin.trim());
      formDataToSend.append('additionalLinks', JSON.stringify(formData.additionalLinks.filter(link => link.url.trim())));
      if (formData.addressLine1.trim()) formDataToSend.append('addressLine1', formData.addressLine1.trim());
      if (formData.addressLine2?.trim()) formDataToSend.append('addressLine2', formData.addressLine2.trim());
      if (formData.zipCode.trim()) formDataToSend.append('zipCode', formData.zipCode.trim());
      if (formData.city.trim()) formDataToSend.append('city', formData.city.trim());
      if (formData.state.trim()) formDataToSend.append('state', formData.state.trim());
      if (formData.country.trim()) formDataToSend.append('country', formData.country.trim());
      if (formData.description.trim()) formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('status', 'active');
      if (currentUser?.id) formDataToSend.append('createdBy', currentUser.id);
      
      const response = await fetch('http://localhost:3000/team', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        console.log('Team member created successfully');
        onNavigateToTeam?.();
      } else {
        let errorMessage = 'Failed to create team member';
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
      console.error('Error saving team member:', error);
      setErrors({ submit: 'Failed to save team member. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTextStyle = (style: keyof typeof textStyles) => {
    setTextStyles(prev => ({ ...prev, [style]: !prev[style] }));
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    setTextAlign(align);
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team', onClick: onNavigateToTeam },
    { label: 'New Coworker' }
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Coworker</h1>
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
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
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
                      <p className="text-sm text-gray-700 dark:text-gray-300">Upload photo</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">JPG, JPEG, PNG (max 5MB)</p>
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
                <label className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
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

              {/* Individual Toggle */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Individual Contractor
                </label>
                <div className="col-span-9">
                  <Toggle
                    pressed={formData.isIndividual}
                    onPressedChange={(pressed) => handleInputChange('isIndividual', pressed)}
                  >
                    <span className="text-sm">
                      {formData.isIndividual ? 'Individual contractor' : 'Company employee'}
                    </span>
                  </Toggle>
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Company
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={companies}
                    value={formData.company}
                    onChange={(value) => handleInputChange('company', value)}
                  />
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Position
                </label>
                <div className="col-span-4">
                  <CustomSelect
                    options={positions}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
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
                      value={formData.positionDescription}
                      onChange={(e) => handleInputChange('positionDescription', e.target.value)}
                      rows={3}
                      maxLength={maxPositionDescLength}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-b-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-sm"
                      placeholder="Describe the position..."
                      style={{
                        fontWeight: textStyles.bold ? 'bold' : 'normal',
                        fontStyle: textStyles.italic ? 'italic' : 'normal',
                        textDecoration: `${textStyles.underline ? 'underline' : ''} ${textStyles.strikethrough ? 'line-through' : ''}`.trim(),
                        textAlign: textAlign
                      }}
                    />
                    
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between px-3">
                      <span className={`text-xs ${
                        positionDescLength > maxPositionDescLength * 0.9 
                          ? 'text-red-500 dark:text-red-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {positionDescLength}/{maxPositionDescLength} characters
                      </span>
                      <div className="flex items-center space-x-2">
                        {errors.positionDescription && (
                          <div className="flex items-center space-x-1 text-red-500 dark:text-red-400">
                            <AlertCircle size={14} />
                            <span className="text-xs">{errors.positionDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 - Contact and Address */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Contact and Address
              </h2>
              
              {/* Skype and LinkedIn */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Skype
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.skype}
                      onChange={(e) => handleInputChange('skype', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Skype username"
                    />
                  </div>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  LinkedIn
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Links */}
              {formData.additionalLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Additional Link {index + 1}
                  </label>
                  <div className="col-span-3">
                    <CustomSelect
                      options={['Website', 'Portfolio', 'GitHub', 'Twitter']}
                      value={link.type}
                      onChange={(value) => updateAdditionalLink(index, 'type', value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateAdditionalLink(index, 'url', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Enter URL"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeAdditionalLink(index)}
                      className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3"></div>
                <div className="col-span-9">
                  <button
                    type="button"
                    onClick={addAdditionalLink}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                  >
                    <Plus size={14} />
                    <span>Add another link</span>
                  </button>
                </div>
              </div>

              {/* Phone Numbers */}
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Phone* {index === 0 ? '' : `${index + 1}`}
                  </label>
                  <div className="col-span-8">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => updatePhoneNumber(index, e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Enter phone number"
                    />
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
                      <span>Add 2nd phone number</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Address Fields */}
              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Address Line 1
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Enter address line 1"
                  />
                </div>
              </div>

              {formData.addressLine2 !== undefined && (
                <div className="grid grid-cols-12 gap-3 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                    Address Line 2
                  </label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      placeholder="Enter address line 2"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange('addressLine2', '')}
                      className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              {formData.addressLine2 === undefined && (
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={() => handleInputChange('addressLine2', '')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                    >
                      <Plus size={14} />
                      <span>Add 2nd line of address</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-12 gap-3 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                  Location
                </label>
                <div className="col-span-2 mb-4">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Zip code"
                  />
                </div>
                <div className="col-span-2 mb-4">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="City"
                  />
                </div>
                <div className="col-span-2 mb-4">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="State"
                  />
                </div>
                <div className="col-span-3 mb-4">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    placeholder="Country"
                  />
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

export default NewCoworker;