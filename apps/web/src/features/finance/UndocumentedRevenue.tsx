import React, { useState } from 'react';
import { Plus, Calendar, ChevronDown, Calculator, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';

interface UndocumentedRevenueProps {
  onNavigateBack?: () => void;
  onNavigateToRevenues?: () => void;
}

const UndocumentedRevenue: React.FC<UndocumentedRevenueProps> = ({ onNavigateBack, onNavigateToRevenues }) => {
  useTheme();
  const [formData, setFormData] = useState({
    revenueName: '',
    category: 'Advertising and marketing',
    customer: '',
    date: '07/19/2025',
    currency: 'INR (Indian Rupee, ₹)',
    amount: '',
    description: '',
    project: '',
    total: 0.00,
    amountDue: 0.00
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update total when amount changes
    if (field === 'amount') {
      const numericValue = parseFloat(value as string) || 0;
      setFormData(prev => ({
        ...prev,
        total: numericValue,
        amountDue: numericValue
      }));
    }
  };

  const addPayment = () => {
    // Logic to add payment
    console.log('Add payment clicked');
  };

  const addFile = () => {
    // Logic to add file attachment
    console.log('Add file clicked');
  };

  const handleSave = () => {
    console.log('Saving revenue data:', formData);
    setTimeout(() => onNavigateToRevenues?.(), 500);
  };

  const handleCancel = () => {
    console.log('Cancelled');
    onNavigateToRevenues?.();
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Invoices', onClick: onNavigateToRevenues },
    { label: 'New Undocumented Revenue' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New undocumented revenue</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Check size={14} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Revenue Name */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Revenue name
              </label>
              <div className="col-span-9">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.revenueName}
                  onChange={(e) => handleInputChange('revenueName', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Category
              </label>
              <div className="col-span-8">
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                  >
                    <option>Advertising and marketing</option>
                    <option>Sales</option>
                    <option>Consulting</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-1">
                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Customer */}
            <div className="grid grid-cols-12 gap-4 items-center">
              <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                Customer
              </label>
              <div className="col-span-8">
                <div className="relative">
                  <select
                    value={formData.customer}
                    onChange={(e) => handleInputChange('customer', e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
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
                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
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
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
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
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
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
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
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
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
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
      </div>
    </div>
  );
};

export default UndocumentedRevenue;