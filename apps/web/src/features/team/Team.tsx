import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Linkedin,
  User,
  Building,
  MapPin,
} from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DashboardEmptyState from '../../components/ui/DashboardEmptyState';

interface TeamProps {
  onNavigateBack?: () => void;
  onNavigateToNewCoworker?: () => void;
  onNavigateToEditMember?: (memberId: string) => void;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  skype?: string;
  linkedin?: string;
  photo?: string;
  isIndividual: boolean;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  location: string;
}

const Team = ({
  onNavigateBack,
  onNavigateToNewCoworker,
  onNavigateToEditMember,
}: TeamProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
      fetchTeamMembers();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const userData =
        localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;

      if (!currentUser) {
        console.log('No user found, skipping team fetch');
        return;
      }

      const response = await fetch('http://localhost:3000/team');
      if (response.ok) {
        const allMembers = await response.json();

        // Filter team members for current user
        interface RawTeamMember {
          id: string;
          first_name?: string;
          last_name?: string;
          position?: string;
          company?: string;
          email?: string;
          phone_numbers?: string[];
          phoneNumbers?: string[];
          skype?: string;
          linkedin?: string;
          photo_url?: string;
          photoUrl?: string;
          is_individual?: boolean;
          isIndividual?: boolean;
          status?: string;
          join_date?: string;
          joinDate?: string;
          created_at?: string;
          created_by?: string;
          createdBy?: string;
          city?: string;
          state?: string;
        }

        const userMembers = (allMembers as RawTeamMember[]).filter(
          member => member.created_by === currentUser.id
        );

        // Transform API data to match component interface
        const transformedMembers: TeamMember[] = userMembers.map(member => ({
          id: member.id,
          firstName: member.first_name || '',
          lastName: member.last_name || '',
          position: member.position || 'No position',
          company: member.company || 'No company',
          email: member.email || '',
          phone: Array.isArray(member.phone_numbers)
            ? member.phone_numbers[0] || ''
            : member.phoneNumbers?.[0] || member.phone_numbers || 'No phone',
          skype: member.skype,
          linkedin: member.linkedin,
          photo: member.photo_url || member.photoUrl,
          isIndividual: member.is_individual || member.isIndividual || false,
          status:
            (member.status as 'active' | 'inactive' | 'pending') || 'active',
          joinDate:
            member.join_date || member.joinDate || member.created_at || '',
          location:
            [member.city, member.state].filter(Boolean).join(', ') ||
            'No location',
        }));

        setTeamMembers(transformedMembers);
        setFilteredMembers(transformedMembers);
      } else {
        console.error('Failed to fetch team members:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(
        member =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredMembers(filtered);
  }, [searchTerm, statusFilter, teamMembers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30';
      case 'inactive':
        return 'bg-gray-50 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
      case 'pending':
        return 'bg-amber-50 dark:bg-yellow-500/20 text-amber-700 dark:text-yellow-400 border-amber-200 dark:border-yellow-500/30';
      default:
        return 'bg-gray-50 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/30';
    }
  };

  const handleEdit = (memberId: string) => {
    onNavigateToEditMember?.(memberId);
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await fetch(`http://localhost:3000/team/${memberId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTeamMembers(prev => prev.filter(member => member.id !== memberId));
          console.log('Member deleted successfully');
        } else {
          console.error('Failed to delete member:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team' },
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
    <div
      className={`space-y-6 transition-all duration-500 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Team Members
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Manage your team and collaborate effectively
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTeamMembers()}
                className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium border border-gray-200 dark:border-gray-600"
              >
                Refresh
              </button>
              <button
                onClick={onNavigateToNewCoworker}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md"
              >
                <Plus size={16} />
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative group w-full sm:w-auto">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search by name, position, or company..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72 pl-9 pr-9 py-2.5 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/50 transition-all shadow-sm text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/50 transition-all shadow-sm font-medium text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="px-3 py-2.5 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-all duration-200 font-medium shadow-sm flex items-center space-x-1.5 text-sm"
                >
                  <X size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end space-x-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700/30 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600/30">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredMembers.length}
                </span>{' '}
                of <span className="font-medium">{teamMembers.length}</span>{' '}
                members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden shadow-sm">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
            {filteredMembers.map(member => (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-800/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600/30">
                      {member.photo ? (
                        <img
                          src={
                            member.photo.startsWith('/uploads')
                              ? `http://localhost:3000${member.photo}`
                              : member.photo
                          }
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {member.position}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.status)} capitalize`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                    <Building className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">{member.company}</span>
                    {member.isIndividual && (
                      <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs rounded font-medium">
                        Individual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Mail className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    <span className="truncate">
                      {member.email || 'No email'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    <span>{member.phone || 'No phone'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center space-x-1.5">
                    {member.skype && (
                      <button className="p-1.5 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-all duration-200">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {member.linkedin && (
                      <button className="p-1.5 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-all duration-200">
                        <Linkedin className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button className="p-1.5 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-500/30 transition-all duration-200">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-all duration-200"
                      title="Edit member"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-all duration-200"
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Joined{' '}
                    {new Date(member.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12">
            <DashboardEmptyState
              message={
                searchTerm || statusFilter !== 'all'
                  ? 'No team members match your filters'
                  : 'No team members yet'
              }
              actionText={
                !searchTerm && statusFilter === 'all'
                  ? 'Add your first team member'
                  : undefined
              }
              onAction={
                !searchTerm && statusFilter === 'all'
                  ? onNavigateToNewCoworker
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
