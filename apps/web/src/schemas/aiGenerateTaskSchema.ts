import { z } from 'zod';

export const aiGenerateTaskSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(500, 'Prompt must be less than 500 characters')
    .trim(),
  taskType: z.enum(['bug_fix', 'feature', 'meeting', 'development', 'design', 'custom']).optional(),
});

export type AIGenerateTaskFormData = z.infer<typeof aiGenerateTaskSchema>;

export const quickPrompts = [
  {
    type: 'bug_fix' as const,
    title: 'Bug Fix',
    icon: '🐛',
    template: 'Fix the bug where {issue} is causing {problem}',
    placeholder: 'Describe the bug you need to fix...',
  },
  {
    type: 'feature' as const,
    title: 'Feature Request',
    icon: '✨',
    template: 'Implement {feature} that allows users to {action}',
    placeholder: 'Describe the feature you want to build...',
  },
  {
    type: 'meeting' as const,
    title: 'Meeting Task',
    icon: '📅',
    template: 'Prepare for {meeting_type} meeting about {topic}',
    placeholder: 'Describe the meeting preparation needed...',
  },
  {
    type: 'development' as const,
    title: 'Development',
    icon: '💻',
    template: 'Develop {component} with {requirements}',
    placeholder: 'Describe the development task...',
  },
  {
    type: 'design' as const,
    title: 'Design Task',
    icon: '🎨',
    template: 'Design {element} for {purpose}',
    placeholder: 'Describe the design work needed...',
  },
];