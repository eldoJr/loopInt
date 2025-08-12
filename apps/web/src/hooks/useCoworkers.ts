import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CoworkerFormData } from '../schemas/coworkerSchema';

export const useCreateCoworker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CoworkerFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Creating coworker:', data);
      return { id: Date.now().toString(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coworkers'] });
    },
  });
};

export const useUpdateCoworker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CoworkerFormData }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updating coworker:', id, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coworkers'] });
    },
  });
};