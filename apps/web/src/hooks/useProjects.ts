import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { showToast } from '../components/ui/Toast';
import type { Project } from '../store/projectStore';
import { mockProjects } from '../data/mockProjects';

export const useProjects = (userId?: string) => {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      // For development, return mock data directly
      // In production, you would uncomment the API call below
      return mockProjects;
      
      // try {
      //   const projects = await api.get<Project[]>('/projects');
      //   return userId ? projects.filter(p => p.created_by === userId) : projects;
      // } catch (error) {
      //   return userId ? mockProjects.filter(p => p.created_by === userId) : mockProjects;
      // }
    },
    enabled: true, // Always enabled for mock data
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get<Project>(`/projects/${id}`),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
      api.post<Project>('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast.success('Project created successfully!');
    },
    onError: () => {
      showToast.error('Failed to create project');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      api.put<Project>(`/projects/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      showToast.success('Project updated successfully!');
    },
    onError: () => {
      showToast.error('Failed to update project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast.success('Project deleted successfully!');
    },
    onError: () => {
      showToast.error('Failed to delete project');
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, is_favorite }: { id: string; is_favorite: boolean }) =>
      api.put(`/projects/${id}`, { is_favorite }),
    onSuccess: (_, { is_favorite }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast.success(is_favorite ? 'Added to favorites' : 'Removed from favorites');
    },
    onError: () => {
      showToast.error('Failed to update favorite');
    },
  });
};