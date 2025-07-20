import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, ChevronDown, AlertCircle, Plus, Calculator, Check} from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

interface UndocumentedRevenueProps {
  onNavigateBack?: () => void;
  onNavigateToRevenues?: () => void;
}

const UndocumentedRevenue = ({ onNavigateBack, onNavigateToRevenues }: UndocumentedRevenueProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);

  const [formData, setFormData] = useState({
    customer: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    currency: 'INR (Indian Rupee, ₹)',
    amount: '',
    description: '',
    project: '',
    total: 0,
    amountDue: 0
  });

  const isFormValid = useMemo(() => {
    return formData.customer.trim().length > 0 && 
           formData.date && 
           formData.amount && 
           parseFloat(formData.amount) > 0;
  }, [formData.customer, formData.date, formData.amount]);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isFormValid) {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(fakeEvent);
        }
      }
      if (e.key === 'Escape') {
        onNavigateToRevenues?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormValid, onNavigateToRevenues]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer.trim()) newErrors.customer = 'Customer is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be under 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const revenueData = {
        customer: formData.customer.trim(),
        date: formData.date,
        currency: formData.currency,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        project: formData.project.trim() || null,
        created_by: currentUser?.id
      };
      
      const response = await fetch('http://localhost:3000/finance/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revenueData),
      });
      
      if (response.ok) {
        setIsSaved(true);
        showToast.success('Revenue recorded successfully!');
        setTimeout(() => onNavigateToRevenues?.(), 1000);
      } else {
        throw new Error('Failed to record revenue');
      }
    } catch (error) {
      console.error('Error recording revenue:', error);
      showToast.error('Failed to record revenue. Please try again.');
      setErrors({ submit: 'Failed to record revenue. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Update total and amount due when amount changes
    if (field === 'amount' && !isNaN(parseFloat(value))) {
      const amount = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        total: amount,
        amountDue: amount
      }));
    }
  };

  const addPayment = () => {
    // Placeholder for adding payment functionality
    console.log('Add payment clicked');
  };

  const addFile = () => {
    // Placeholder for adding file functionality
    console.log('Add file clicked');
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Finance', onClick: onNavigateToRevenues },
    { label: 'Undocumented Revenue' }
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
      showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Undocumented Revenue</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onNavigateToRevenues}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!isFormValid || saving}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  isFormValid && !saving
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <Check size={14} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Customer */}
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Revenue Information
              </h2>
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Customer
              </label>
              <div className="col-span-8">
                <div className="relative">
                  <select
                    value={formData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option value="">Choose customer</option>
                    <option>Customer A</option>
                    <option>Customer B</option>
                    <option>Customer C</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-1">
                <button className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Date */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Date
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Currency */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Currency
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option>INR (Indian Rupee, ₹)</option>
                    <option>USD (US Dollar, $)</option>
                    <option>EUR (Euro, €)</option>
                    <option>GBP (British Pound, £)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Amount
              </label>
              <div className="col-span-9">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-12 gap-4 items-start">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                Description
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Characters left: {500 - (formData.description?.length || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Project */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Project
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <select
                    value={formData.project}
                    onChange={(e) => handleInputChange('project', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option value="">Choose project</option>
                    <option>Project Alpha</option>
                    <option>Project Beta</option>
                    <option>Project Gamma</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Section */}
          <div className="border-t border-gray-200 dark:border-gray-700/50 mt-6 pt-6">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                        <Calculator size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹ {formData.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Amount due</span>
                    <span>₹ {formData.amountDue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="border-t border-gray-200 dark:border-gray-700/50 mt-6 pt-6">
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Payments
              </label>
              <div className="col-span-9">
                <button
                  onClick={addPayment}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm"
                >
                  <Plus size={14} />
                  Add payment
                </button>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="border-t border-gray-200 dark:border-gray-700/50 mt-6 pt-6">
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Attachment
              </label>
              <div className="col-span-9">
                <button
                  onClick={addFile}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm"
                >
                  <Plus size={14} />
                  Add file
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {errors.submit && (
          <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
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
              {isSaved && (
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
  );
};

export default UndocumentedRevenue;