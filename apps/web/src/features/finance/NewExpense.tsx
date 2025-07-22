import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, ChevronDown, AlertCircle, Plus, Receipt, Check, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

interface NewExpenseProps {
  onNavigateBack?: () => void;
  onNavigateToExpenses?: () => void;
}

const NewExpense = ({ onNavigateBack, onNavigateToExpenses }: NewExpenseProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);

  const [formData, setFormData] = useState({
    vendor: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    currency: 'USD (US Dollar, $)',
    amount: '',
    category: '',
    description: '',
    project: '',
    paymentMethod: 'Cash',
    receiptFile: null as File | null,
    total: 0
  });

  const categories = [
    'Office Supplies',
    'Travel',
    'Meals',
    'Software',
    'Hardware',
    'Utilities',
    'Rent',
    'Marketing',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'PayPal',
    'Other'
  ];

  const isFormValid = useMemo(() => {
    return formData.vendor.trim().length > 0 && 
           formData.date && 
           formData.amount && 
           parseFloat(formData.amount) > 0 &&
           formData.category;
  }, [formData.vendor, formData.date, formData.amount, formData.category]);

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
        if (onNavigateToExpenses) {
          onNavigateToExpenses();
        } else if (onNavigateBack) {
          onNavigateBack();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormValid, onNavigateToExpenses, onNavigateBack]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
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
      const expenseData = {
        vendor: formData.vendor.trim(),
        date: formData.date,
        currency: formData.currency,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        project: formData.project.trim() || null,
        paymentMethod: formData.paymentMethod,
        created_by: currentUser?.id
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Expense data to be submitted:', expenseData);
      
      setIsSaved(true);
      showToast.success('Expense recorded successfully!');
      setTimeout(() => onNavigateToExpenses?.() || onNavigateBack?.(), 1000);
    } catch (error) {
      console.error('Error recording expense:', error);
      showToast.error('Failed to record expense. Please try again.');
      setErrors({ submit: 'Failed to record expense. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Update total when amount changes
    if (field === 'amount' && typeof value === 'string' && !isNaN(parseFloat(value))) {
      const amount = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        total: amount
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('receiptFile', file);
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Finance', onClick: onNavigateToExpenses },
    { label: 'New Expense' }
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Expense</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onNavigateToExpenses?.() || onNavigateBack?.()}
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
            <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
              Expense Information
            </h2>
            
            {/* Vendor */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Vendor/Payee *
              </label>
              <div className="col-span-8">
                <div className="relative">
                  <select
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option value="">Choose vendor</option>
                    <option>Amazon</option>
                    <option>Office Depot</option>
                    <option>Uber</option>
                    <option>Staples</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.vendor && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.vendor}
                  </div>
                )}
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
                Date *
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.date && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.date}
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Category *
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.category && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.category}
                  </div>
                )}
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
                    <option>USD (US Dollar, $)</option>
                    <option>EUR (Euro, €)</option>
                    <option>GBP (British Pound, £)</option>
                    <option>INR (Indian Rupee, ₹)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Amount *
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
                {errors.amount && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.amount}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Payment Method
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
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

            {/* Receipt Upload */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Receipt
              </label>
              <div className="col-span-9">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer text-sm">
                    <Upload size={14} />
                    <span>Upload Receipt</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange}
                    />
                  </label>
                  {formData.receiptFile && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FileText size={14} className="text-blue-500" />
                      <span>{formData.receiptFile.name}</span>
                    </div>
                  )}
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
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center">
                        <Receipt size={14} className="text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      $ {formData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
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

export default NewExpense;