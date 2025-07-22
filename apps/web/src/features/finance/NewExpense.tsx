import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, ChevronDown, AlertCircle, Plus, Check, X, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';

interface NewExpenseProps {
  onNavigateBack?: () => void;
  onNavigateToExpenses?: () => void;
}

interface ExpenseItem {
  amount: string;
}

const NewExpense = ({ onNavigateBack, onNavigateToExpenses }: NewExpenseProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);
  const [showItems, setShowItems] = useState(true);
  const [showTaxes, setShowTaxes] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const [formData, setFormData] = useState({
    expenseName: '',
    vendor: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    currency: 'INR (Indian Rupee, ₹)',
    category: 'Advertising and marketing',
    description: '',
    project: '',
    items: [{ amount: '' }] as ExpenseItem[],
    total: 0
  });

  const categories = [
    'Advertising and marketing',
    'Office supplies',
    'Travel',
    'Meals',
    'Software',
    'Hardware',
    'Utilities',
    'Rent',
    'Other'
  ];

  const currencies = [
    'INR (Indian Rupee, ₹)',
    'USD (US Dollar, $)',
    'EUR (Euro, €)',
    'GBP (British Pound, £)'
  ];

  const calculateTotal = useCallback(() => {
    return formData.items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
  }, [formData.items]);

  const isFormValid = useMemo(() => {
    return formData.expenseName.trim().length > 0 && 
           formData.vendor.trim().length > 0 &&
           formData.date &&
           formData.items.some(item => parseFloat(item.amount) > 0);
  }, [formData.expenseName, formData.vendor, formData.date, formData.items]);

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

  // Update total whenever items change
  useEffect(() => {
    const newTotal = calculateTotal();
    setFormData(prev => ({
      ...prev,
      total: newTotal
    }));
  }, [formData.items, calculateTotal]);

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
    
    if (!formData.expenseName.trim()) newErrors.expenseName = 'Expense name is required';
    if (!formData.vendor.trim()) newErrors.vendor = 'Vendor is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    const hasValidItem = formData.items.some(item => parseFloat(item.amount) > 0);
    if (!hasValidItem) {
      newErrors.items = 'At least one item with a valid amount is required';
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
        expenseName: formData.expenseName.trim(),
        vendor: formData.vendor.trim(),
        date: formData.date,
        dueDate: formData.dueDate,
        currency: formData.currency,
        category: formData.category,
        description: formData.description.trim(),
        project: formData.project || null,
        items: formData.items,
        total: formData.total,
        created_by: currentUser?.id
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Expense data to be submitted:', expenseData);
      
      setIsSaved(true);
      showToast.success('Expense recorded successfully!');
      setTimeout(() => {
        if (onNavigateToExpenses) {
          onNavigateToExpenses();
        } else if (onNavigateBack) {
          onNavigateBack();
        }
      }, 1000);
    } catch (error) {
      console.error('Error recording expense:', error);
      showToast.error('Failed to record expense. Please try again.');
      setErrors({ submit: 'Failed to record expense. Please try again.' });
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
  };

  const addNewItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { amount: '' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemAmount = (index: number, amount: string) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], amount };
      return { ...prev, items: newItems };
    });
    
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
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
                onClick={() => {
                  if (onNavigateToExpenses) {
                    onNavigateToExpenses();
                  } else if (onNavigateBack) {
                    onNavigateBack();
                  }
                }}
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
            
            {/* Expense Name */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Expense name *
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  placeholder="Expense name"
                  value={formData.expenseName}
                  onChange={(e) => handleInputChange('expenseName', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                {errors.expenseName && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.expenseName}
                  </div>
                )}
              </div>
            </div>
            
            {/* Category */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Category *
              </label>
              <div className="col-span-8">
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
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

            {/* Vendor */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Vendor/Payee *
              </label>
              <div className="col-span-8">
                <input
                  type="text"
                  placeholder="Choose vendor"
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
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
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.date && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.date}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Due to
              </label>
              <div className="col-span-9">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Checkboxes instead of tabs */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3"></div>
              <div className="col-span-9 flex space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showItems}
                    onChange={() => setShowItems(!showItems)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Items</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTaxes}
                    onChange={() => setShowTaxes(!showTaxes)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Taxes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDescription}
                    onChange={() => setShowDescription(!showDescription)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show description</span>
                </label>
              </div>
            </div>

            {/* Items Section */}
            {showItems && (
              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Items
                </label>
                <div className="col-span-9 space-y-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    AMOUNT
                  </div>
                  
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={item.amount}
                        onChange={(e) => updateItemAmount(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-2 border-blue-300 dark:border-blue-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {errors.items && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.items}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={addNewItem}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add new item</span>
                  </button>
                </div>
              </div>
            )}

            {/* Taxes Section */}
            {showTaxes && (
              <div className="grid grid-cols-12 gap-4 items-start">
                <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                  Taxes
                </label>
                <div className="col-span-9">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tax settings will appear here</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Description Section */}
            {showDescription && (
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
            )}


          </div>

          {/* Total Section */}
          <div className="border-t border-gray-200 dark:border-gray-700/50 mt-6 pt-6">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹ {formData.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Amount due</span>
                    <span>₹ {formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Payments
              </label>
              <div className="col-span-9">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add payment</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Attachment
              </label>
              <div className="col-span-9">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add file</span>
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

export default NewExpense;