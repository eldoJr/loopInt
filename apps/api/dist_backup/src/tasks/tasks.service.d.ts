import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './types/task.interface';
export declare class TasksService {
    ensureUserExists(userId: string, userName: string): Promise<void>;
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(userId?: string): Promise<Task[]>;
    findOne(id: string): Promise<Task | null>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null>;
    remove(id: string): Promise<Task | null>;
}
