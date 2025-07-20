import { useState, useEffect } from 'react';
import { Plus, Filter, FolderOpen, X, CreditCard, Calculator, TrendingUp } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';

interface InvoicesProps {
  onNavigateBack?: () => void;
  onCreateInvoice?: () => void;
  onCreateBill?: () => void;
  onCreateUndocumentedRevenue?: () => void;
}

interface FilterState {
  invoiceName: string;
  customer: string;
  amount: string;
}

const Invoices = ({ onNavigateBack, onCreateInvoice, onCreateBill, onCreateUndocumentedRevenue }: InvoicesProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<'tax' | 'proforma'>('tax');
  const [filters, setFilters] = useState<FilterState>({
    invoiceName: '',
    customer: '',
    amount: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setFilters({ invoiceName: '', customer: '', amount: '' });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Invoices' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Invoices</h1>
                <div className="flex gap-3">
                  <button 
                    onClick={onCreateInvoice}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>New tax invoice</span>
                  </button>
                  <button 
                    onClick={onCreateBill}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>New bill</span>
                  </button>
                  <button 
                    onClick={onCreateUndocumentedRevenue}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>New undocumented revenue</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-60">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Revenue name"
                      value={filters.invoiceName}
                      onChange={(e) => updateFilter('invoiceName', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                    {filters.invoiceName && (
                      <button
                        onClick={() => clearFilter('invoiceName')}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-60">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Customer"
                      value={filters.customer}
                      onChange={(e) => updateFilter('customer', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                    {filters.customer && (
                      <button
                        onClick={() => clearFilter('customer')}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-700/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <Filter size={16} />
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-gray-200 dark:border-gray-700/50">
              {/* Revenue total MTD */}
              <div className="bg-white dark:bg-gray-800/40 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹ 0.00
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue total MTD
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Revenue total YTD */}
              <div className="bg-white dark:bg-gray-800/40 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹ 0.00
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue total YTD
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment totals YTD */}
              <div className="bg-white dark:bg-gray-800/40 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹ 0.00
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Payment totals YTD
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Outstanding Amount */}
              <div className="bg-white dark:bg-gray-800/40 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                    <FolderOpen size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹ 0.00
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Outstanding Amount
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700/50">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('tax')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'tax'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Documented
                </button>
                <button
                  onClick={() => setActiveTab('proforma')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'proforma'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  Undocumented
                </button>
              </nav>
            </div>

            {/* Empty State */}
            <div className="p-8">
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FolderOpen size={48} className="mx-auto opacity-50" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No data to display</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  {activeTab === 'tax' 
                    ? 'Create your first documented revenue to get started'
                    : 'Create your first undocumented revenue to get started'
                  }
                </p>
                <div className="mt-6">
                  <button 
                    onClick={onCreateInvoice}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    {activeTab === 'tax' ? 'New Tax Invoice' : 'New Undocumented Revenue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;