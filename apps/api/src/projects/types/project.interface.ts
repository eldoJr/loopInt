export interface Project {
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