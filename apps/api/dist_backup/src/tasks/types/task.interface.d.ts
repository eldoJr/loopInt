export interface Task {
    id: string;
    project_id?: string;
    assigned_to?: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    user_id?: string;
    user_name?: string;
    created_at: Date;
    updated_at: Date;
}
