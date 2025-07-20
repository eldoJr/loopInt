import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Calculator, Mail, FileText, Check, MoreVertical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { format, parse, isValid } from 'date-fns';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  taxType: string;
}

interface InvoiceFormData {
  header: string;
  description: string;
  invoiceNo: string;
  poNumber: string;
  invoiceDate: string;
  supplyDate: string;
  dueDate: string;
  customer: string;
  project: string;
  paymentType: string;
  bankAccount: string;
  language: string;
  currency: string;
  items: InvoiceItem[];
}

interface TaxInvoiceProps {
  onNavigateBack?: () => void;
  onNavigateToInvoices?: () => void;
}

const TaxInvoice: React.FC<TaxInvoiceProps> = ({ onNavigateBack, onNavigateToInvoices }) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);

  const formatDate = (date: Date): string => {
    return format(date, 'MM/dd/yyyy');
  };

  // parseDate is used indirectly through handleDateChange

  const handleDateChange = (field: 'invoiceDate' | 'supplyDate' | 'dueDate', value: string) => {
    try {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        handleChange(field, formatDate(parsedDate));
      }
    } catch {
      // Invalid date format, don't update
    }
  };
  
  // Helper function to convert MM/DD/YYYY to YYYY-MM-DD for date inputs
  const getDateInputValue = (dateString: string): string => {
    try {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const today = new Date();
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    header: '',
    description: '',
    invoiceNo: 'TI/17/2025/DEF',
    poNumber: '',
    invoiceDate: formatDate(today),
    supplyDate: formatDate(today),
    dueDate: formatDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)), // 14 days from now
    customer: '',
    project: '',
    paymentType: '',
    bankAccount: '',
    language: 'English',
    currency: 'INR (Indian Rupee, ₹)',
    items: [{
      id: '1',
      name: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      taxRate: 18,
      taxType: 'Standard 18% (18%)'
    }]
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts and click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(fakeEvent);
      }
      if (e.key === 'Escape') {
        setShowDueDateDropdown(false);
        onNavigateToInvoices?.();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (showDueDateDropdown && !(e.target as Element).closest('.due-date-dropdown-container')) {
        setShowDueDateDropdown(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onNavigateToInvoices, showDueDateDropdown]);

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unit: '',
      unitPrice: 0,
      taxRate: 18,
      taxType: 'Standard 18% (18%)'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    const totalTax = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal * item.taxRate / 100);
    }, 0);
    
    const total = subtotal + totalTax;
    
    return { subtotal, totalTax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaved(true);
      setTimeout(() => onNavigateToInvoices?.(), 1000);
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const { subtotal, totalTax, total } = calculateTotals();

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Invoices', onClick: onNavigateToInvoices },
    { label: 'New Tax Invoice' }
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">New Tax Invoice</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onNavigateToInvoices}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Mail size={14} />
                <span>Save & Send</span>
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
              >
                <FileText size={14} />
                <span>Save Draft</span>
              </button>
              <button 
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Check size={14} />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-6">
            {/* Main Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column - Invoice Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                    Invoice Information
                  </h2>
                  
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Tax invoice header
                    </label>
                    <div className="col-span-9">
                      <input
                        type="text"
                        placeholder="Tax invoice"
                        value={formData.header}
                        onChange={(e) => handleChange('header', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-start">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right pt-2">
                      Tax invoice description
                    </label>
                    <div className="col-span-9">
                      <div className="relative">
                        <textarea
                          placeholder="Add description"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                          rows={3}
                          maxLength={300}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-500">
                          {formData.description.length}/300
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Tax Invoice No.
                    </label>
                    <div className="col-span-9">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.invoiceNo}
                          onChange={(e) => handleChange('invoiceNo', e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        <button type="button" className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex-none">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      PO number
                    </label>
                    <div className="col-span-9">
                      <input
                        type="text"
                        placeholder="PO number"
                        value={formData.poNumber}
                        onChange={(e) => handleChange('poNumber', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                      Dates
                    </label>
                    <div className="col-span-9">
                      <div className="flex flex-col space-y-2">
                        {/* Invoice Date */}
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-600 dark:text-gray-300">Invoice:</div>
                          <div className="relative w-48">
                            <Calendar 
                              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer z-10" 
                              onClick={() => {
                                const today = new Date();
                                handleChange('invoiceDate', formatDate(today));
                              }}
                            />
                            <input
                              type="date"
                              value={getDateInputValue(formData.invoiceDate)}
                              onChange={(e) => handleDateChange('invoiceDate', e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            />
                          </div>
                        </div>
                        
                        {/* Supply Date */}
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-600 dark:text-gray-300">Supply:</div>
                          <div className="relative w-48">
                            <Calendar 
                              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer z-10" 
                              onClick={() => {
                                const today = new Date();
                                handleChange('supplyDate', formatDate(today));
                              }}
                            />
                            <input
                              type="date"
                              value={getDateInputValue(formData.supplyDate)}
                              onChange={(e) => handleDateChange('supplyDate', e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            />
                          </div>
                        </div>
                        
                        {/* Due Date */}
                        <div className="flex items-center">
                          <div className="w-24 text-sm text-gray-600 dark:text-gray-300">Due:</div>
                          <div className="flex gap-2">
                            <div className="relative">
                              <Calendar 
                                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 cursor-pointer z-10"
                                onClick={() => {
                                  const today = new Date();
                                  handleChange('dueDate', formatDate(today));
                                }}
                              />
                              <input
                                type="date"
                                value={getDateInputValue(formData.dueDate)}
                                onChange={(e) => handleDateChange('dueDate', e.target.value)}
                                className="w-48 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg pl-10 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                              />
                            </div>
                            <div className="relative due-date-dropdown-container">
                              <button 
                                type="button" 
                                className="p-1.5 text-gray-600 dark:text-gray-300 flex-none hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded"
                                onClick={() => setShowDueDateDropdown(!showDueDateDropdown)}
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              {showDueDateDropdown && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                  <div className="p-2">
                                    <div className="mb-2 font-medium text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1">
                                      Payment Terms
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const today = new Date();
                                        const formattedDate = formatDate(today);
                                        handleChange('dueDate', formattedDate);
                                        setShowDueDateDropdown(false);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    >
                                      On receipt
                                    </button>
                                    
                                    {[7, 14, 30, 45, 60].map(days => {
                                      const dueDate = new Date();
                                      dueDate.setDate(dueDate.getDate() + days);
                                      const formattedDate = formatDate(dueDate);
                                      
                                      return (
                                        <button 
                                          key={days}
                                          type="button"
                                          onClick={() => {
                                            handleChange('dueDate', formattedDate);
                                            setShowDueDateDropdown(false);
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                        >
                                          <div className="flex justify-between">
                                            <span>{days} days</span>
                                            <span className="text-gray-500">{formattedDate}</span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Empty column for spacing */}
              <div className="hidden lg:block lg:col-span-1"></div>
              
              {/* Right Column - Additional Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4 pr-4">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                    Additional Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Customer
                      </label>
                      <div className="col-span-9">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 inline-block">
                            <select
                              value={formData.customer || 'Choose customer'}
                              onChange={(e) => handleChange('customer', e.target.value === 'Choose customer' ? '' : e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            >
                              <option value="">Choose customer</option>
                              <option value="Customer 1">Customer 1</option>
                              <option value="Customer 2">Customer 2</option>
                              <option value="Customer 3">Customer 3</option>
                            </select>
                          </div>
                          <button type="button" className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex-none">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Project
                      </label>
                      <div className="col-span-9">
                        <select
                          value={formData.project || 'Choose project'}
                          onChange={(e) => handleChange('project', e.target.value === 'Choose project' ? '' : e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          <option value="">Choose project</option>
                          <option value="Project 1">Project 1</option>
                          <option value="Project 2">Project 2</option>
                          <option value="Project 3">Project 3</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Payment type
                      </label>
                      <div className="col-span-9">
                        <select
                          value={formData.paymentType || 'Payment type'}
                          onChange={(e) => handleChange('paymentType', e.target.value === 'Payment type' ? '' : e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          <option value="">Payment type</option>
                          <option value="Cash">Cash</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Card">Card</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Bank account
                      </label>
                      <div className="col-span-9">
                        <input
                          type="text"
                          placeholder="Bank account number"
                          value={formData.bankAccount}
                          onChange={(e) => handleChange('bankAccount', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Language
                      </label>
                      <div className="col-span-9">
                        <select
                          value={formData.language}
                          onChange={(e) => handleChange('language', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-xs text-gray-500">Translated items will display in the pdf</span>
                          <button type="button" className="text-xs text-blue-600 hover:text-blue-800">
                            Add second language
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center">
                      <label className="col-span-3 text-sm font-medium text-gray-600 dark:text-gray-300 text-right">
                        Currency
                      </label>
                      <div className="col-span-9">
                        <select
                          value={formData.currency}
                          onChange={(e) => handleChange('currency', e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        >
                          <option value="INR (Indian Rupee, ₹)">INR (Indian Rupee, ₹)</option>
                          <option value="USD (US Dollar, $)">USD (US Dollar, $)</option>
                          <option value="EUR (Euro, €)">EUR (Euro, €)</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount due:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹ {total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sub total:</span>
                        <span className="text-gray-900 dark:text-white">₹ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total tax:</span>
                        <span className="text-gray-900 dark:text-white">₹ {totalTax.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/50 pb-2">
                Items
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700/50">
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">NAME</th>
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">QTY</th>
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">UNIT</th>
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">UNIT PRICE NET</th>
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">TAX</th>
                      <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">GROSS AMOUNT</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800/30">
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            placeholder="Item name"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="w-20 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            placeholder="Unit"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          />
                        </td>
                        <td className="p-3">
                          <select
                            value={item.taxType}
                            onChange={(e) => {
                              const value = e.target.value;
                              const taxRate = value === 'Standard 18% (18%)' ? 18 : 
                                             value === 'Reduced 5% (5%)' ? 5 : 0;
                              updateItem(item.id, 'taxType', value);
                              updateItem(item.id, 'taxRate', taxRate);
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          >
                            <option value="Standard 18% (18%)">Standard 18% (18%)</option>
                            <option value="Reduced 5% (5%)">Reduced 5% (5%)</option>
                            <option value="Zero 0% (0%)">Zero 0% (0%)</option>
                          </select>
                        </td>
                        <td className="p-3 text-right text-gray-900 dark:text-white">
                          ₹ {((item.quantity * item.unitPrice) + (item.quantity * item.unitPrice * item.taxRate / 100)).toFixed(2)}
                        </td>
                        <td className="p-3">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={addNewItem}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add new Item
                </button>
                <button type="button" className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm">
                  Save new products
                </button>
              </div>

              {/* Total Summary */}
              <div className="flex justify-end">
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg w-80">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="text-green-600 dark:text-green-400" size={20} />
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Total</h4>
                    <div className="ml-auto text-xl font-bold text-gray-900 dark:text-white">
                      ₹ {total.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Sub total</span>
                      <span className="text-gray-900 dark:text-white">₹ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total tax</span>
                      <span className="text-gray-900 dark:text-white">₹ {totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700/50 pt-2">
                      <span className="text-gray-800 dark:text-white">Amount due</span>
                      <span className="text-gray-900 dark:text-white">₹ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        
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

export default TaxInvoice;