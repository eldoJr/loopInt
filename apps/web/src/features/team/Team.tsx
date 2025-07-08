import { useState, useEffect } from 'react';
import { Plus, Search, X, Filter, Edit, Trash2, Mail, Phone, MessageSquare, Linkedin, User, Building, MapPin } from 'lucide-react';
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

const Team = ({ onNavigateBack, onNavigateToNewCoworker, onNavigateToEditMember }: TeamProps) => {
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
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
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
          (member) => member.created_by === currentUser.id
        );

        // Transform API data to match component interface
        const transformedMembers: TeamMember[] = userMembers.map((member) => ({
          id: member.id,
          firstName: member.first_name || '',
          lastName: member.last_name || '',
          position: member.position || 'No position',
          company: member.company || 'No company',
          email: member.email || '',
          phone: member.phone_numbers?.[0] || member.phoneNumbers?.[0] || '',
          skype: member.skype,
          linkedin: member.linkedin,
          photo: member.photo_url || member.photoUrl,
          isIndividual: member.is_individual || member.isIndividual || false,
          status: (member.status as 'active' | 'inactive' | 'pending') || 'active',
          joinDate: member.join_date || member.joinDate || member.created_at || '',
          location: [member.city, member.state].filter(Boolean).join(', ') || 'No location'
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
      filtered = filtered.filter(member => 
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleEdit = (memberId: string) => {
    onNavigateToEditMember?.(memberId);
  };

  const handleDelete = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await fetch(`http://localhost:3000/team/${memberId}`, {
          method: 'DELETE'
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
    { label: 'Team' }
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
      
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Team Members</h1>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => fetchTeamMembers()}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button 
                onClick={onNavigateToNewCoworker}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Team Member</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-4 bg-gray-800/30 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-10 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="group relative">
                  <button className="p-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50">
                    <Filter size={16} />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Advanced filters
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
                
                <div className="group relative">
                  <button 
                    onClick={resetFilters}
                    className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Reset filters
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{filteredMembers.length}</span> of {teamMembers.length} members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center overflow-hidden">
                      {member.photo ? (
                        <img 
                          src={member.photo.startsWith('/uploads') ? `http://localhost:3000${member.photo}` : member.photo} 
                          alt={`${member.firstName} ${member.lastName}`} 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.firstName} {member.lastName}</h3>
                      <p className="text-sm text-gray-400">{member.position}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{member.company}</span>
                    {member.isIndividual && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                        Individual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{member.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {member.skype && (
                      <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    {member.linkedin && (
                      <button className="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                      title="Edit member"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500">
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12">
            <DashboardEmptyState
              message={searchTerm || statusFilter !== 'all' ? 'No team members match your filters' : 'No team members yet'}
              actionText={!searchTerm && statusFilter === 'all' ? 'Add your first team member' : undefined}
              onAction={!searchTerm && statusFilter === 'all' ? onNavigateToNewCoworker : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;