import { useState, useEffect } from 'react';
import { Plus, Star, X, Filter, Edit, Copy, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import type { Project } from '../../store/projectStore';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { showToast } from '../../components/ui/Toast';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SearchBar from '../../components/ui/SearchBar';
import { useSearch } from '../../hooks/useSearch';
import { useDebounce } from '../../hooks/useDebounce';
import { ListAnimation } from '../../components/animations/ListAnimation';

interface ProjectsProps {
  onNavigateBack?: () => void;
  onNavigateToNewProject?: () => void;
  onNavigateToEditProject?: (projectId: string) => void;
}



const Projects = ({ onNavigateBack, onNavigateToNewProject, onNavigateToEditProject }: ProjectsProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState({ name: '', dates: '', tags: '' });
  const debouncedSearchTerm = useDebounce(filters.name, 300);
  
  const { projects, setProjects, toggleFavorite } = useProjectStore();
  const user = useAuthStore((state) => state.user);
  
  // Fuzzy search setup
  const { results: searchResults, setQuery: setSearchQuery } = useSearch({
    data: projects,
    keys: ['name', 'description', 'tags'],
    threshold: 0.3
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; projectId: string; projectName: string }>({ isOpen: false, projectId: '', projectName: '' });



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
        const userProjects = fetchedProjects.filter((project: Project) => 
          project.created_by === currentUser.id
        );
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



  const handleToggleFavorite = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !project.is_favorite })
      });
      
      if (response.ok) {
        toggleFavorite(id);
        showToast.success(project.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        showToast.error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      showToast.error('Failed to update favorite');
    }
  };

  const clearFilter = (field: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [field]: '' }));
    if (field === 'name') {
      setSearchQuery('');
    }
  };

  const resetAllFilters = () => {
    setFilters({ name: '', dates: '', tags: '' });
    setSearchQuery('');
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, name: value }));
    setSearchQuery(value);
  };

  const handleProjectSelect = (result: Record<string, unknown>) => {
    const project = projects.find(p => p.id === result.id) as Project;
    if (project?.id) {
      onNavigateToEditProject?.(project.id);
    }
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
        created_by: user?.id,
        tags: project.tags || []
      };
      
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectCopy)
      });
      
      if (response.ok) {
        fetchProjects();
        showToast.success('Project copied successfully!');
      } else {
        showToast.error('Failed to copy project');
      }
    } catch (error) {
      console.error('Error copying project:', error);
      showToast.error('Failed to copy project');
    }
  };

  const handleDelete = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setDeleteConfirmation({
        isOpen: true,
        projectId,
        projectName: project.name
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${deleteConfirmation.projectId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProjects();
        showToast.success('Project deleted successfully!');
      } else {
        showToast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast.error('Failed to delete project');
    }
  };

  const filteredProjects = (() => {
    // Start with search results if there's a search query, otherwise use all projects
    const baseProjects = debouncedSearchTerm ? searchResults.map(result => result.item) : projects;
    
    return baseProjects.filter(project => {
      const matchesDates = !filters.dates || (
        (project.deadline && format(new Date(project.deadline), 'yyyy-MM-dd').includes(filters.dates)) ||
        (project.start_date && format(new Date(project.start_date), 'yyyy-MM-dd').includes(filters.dates)) ||
        (project.deadline && format(new Date(project.deadline), 'dd/MM/yyyy').includes(filters.dates)) ||
        (project.start_date && format(new Date(project.start_date), 'dd/MM/yyyy').includes(filters.dates))
      );
      const matchesTags = !filters.tags || (project.tags && project.tags.some(tag => tag.toLowerCase().includes(filters.tags.toLowerCase())));
      const matchesFavorites = !showFavorites || project.is_favorite;
      return matchesDates && matchesTags && matchesFavorites;
    });
  })();

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
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl transition-all duration-300">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  showFavorites 
                    ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' 
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'
                }`}
              >
                <Star size={14} className={showFavorites ? 'fill-current' : ''} />
                <span>Favorites</span>
              </button>
              <button 
                onClick={fetchProjects}
                className="bg-gray-500 dark:bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Refresh
              </button>
              <button 
                onClick={() => onNavigateToNewProject?.()}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus size={14} />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Search & Filters */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search projects by name, description, or tags..."
                value={filters.name}
                onChange={handleSearchChange}
                searchData={projects as unknown as Record<string, unknown>[]}
                searchKeys={['name', 'description', 'tags']}
                onResultSelect={handleProjectSelect}
                showResults={true}
                maxResults={8}
                showCommandHint={false}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Calendar size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by dates"
                  value={filters.dates}
                  onChange={(e) => setFilters(prev => ({ ...prev, dates: e.target.value }))}
                  className="w-32 pl-8 pr-8 py-1.5 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
                {filters.dates && (
                  <button
                    onClick={() => clearFilter('dates')}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              
              <div className="relative">
                <Filter size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter by tags"
                  value={filters.tags}
                  onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-32 pl-8 pr-8 py-1.5 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
                {filters.tags && (
                  <button
                    onClick={() => clearFilter('tags')}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              
              <button 
                onClick={resetAllFilters}
                className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Clear all filters"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">{filteredProjects.length}</span> of {projects.length}
              {debouncedSearchTerm && (
                <span className="ml-2 text-blue-400">• Search: "{debouncedSearchTerm}"</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden transition-all duration-300">
        {filteredProjects.length > 0 ? (
          <>
            {/* Table Header */} 
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50 px-4 py-3">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex items-center space-x-3">
                  <div className="w-2"></div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Project</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Priority</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Progress</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Due</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</span>
                </div>
              </div>
            </div>
            <ListAnimation items={filteredProjects}>
              {(project) => (
                <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Project Info */}
                    <div className="col-span-5 flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }}></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{project.name}</h3>
                          <button
                            onClick={() => handleToggleFavorite(project.id)}
                            className={`transition-colors flex-shrink-0 ${
                              project.is_favorite 
                                ? 'text-yellow-500 hover:text-yellow-400' 
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star size={12} className={project.is_favorite ? 'fill-current' : ''} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{project.description || 'No description'}</p>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)} capitalize`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    {/* Priority */}
                    <div className="col-span-1 flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)} capitalize`}>
                        {project.priority}
                      </span>
                    </div>
                    
                    {/* Progress */}
                    <div className="col-span-2 flex flex-col items-center">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{project.progress}%</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${project.progress}%`,
                            backgroundColor: project.color
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Deadline */}
                    <div className="col-span-1 text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center space-x-1">
                      <button
                        onClick={() => handleEdit(project.id)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleCopy(project)}
                        className="text-gray-400 hover:text-green-500 transition-colors p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </ListAnimation>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No projects found matching your filters.</p>
          </div>
        )}
      </div>
      
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, projectId: '', projectName: '' })}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirmation.projectName}"? This action cannot be undone and will permanently remove all project data.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Projects;