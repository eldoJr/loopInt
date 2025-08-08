import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Task } from '../../store/taskStore';
import { showToast } from '../../components/ui/Toast';

const TASKS_KEY = 'tasks';

export const useTasks = () => {
  return useQuery({
    queryKey: [TASKS_KEY],
    queryFn: () => api.get<Task[]>('/tasks'),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => api.get<Task>(`/tasks/${id}`),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) =>
      api.post<Task>('/tasks', data),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>([TASKS_KEY], (old) =>
        old ? [...old, newTask] : [newTask]
      );
      showToast.success('Task created successfully!');
    },
    onError: () => {
      showToast.error('Failed to create task');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) =>
      api.put<Task>(`/tasks/${id}`, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>([TASKS_KEY], (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      queryClient.setQueryData([TASKS_KEY, updatedTask.id], updatedTask);
      showToast.success('Task updated successfully!');
    },
    onError: () => {
      showToast.error('Failed to update task');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Task[]>([TASKS_KEY], (old) =>
        old?.filter((task) => task.id !== deletedId)
      );
      queryClient.removeQueries({ queryKey: [TASKS_KEY, deletedId] });
      showToast.success('Task deleted successfully!');
    },
    onError: () => {
      showToast.error('Failed to delete task');
    },
  });
};