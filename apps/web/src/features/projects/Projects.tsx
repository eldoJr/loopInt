import { useState, useEffect } from 'react';
import { Plus, Star, Search, X, Filter, Edit, Copy, Trash2, Calendar } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ProjectsProps {
  onNavigateBack?: () => void;
  onNavigateToNewProject?: () => void;
  onNavigateToEditProject?: (projectId: string) => void;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  deadline?: string;
  progress: number;
  budget?: number;
  team_id?: string;
  client_id?: string;
  created_by?: string;
  is_favorite: boolean;
  tags: string[];
  color: string;
  created_at: string;
  updated_at: string;
}

const Projects = ({ onNavigateBack, onNavigateToNewProject, onNavigateToEditProject }: ProjectsProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState({ name: '', dates: '', tags: '' });
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : null;
      
      if (!currentUser) {
        console.log('No user found, skipping project fetch');
        return;
      }
      
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        const fetchedProjects = await response.json();
        console.log('Fetched projects from API:', fetchedProjects);
        
        const userProjects = fetchedProjects.filter((project: Project) => {
          return project.created_by === currentUser.id;
        });
        
        console.log('User projects after filtering:', userProjects);
        setProjects(userProjects);
      } else {
        console.error('Failed to fetch projects:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      console.log('Backend server may not be running. Please start the API server.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
      fetchProjects();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on-hold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };



  const toggleFavorite = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !project.is_favorite })
      });
      
      if (response.ok) {
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
        ));
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const clearFilter = (field: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [field]: '' }));
  };

  const resetAllFilters = () => {
    setFilters({ name: '', dates: '', tags: '' });
  };

  const handleEdit = (projectId: string) => {
    console.log('Edit project:', projectId);
    onNavigateToEditProject?.(projectId);
  };

  const handleCopy = async (project: Project) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, ...projectData } = project;
      const projectCopy = {
        ...projectData,
        name: `${project.name} (Copy)`,
        created_by: currentUser?.id
      };
      
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectCopy)
      });
      
      if (response.ok) {
        fetchProjects();
        console.log('Project copied successfully');
      }
    } catch (error) {
      console.error('Error copying project:', error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchProjects();
          console.log('Project deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesName = !filters.name || project.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDates = !filters.dates || (
      (project.deadline && new Date(project.deadline).toLocaleDateString().includes(filters.dates)) ||
      (project.start_date && new Date(project.start_date).toLocaleDateString().includes(filters.dates))
    );
    const matchesTags = !filters.tags || (project.tags && project.tags.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase())));
    const matchesFavorites = !showFavorites || project.is_favorite;
    return matchesName && matchesDates && matchesTags && matchesFavorites;
  });

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Projects' }
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
            <h1 className="text-2xl font-semibold text-white">Projects</h1>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showFavorites 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <Star size={16} className={showFavorites ? 'fill-current' : ''} />
                <span>Show favorites</span>
              </button>
              <button 
                onClick={fetchProjects}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button 
                onClick={() => {
                  console.log('New project button clicked');
                  console.log('onNavigateToNewProject function:', onNavigateToNewProject);
                  onNavigateToNewProject?.();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New project</span>
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
                  placeholder="Project name"
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="w-52 pl-10 pr-10 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                />
                {filters.name && (
                  <button
                    onClick={() => clearFilter('name')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="relative group">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Project dates"
                  value={filters.dates}
                  onChange={(e) => setFilters(prev => ({ ...prev, dates: e.target.value }))}
                  className="w-52 pl-10 pr-10 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                />
                {filters.dates && (
                  <button
                    onClick={() => clearFilter('dates')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Tags"
                  value={filters.tags}
                  onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-52 pl-10 pr-10 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-gray-700/70 transition-all"
                />
                {filters.tags && (
                  <button
                    onClick={() => clearFilter('tags')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="group relative">
                  <button className="p-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50">
                    <Filter size={16} />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Filter and sort
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
                
                <div className="group relative">
                  <button 
                    onClick={resetAllFilters}
                    className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-400/50"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Reset all filters
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{filteredProjects.length}</span> of {projects.length} projects
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Project Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Deadline</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white">{project.name}</p>
                          <button
                            onClick={() => toggleFavorite(project.id)}
                            className={`transition-colors ${
                              project.is_favorite 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-gray-500 hover:text-yellow-400'
                            }`}
                          >
                            <Star size={16} className={project.is_favorite ? 'fill-current' : ''} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400">{project.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${project.progress}%`,
                            backgroundColor: project.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {project.budget ? `$${project.budget.toLocaleString()}` : 'No budget'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{currentUser?.name || 'Unknown'}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(project.id)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-gray-700/50"
                          title="Edit project"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleCopy(project)}
                          className="text-gray-400 hover:text-green-400 transition-colors p-1 rounded hover:bg-gray-700/50"
                          title="Copy project"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-gray-700/50"
                          title="Delete project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No projects found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;