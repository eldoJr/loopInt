import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface NewClientProps {
  onNavigateBack?: () => void;
}

const NewClient = ({ onNavigateBack }: NewClientProps) => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'Clients', onClick: onNavigateBack },
    { label: 'LoopInt' },
    { label: 'CRM', onClick: onNavigateBack },
    { label: 'New Client' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Client</h2>
            <p className="text-gray-400">Client registration form ready for implementation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewClient;