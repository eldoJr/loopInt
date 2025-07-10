export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: 'todo' | 'in_progress' | 'done';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    project_id?: string;
    assigned_to?: string;
    user_id?: string;
    user_name?: string;
}
