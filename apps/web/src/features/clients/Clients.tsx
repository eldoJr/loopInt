import { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter, Plus, Star, ArrowUpDown, MoreHorizontal, Phone, Mail, Building } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ClientsProps {
  onNavigateBack?: () => void;
  onNavigateToNewCompany?: () => void;
  onNavigateToNewContact?: () => void;
}

interface Client {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  assignedTo: string;
  status: string;
  type: string;
  favorite: boolean;
}

const Clients = ({ onNavigateBack, onNavigateToNewCompany, onNavigateToNewContact }: ClientsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const [nameFilter, setNameFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  // Mock data for clients
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      city: 'New York',
      phone: '+1 555-123-4567',
      email: 'contact@acme.com',
      assignedTo: 'John Doe',
      status: 'Active',
      type: 'Enterprise',
      favorite: true
    },
    {
      id: '2',
      name: 'Globex Industries',
      city: 'London',
      phone: '+44 20-1234-5678',
      email: 'info@globex.co.uk',
      assignedTo: 'Jane Smith',
      status: 'Prospect',
      type: 'SMB',
      favorite: false
    },
    {
      id: '3',
      name: 'Stark Enterprises',
      city: 'Los Angeles',
      phone: '+1 213-456-7890',
      email: 'hello@stark.com',
      assignedTo: 'Tony Stark',
      status: 'Lead',
      type: 'Enterprise',
      favorite: true
    }
  ];

  // Filter clients based on search criteria and active tab
  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      // Filter by tab (companies/contacts)
      if (activeTab === 'contacts') {
        return false; // For now, show no contacts in contacts tab
      }
      
      // Filter by favorites
      if (showFavorites && !client.favorite) {
        return false;
      }
      
      // Filter by name
      if (nameFilter && !client.name.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false;
      }
      
      // Filter by city
      if (cityFilter && !client.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }
      
      // Filter by source/type
      if (sourceFilter && !client.type.toLowerCase().includes(sourceFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [activeTab, nameFilter, cityFilter, sourceFilter, showFavorites]);

  // Clear all filters
  const clearFilters = () => {
    setNameFilter('');
    setCityFilter('');
    setSourceFilter('');
    setShowFavorites(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Clients' }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className={`transition-all duration-500 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800/50 rounded-t-xl">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Clients</h1>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">LoopInt</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={onNavigateToNewCompany}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
                >
                  <Plus size={14} />
                  <span>New company</span>
                </button>
                <button 
                  onClick={onNavigateToNewContact}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
                >
                  <Plus size={14} />
                  <span>New contact</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {nameFilter && (
                  <button
                    onClick={() => setNameFilter('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="City"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {cityFilter && (
                  <button
                    onClick={() => setCityFilter('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Type"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {sourceFilter && (
                  <button
                    onClick={() => setSourceFilter('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <button 
                onClick={clearFilters}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-1 text-sm"
              >
                <X className="text-red-500" size={14} />
                <Filter size={14} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="bg-white dark:bg-gray-900/50 border-x border-gray-200 dark:border-gray-800/50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('companies')}
                  className={`pb-1 border-b-2 text-sm font-medium ${
                    activeTab === 'companies'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Companies
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`pb-1 border-b-2 text-sm font-medium ${
                    activeTab === 'contacts'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Contact persons
                </button>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center space-x-1 ${
                    showFavorites 
                      ? 'text-yellow-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  <Star size={14} />
                  <span>Favorites</span>
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Import</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900/50 border-x border-b border-gray-200 dark:border-gray-800/50 rounded-b-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/50">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowUpDown size={12} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>City</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowUpDown size={12} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowUpDown size={12} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Building size={12} />
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{client.name}</span>
                            {client.favorite && <Star className="ml-1 w-3 h-3 text-yellow-500 fill-current" />}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600 dark:text-gray-300">{client.city}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                          <Phone size={12} className="text-green-500" />
                          <span>{client.phone}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                          <Mail size={12} className="text-blue-500" />
                          <span>{client.email}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{client.assignedTo}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          client.status === 'Prospect' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                          {client.type}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No clients found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs max-w-md">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <button 
                          onClick={onNavigateToNewCompany}
                          className="mt-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
                        >
                          <Plus size={14} />
                          <span>Add company</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Found: {filteredClients.length}</span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-600 dark:text-gray-400">Per page:</span>
                <select className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-2 py-1 text-xs">
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;