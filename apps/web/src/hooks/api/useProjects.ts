import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Project } from '../../store/projectStore';
import { showToast } from '../../components/ui/Toast';

const PROJECTS_KEY = 'projects';

export const useProjects = () => {
  return useQuery({
    queryKey: [PROJECTS_KEY],
    queryFn: () => api.get<Project[]>('/projects'),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: [PROJECTS_KEY, id],
    queryFn: () => api.get<Project>(`/projects/${id}`),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
      api.post<Project>('/projects', data),
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>([PROJECTS_KEY], (old) =>
        old ? [...old, newProject] : [newProject]
      );
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
    mutationFn: ({ id, ...data }: Partial<Project> & { id: string }) =>
      api.put<Project>(`/projects/${id}`, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>([PROJECTS_KEY], (old) =>
        old?.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      queryClient.setQueryData([PROJECTS_KEY, updatedProject.id], updatedProject);
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
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Project[]>([PROJECTS_KEY], (old) =>
        old?.filter((project) => project.id !== deletedId)
      );
      queryClient.removeQueries({ queryKey: [PROJECTS_KEY, deletedId] });
      showToast.success('Project deleted successfully!');
    },
    onError: () => {
      showToast.error('Failed to delete project');
    },
  });
};