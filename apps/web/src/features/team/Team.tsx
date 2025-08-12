import { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Edit,
  Trash2,
  User,
  Building,
  MapPin,
  Mail,
  Phone,
  Linkedin,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useSearch } from '../../hooks/useSearch';
import { useDebounce } from '../../hooks/useDebounce';
import { ListAnimation } from '../../components/animations/ListAnimation';
import { ErrorBoundary } from '../../components/error/ErrorBoundary';
import { mockTeamMembers, type TeamMember } from '../../data/mockTeamData';

interface TeamProps {
  onNavigateBack?: () => void;
  onNavigateToNewCoworker?: () => void;
  onNavigateToEditCoworker?: (memberId: string) => void;
}

const Team = ({
  onNavigateBack,
  onNavigateToNewCoworker,
  onNavigateToEditCoworker,
}: TeamProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [filters, setFilters] = useState({ name: '', status: 'all', department: '' });
  const debouncedSearchTerm = useDebounce(filters.name, 300);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    memberId: string;
    memberName: string;
  }>({ isOpen: false, memberId: '', memberName: '' });

  // Fuzzy search setup
  const { results: searchResults, setQuery: setSearchQuery } = useSearch({
    data: teamMembers,
    keys: ['firstName', 'lastName', 'email', 'position', 'company', 'skills'],
    threshold: 0.3,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = (() => {
    // Start with search results if there's a search query, otherwise use all members
    const baseMembers = debouncedSearchTerm
      ? searchResults.map(result => result.item)
      : teamMembers;

    return baseMembers.filter(member => {
      const matchesStatus = filters.status === 'all' || member.status === filters.status;
      const matchesDepartment = !filters.department || member.department === filters.department;
      return matchesStatus && matchesDepartment;
    });
  })();

  const resetFilters = () => {
    setFilters({ name: '', status: 'all', department: '' });
    setSearchQuery('');
  };

  const clearFilter = (field: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [field]: field === 'status' ? 'all' : '' }));
    if (field === 'name') {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, name: value }));
    setSearchQuery(value);
  };

  const handleMemberSelect = (result: Record<string, unknown>) => {
    const member = teamMembers.find(m => m.id === result.id) as TeamMember;
    if (member?.id) {
      handleEdit(member.id);
    }
  };

  const handleEdit = (memberId: string) => {
    onNavigateToEditCoworker?.(memberId);
  };

  const handleDelete = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setDeleteConfirmation({
        isOpen: true,
        memberId,
        memberName: `${member.firstName} ${member.lastName}`,
      });
    }
  };

  const confirmDelete = () => {
    setTeamMembers(prev => prev.filter(member => member.id !== deleteConfirmation.memberId));
    setDeleteConfirmation({ isOpen: false, memberId: '', memberName: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'part-time':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'contractor':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'intern':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team' },
  ];

  const departments = [...new Set(teamMembers.map(m => m.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Sticky Breadcrumb */}
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="mt-1 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg shadow-sm transition-all duration-300">
          <div className="sticky top-14 z-10 px-4 py-3 border-b border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                  <User className="text-white w-4 h-4" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Members
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors text-sm"
                >
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </button>
                <button
                  onClick={() => onNavigateToNewCoworker?.()}
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Plus size={14} />
                  <span>New Member</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Search & Filters */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/30">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    placeholder="Search team members..."
                    value={filters.name}
                    onChange={handleSearchChange}
                    searchData={teamMembers as unknown as Record<string, unknown>[]}
                    searchKeys={['firstName', 'lastName', 'email', 'position', 'company']}
                    onResultSelect={handleMemberSelect}
                    showResults={true}
                    maxResults={8}
                    showCommandHint={false}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500/50 transition-all text-sm appearance-none pr-8"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    {filters.status !== 'all' && (
                      <button
                        onClick={() => clearFilter('status')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={filters.department}
                      onChange={e => setFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm appearance-none pr-8"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {filters.department && (
                      <button
                        onClick={() => clearFilter('department')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={resetFilters}
                    className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                    title="Clear all filters"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                <span className="font-medium text-gray-900 dark:text-white">
                  {filteredMembers.length}
                </span>{' '}
                of {teamMembers.length}
                {debouncedSearchTerm && (
                  <span className="ml-2 text-orange-500 dark:text-orange-400">
                    • "{debouncedSearchTerm}"
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="mt-6 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-lg overflow-hidden transition-all duration-300">
          {filteredMembers.length > 0 ? (
            <>
              {/* Table Header - Hidden on mobile */}
              <div className="hidden lg:block bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50 px-4 py-3">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-purple-600"></div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Member
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Role & Company
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </span>
                  </div>
                </div>
              </div>
              <ListAnimation items={filteredMembers}>
                {member => (
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600/30">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {member.firstName} {member.lastName}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {member.position}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {member.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleEdit(member.id)}
                            className="text-gray-400 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(member.status)} capitalize`}
                          >
                            {member.status}
                          </span>
                          {member.contractType && (
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium border ${getContractTypeColor(member.contractType)} capitalize`}
                            >
                              {member.contractType.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                          {member.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                          <Phone className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                      {/* Member Info */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600/30">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {member.firstName} {member.lastName}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                            <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role & Company */}
                      <div className="col-span-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.position}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                          <Building className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span>{member.company}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex flex-col items-center space-y-1">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(member.status)} capitalize`}
                        >
                          {member.status}
                        </span>
                        {member.contractType && (
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium border ${getContractTypeColor(member.contractType)} capitalize`}
                          >
                            {member.contractType.replace('-', ' ')}
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span>{member.location}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(member.id)}
                          className="text-gray-400 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
                            title="LinkedIn"
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ListAnimation>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                <User className="text-white text-xl" />
              </div>
              <p className="text-sm font-medium mb-2">No team members found</p>
              <p className="text-xs">Try adjusting your filters or add a new team member.</p>
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteConfirmation.isOpen}
          onClose={() =>
            setDeleteConfirmation({
              isOpen: false,
              memberId: '',
              memberName: '',
            })
          }
          onConfirm={confirmDelete}
          title="Delete Team Member"
          message={`Are you sure you want to delete "${deleteConfirmation.memberName}"? This action cannot be undone and will permanently remove all member data.`}
          confirmText="Delete Member"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </ErrorBoundary>
  );
};

export default Team;