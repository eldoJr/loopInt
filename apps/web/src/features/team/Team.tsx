import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'away' | 'busy';
  lastActive: string;
  tasksCompleted: number;
}

interface TeamProps {
  onNavigateBack?: () => void;
}

const Team = ({ onNavigateBack }: TeamProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Mock team data - replace with real API calls
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Developer',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      status: 'active',
      lastActive: '2 minutes ago',
      tasksCompleted: 42
    },
    {
      id: '2',
      name: 'Maria Garcia',
      role: 'Designer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      status: 'busy',
      lastActive: '15 minutes ago',
      tasksCompleted: 28
    },
    {
      id: '3',
      name: 'Sam Wilson',
      role: 'Developer',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      status: 'away',
      lastActive: '1 hour ago',
      tasksCompleted: 36
    },
    {
      id: '4',
      name: 'Priya Patel',
      role: 'QA Engineer',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      status: 'active',
      lastActive: '5 minutes ago',
      tasksCompleted: 19
    },
    {
      id: '5',
      name: 'James Zhang',
      role: 'Product Manager',
      avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
      status: 'active',
      lastActive: 'Just now',
      tasksCompleted: 53
    },
    {
      id: '6',
      name: 'Emma Williams',
      role: 'DevOps',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      status: 'busy',
      lastActive: '30 minutes ago',
      tasksCompleted: 31
    }
  ];

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Team' }
  ];

  const roles = ['all', ...Array.from(new Set(teamMembers.map(member => member.role)))];

  const filteredMembers = teamMembers.filter(member => {
    const matchesFilter = activeFilter === 'all' || member.role === activeFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Team Members</h2>
                <p className="text-gray-400">Manage and collaborate with your team</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search team..."
                    className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                
                <select
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No team members found</h3>
                <p className="mt-1 text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={member.avatar}
                          alt={member.name}
                        />
                        <span
                          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-gray-800 ${getStatusColor(
                            member.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-white truncate">
                            {member.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-100">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Last active: {member.lastActive}
                        </p>
                        <div className="mt-3 flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center text-sm text-gray-400">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {member.tasksCompleted} tasks
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </button>
                            <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Showing {filteredMembers.length} of {teamMembers.length} members
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;