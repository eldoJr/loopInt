import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AIGenerateTaskFormData } from '../../schemas/aiGenerateTaskSchema';

interface GeneratedTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
}

const generateTask = async (data: AIGenerateTaskFormData): Promise<GeneratedTaskData> => {
  // Simulate API call - replace with actual API endpoint
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response based on prompt
  const mockResponses = {
    bug_fix: {
      title: `Fix: ${data.prompt.slice(0, 50)}...`,
      description: `<p>Investigate and resolve the following issue:</p><p>${data.prompt}</p><p><strong>Steps to reproduce:</strong></p><ul><li>Step 1</li><li>Step 2</li></ul><p><strong>Expected behavior:</strong></p><p>System should work correctly</p>`,
      priority: 'high' as const,
      status: 'todo' as const,
    },
    feature: {
      title: `Feature: ${data.prompt.slice(0, 50)}...`,
      description: `<p>Implement the following feature:</p><p>${data.prompt}</p><p><strong>Acceptance Criteria:</strong></p><ul><li>User can perform the required action</li><li>Feature is responsive and accessible</li></ul>`,
      priority: 'medium' as const,
      status: 'todo' as const,
    },
    default: {
      title: `Task: ${data.prompt.slice(0, 50)}...`,
      description: `<p>${data.prompt}</p><p><strong>Requirements:</strong></p><ul><li>Complete the task as described</li><li>Test the implementation</li></ul>`,
      priority: 'medium' as const,
      status: 'todo' as const,
    }
  };

  const response = mockResponses[data.taskType || 'default'] || mockResponses.default;
  
  return {
    ...response,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
};

export const useGenerateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: generateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};