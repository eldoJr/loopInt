"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
let TasksService = class TasksService {
    async ensureUserExists(userId, userName) {
        try {
            const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
            if (result.rows.length === 0) {
                await pool.query('INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)', [userId, userName, `${userName.toLowerCase().replace(' ', '')}@example.com`, 'temp_password', new Date(), new Date()]);
            }
        }
        catch (error) {
            console.error('Error ensuring user exists:', error);
        }
    }
    async create(createTaskDto) {
        try {
            console.log('Creating task with data:', createTaskDto);
            if (createTaskDto.user_id && createTaskDto.user_name) {
                await this.ensureUserExists(createTaskDto.user_id, createTaskDto.user_name);
            }
            const now = new Date();
            const result = await pool.query('INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, project_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [
                createTaskDto.title,
                createTaskDto.description || null,
                createTaskDto.status || 'pending',
                createTaskDto.priority || 'medium',
                createTaskDto.due_date || null,
                createTaskDto.user_id || null,
                createTaskDto.project_id || null,
                now,
                now
            ]);
            console.log('Task created successfully:', result.rows[0]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error creating task:', error);
            throw error;
        }
    }
    async findAll(userId) {
        if (userId) {
            const result = await pool.query('SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC', [userId]);
            return result.rows;
        }
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        return result.rows;
    }
    async findOne(id) {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async update(id, updateTaskDto) {
        try {
            const existingTask = await this.findOne(id);
            if (!existingTask) {
                throw new Error(`Task with ID ${id} not found`);
            }
            const now = new Date();
            const setParts = [];
            const values = [];
            let paramCount = 1;
            if (updateTaskDto.title !== undefined) {
                setParts.push(`title = $${paramCount++}`);
                values.push(updateTaskDto.title);
            }
            if (updateTaskDto.description !== undefined) {
                setParts.push(`description = $${paramCount++}`);
                values.push(updateTaskDto.description || null);
            }
            if (updateTaskDto.status !== undefined) {
                setParts.push(`status = $${paramCount++}`);
                values.push(updateTaskDto.status);
            }
            if (updateTaskDto.priority !== undefined) {
                setParts.push(`priority = $${paramCount++}`);
                values.push(updateTaskDto.priority);
            }
            if (updateTaskDto.due_date !== undefined) {
                setParts.push(`due_date = $${paramCount++}`);
                values.push(updateTaskDto.due_date || null);
            }
            if (updateTaskDto.assigned_to !== undefined) {
                setParts.push(`assigned_to = $${paramCount++}`);
                values.push(updateTaskDto.assigned_to || null);
            }
            if (updateTaskDto.project_id !== undefined) {
                setParts.push(`project_id = $${paramCount++}`);
                values.push(updateTaskDto.project_id || null);
            }
            if (setParts.length === 0) {
                return existingTask;
            }
            setParts.push(`updated_at = $${paramCount++}`);
            values.push(now);
            values.push(id);
            const query = `UPDATE tasks SET ${setParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;
            const result = await pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error updating task:', error);
            throw error;
        }
    }
    async remove(id) {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map