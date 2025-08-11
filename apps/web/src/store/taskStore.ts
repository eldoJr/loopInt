import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  user_id?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
  completed?: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  loading: false,
  setTasks: tasks => set({ tasks }),
  addTask: task =>
    set(state => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (id, updates) =>
    set(state => ({
      tasks: state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: id =>
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id),
    })),
  toggleTask: id =>
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'done' ? 'todo' : 'done',
              completed: t.status !== 'done',
            }
          : t
      ),
    })),
  setLoading: loading => set({ loading }),
}));
