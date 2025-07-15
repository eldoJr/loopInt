import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface BillingProps {
  onNavigateBack?: () => void;
}

const Billing = ({ onNavigateBack }: BillingProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Billing Settings' }
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
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm pt-6">Update billing details, manage subscriptions and more.</p>
        </div>

        {/* Current Plan */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Professional Plan</h4>
                <p className="text-gray-600 dark:text-gray-400">$29/month • Billed monthly</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Next billing date: January 15, 2024</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                  Active
                </span>
                <div className="mt-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">VISA</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expires 12/25</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing History</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">December 2023</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Professional Plan</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">$29.00</span>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Download
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">November 2023</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Professional Plan</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">$29.00</span>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Manage Subscription
          </button>
          <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
            Download Invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;