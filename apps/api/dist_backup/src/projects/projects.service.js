"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
let ProjectsService = class ProjectsService {
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
    async create(createProjectDto) {
        try {
            console.log('Creating project with data:', createProjectDto);
            if (createProjectDto.created_by) {
                await this.ensureUserExists(createProjectDto.created_by, 'User');
            }
            const now = new Date();
            const result = await pool.query(`INSERT INTO projects (
          name, description, status, priority, start_date, deadline, progress, 
          budget, team_id, client_id, created_by, is_favorite, tags, color, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING *`, [
                createProjectDto.name,
                createProjectDto.description?.trim() || null,
                createProjectDto.status || 'planning',
                createProjectDto.priority || 'medium',
                createProjectDto.start_date || null,
                createProjectDto.deadline || null,
                createProjectDto.progress || 0,
                createProjectDto.budget || null,
                createProjectDto.team_id?.trim() || null,
                createProjectDto.client_id?.trim() || null,
                createProjectDto.created_by || null,
                createProjectDto.is_favorite || false,
                createProjectDto.tags || [],
                createProjectDto.color || '#3B82F6',
                now,
                now
            ]);
            console.log('Project created successfully:', result.rows[0]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error creating project:', error);
            throw error;
        }
    }
    async findAll(userId) {
        if (userId) {
            const result = await pool.query('SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC', [userId]);
            return result.rows;
        }
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        return result.rows;
    }
    async findByUser(userId) {
        const result = await pool.query('SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC', [userId]);
        return result.rows;
    }
    async findOne(id) {
        const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    async update(id, updateProjectDto) {
        try {
            console.log('Service: Updating project ID:', id);
            console.log('Service: Update data:', JSON.stringify(updateProjectDto, null, 2));
            const existingProject = await this.findOne(id);
            if (!existingProject) {
                throw new Error(`Project with ID ${id} not found`);
            }
            const now = new Date();
            const setParts = [];
            const values = [];
            let paramCount = 1;
            if (updateProjectDto.name !== undefined) {
                setParts.push(`name = $${paramCount++}`);
                values.push(updateProjectDto.name);
            }
            if (updateProjectDto.description !== undefined) {
                setParts.push(`description = $${paramCount++}`);
                values.push(updateProjectDto.description === '' ? null : updateProjectDto.description);
            }
            if (updateProjectDto.status !== undefined) {
                setParts.push(`status = $${paramCount++}`);
                values.push(updateProjectDto.status);
            }
            if (updateProjectDto.priority !== undefined) {
                setParts.push(`priority = $${paramCount++}`);
                values.push(updateProjectDto.priority);
            }
            if (updateProjectDto.start_date !== undefined) {
                setParts.push(`start_date = $${paramCount++}`);
                values.push(updateProjectDto.start_date || null);
            }
            if (updateProjectDto.deadline !== undefined) {
                setParts.push(`deadline = $${paramCount++}`);
                values.push(updateProjectDto.deadline || null);
            }
            if (updateProjectDto.progress !== undefined) {
                setParts.push(`progress = $${paramCount++}`);
                values.push(updateProjectDto.progress);
            }
            if (updateProjectDto.budget !== undefined) {
                setParts.push(`budget = $${paramCount++}`);
                values.push(updateProjectDto.budget || null);
            }
            if (updateProjectDto.team_id !== undefined) {
                setParts.push(`team_id = $${paramCount++}`);
                values.push(updateProjectDto.team_id || null);
            }
            if (updateProjectDto.client_id !== undefined) {
                setParts.push(`client_id = $${paramCount++}`);
                values.push(updateProjectDto.client_id || null);
            }
            if (updateProjectDto.created_by !== undefined) {
                setParts.push(`created_by = $${paramCount++}`);
                values.push(updateProjectDto.created_by || null);
            }
            if (updateProjectDto.is_favorite !== undefined) {
                setParts.push(`is_favorite = $${paramCount++}`);
                values.push(updateProjectDto.is_favorite);
            }
            if (updateProjectDto.tags !== undefined) {
                setParts.push(`tags = $${paramCount++}`);
                values.push(updateProjectDto.tags);
            }
            if (updateProjectDto.color !== undefined) {
                setParts.push(`color = $${paramCount++}`);
                values.push(updateProjectDto.color);
            }
            if (setParts.length === 0) {
                console.log('No fields to update, returning existing project');
                return existingProject;
            }
            setParts.push(`updated_at = $${paramCount++}`);
            values.push(now);
            values.push(id);
            const query = `UPDATE projects SET ${setParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;
            console.log('Executing query:', query);
            console.log('With values:', values);
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error(`No project was updated for ID ${id}`);
            }
            console.log('Project updated successfully:', result.rows[0]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Service: Database error updating project:', error);
            throw error;
        }
    }
    async remove(id) {
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)()
], ProjectsService);
//# sourceMappingURL=projects.service.js.map