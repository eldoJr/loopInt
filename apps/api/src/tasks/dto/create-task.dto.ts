export class CreateTaskDto {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id?: string; // UUID
  assigned_to?: string; // UUID
  user_id?: string;
  user_name?: string;
}