import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  color: string;
  is_favorite: boolean;
  created_by?: string;
  start_date?: string;
  deadline?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>(set => ({
  projects: [],
  loading: false,
  setProjects: projects => set({ projects }),
  addProject: project =>
    set(state => ({
      projects: [...state.projects, project],
    })),
  updateProject: (id, updates) =>
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  deleteProject: id =>
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
    })),
  toggleFavorite: id =>
    set(state => ({
      projects: state.projects.map(p =>
        p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
      ),
    })),
  setLoading: loading => set({ loading }),
}));
