import { useState, useEffect, useCallback } from 'react';
import { Save, X, Upload, Plus, Linkedin, MessageSquare, AlertCircle, Bold, Italic, Underline, Link } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Toggle } from '../../components/ui/Toggle';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [textStyles, setTextStyles] = useState({ bold: false, italic: false, underline: false });

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
  const sources = ['Contact source', 'LinkedIn', 'Referral', 'Website', 'Event'];
  const positions = ['Contact person position', 'Manager', 'Developer', 'Designer', 'Analyst'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean | File | null | string[] | { type: string; url: string }[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      
      const teamMemberData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        photoUrl: formData.photo ? null : null, // Handle file upload separately
        isIndividual: formData.isIndividual,
        company: formData.company === 'Choose company' ? null : formData.company,
        source: formData.source === 'Contact source' ? null : formData.source,
        position: formData.position === 'Contact person position' ? null : formData.position,
        positionDescription: formData.positionDescription.trim() || null,
        phoneNumbers: formData.phoneNumbers.filter(phone => phone.trim()),
        skype: formData.skype.trim() || null,
        linkedin: formData.linkedin.trim() || null,
        additionalLinks: formData.additionalLinks.filter(link => link.url.trim()),
        addressLine1: formData.addressLine1.trim() || null,
        addressLine2: formData.addressLine2?.trim() || null,
        zipCode: formData.zipCode.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        country: formData.country.trim() || null,
        description: formData.description.trim() || null,
        status: 'active',
        createdBy: currentUser?.id
      };
      
      const response = await fetch('http://localhost:3000/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamMemberData)
      });
      
      if (response.ok) {
        console.log('Team member created successfully');
        onNavigateToTeam?.();
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create team member');
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
      
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">New Coworker</h1>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onNavigateToTeam}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  saving
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Section 1 - Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Basic Information
              </h2>
              
              {/* Photo Upload */}
              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                  Photo
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
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
                      <p className="text-sm text-gray-300">Upload photo</p>
                      <p className="text-xs text-gray-500">JPG, JPEG, PNG (max 5MB)</p>
                    </div>
                  </div>
                  {errors.photo && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.photo}
                    </div>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  First Name *
                </label>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.firstName 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Last Name *
                </label>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.lastName 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Email *
                </label>
                <div className="col-span-9">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-gray-700/50 focus:ring-blue-500/50'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Toggle */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
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
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Company
                </label>
                <div className="col-span-3">
                  <select
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <label className="col-span-2 text-sm font-medium text-gray-300 text-right">
                  Source
                </label>
                <div className="col-span-2">
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                  Position
                </label>
                <div className="col-span-1">
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Position Description */}
              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                  Position Description
                </label>
                <div className="col-span-9">
                  <div className="relative">
                    <textarea
                      value={formData.positionDescription}
                      onChange={(e) => handleInputChange('positionDescription', e.target.value)}
                      rows={3}
                      maxLength={300}
                      className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.positionDescription 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                      placeholder="Describe the position..."
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {formData.positionDescription.length}/300
                    </div>
                  </div>
                  {errors.positionDescription && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.positionDescription}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2 - Contact and Address */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                Contact and Address
              </h2>
              
              {/* Skype and LinkedIn */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Skype
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.skype}
                      onChange={(e) => handleInputChange('skype', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Skype username"
                    />
                  </div>
                </div>
                <label className="col-span-1 text-sm font-medium text-gray-300 text-right">
                  LinkedIn
                </label>
                <div className="col-span-4">
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Links */}
              {formData.additionalLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                    Additional Link {index + 1}
                  </label>
                  <div className="col-span-3">
                    <select
                      value={link.type}
                      onChange={(e) => updateAdditionalLink(index, 'type', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="Website">Website</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="GitHub">GitHub</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateAdditionalLink(index, 'url', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter URL"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeAdditionalLink(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3"></div>
                <div className="col-span-9">
                  <button
                    type="button"
                    onClick={addAdditionalLink}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add another link</span>
                  </button>
                </div>
              </div>

              {/* Phone Numbers */}
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                    Phone {index === 0 ? '' : `${index + 1}`}
                  </label>
                  <div className="col-span-8">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => updatePhoneNumber(index, e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter phone number"
                    />
                  </div>
                  {index > 0 && (
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removePhoneNumber(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {formData.phoneNumbers.length < 3 && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={addPhoneNumber}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add 2nd phone number</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Address Fields */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Address Line 1
                </label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Enter address line 1"
                  />
                </div>
              </div>

              {formData.addressLine2 !== undefined && (
                <div className="grid grid-cols-12 gap-4 items-center">
                  <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                    Address Line 2
                  </label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter address line 2"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange('addressLine2', '')}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              {formData.addressLine2 === undefined && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <div className="col-span-9">
                    <button
                      type="button"
                      onClick={() => handleInputChange('addressLine2', '')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add 2nd line of address</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right">
                  Location
                </label>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Zip code"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="City"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="State"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Rich Text Description */}
              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-300 text-right pt-2">
                  Description
                </label>
                <div className="col-span-9">
                  <div className="flex items-center space-x-1 p-2 bg-gray-800/30 border border-gray-700/50 rounded-t-lg">
                    <Toggle
                      pressed={textStyles.bold}
                      onPressedChange={() => handleTextStyle('bold')}
                    >
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.italic}
                      onPressedChange={() => handleTextStyle('italic')}
                    >
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                      pressed={textStyles.underline}
                      onPressedChange={() => handleTextStyle('underline')}
                    >
                      <Underline className="h-4 w-4" />
                    </Toggle>
                    <button type="button" className="p-1 text-gray-400 hover:text-gray-300">
                      <Link className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      maxLength={999}
                      className={`w-full bg-gray-800/50 border rounded-b-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.description 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-gray-700/50 focus:ring-blue-500/50'
                      }`}
                      placeholder="Enter description..."
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {formData.description.length}/999
                    </div>
                  </div>
                  {errors.description && (
                    <div className="flex items-center mt-1 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {errors.submit && (
          <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCoworker;