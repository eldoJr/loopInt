import { useState, useEffect } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';

interface NewOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    type: 'skill' | 'position' | 'company' | 'department';
  } | null;
  onSave: (data: {
    module: string;
    field: string;
    language: string;
    optionName: string;
    isDefault: boolean;
    useInField: boolean;
  }) => void;
}

const NewOptionModal = ({ isOpen, onClose, context, onSave }: NewOptionModalProps) => {
  const [module, setModule] = useState('');
  const [field, setField] = useState('');
  const [language, setLanguage] = useState('en');
  const [optionName, setOptionName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [useInField, setUseInField] = useState(true);

  const modules = ['Coworking', 'Company'];
  const fields = ['Position', 'Skills', 'Company', 'Department'];

  // Pre-fill module and field based on context
  const getModuleFromContext = (type: string) => {
    return 'Coworking'; // All fields are part of Coworking module
  };

  const getFieldFromContext = (type: string) => {
    switch (type) {
      case 'skill': return 'Skills';
      case 'position': return 'Position';
      case 'company': return 'Company';
      case 'department': return 'Department';
      default: return '';
    }
  };

  // Update module and field when context changes
  useEffect(() => {
    if (isOpen && context?.type) {
      setModule(getModuleFromContext(context.type));
      setField(getFieldFromContext(context.type));
    }
  }, [isOpen, context?.type]);
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
  ];

  const handleSave = () => {
    if (module && field && optionName.trim()) {
      onSave({
        module,
        field,
        language,
        optionName: optionName.trim(),
        isDefault,
        useInField,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setModule('');
    setField('');
    setLanguage('en');
    setOptionName('');
    setIsDefault(false);
    setUseInField(true);
    onClose();
  };



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              New option
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Module and Field Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Module
                </label>
                <div className="relative">
                  <select
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Select module...</option>
                    {modules.map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field
                </label>
                <div className="relative">
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Select field...</option>
                    {fields.map(fld => (
                      <option key={fld} value={fld}>{fld}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Language and Option Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Option name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter option name..."
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!module || !field || !optionName.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      module && field && optionName.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default
                </label>
                <button
                  type="button"
                  onClick={() => setIsDefault(!isDefault)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isDefault ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      isDefault ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Use in field after saving
                </label>
                <button
                  type="button"
                  onClick={() => setUseInField(!useInField)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    useInField ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      useInField ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!module || !field || !optionName.trim()}
                className={`px-4 py-2 text-sm rounded font-medium transition-all ${
                  module && field && optionName.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOptionModal;