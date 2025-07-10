"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
let TeamService = class TeamService {
    parseJsonField(field, defaultValue = []) {
        if (!field)
            return defaultValue;
        if (Array.isArray(field))
            return field;
        if (typeof field === 'string') {
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : defaultValue;
            }
            catch (e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }
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
    async create(createTeamMemberDto) {
        try {
            console.log('Creating team member with data:', createTeamMemberDto);
            if (createTeamMemberDto.createdBy) {
                await this.ensureUserExists(createTeamMemberDto.createdBy, 'User');
            }
            const now = new Date();
            const result = await pool.query(`INSERT INTO team_members (
          first_name, last_name, photo_url, is_individual, company, source, position, 
          position_description, email, phone_numbers, skype, linkedin, additional_links,
          address_line1, address_line2, zip_code, city, state, country, description,
          status, created_by, created_at, updated_at, join_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) 
        RETURNING *`, [
                createTeamMemberDto.firstName,
                createTeamMemberDto.lastName,
                createTeamMemberDto.photoUrl || null,
                createTeamMemberDto.isIndividual || false,
                createTeamMemberDto.company || null,
                createTeamMemberDto.source || null,
                createTeamMemberDto.position || null,
                createTeamMemberDto.positionDescription || null,
                createTeamMemberDto.email || null,
                JSON.stringify(createTeamMemberDto.phoneNumbers || []),
                createTeamMemberDto.skype || null,
                createTeamMemberDto.linkedin || null,
                JSON.stringify(createTeamMemberDto.additionalLinks || []),
                createTeamMemberDto.addressLine1 || null,
                createTeamMemberDto.addressLine2 || null,
                createTeamMemberDto.zipCode || null,
                createTeamMemberDto.city || null,
                createTeamMemberDto.state || null,
                createTeamMemberDto.country || null,
                createTeamMemberDto.description || null,
                createTeamMemberDto.status || 'active',
                createTeamMemberDto.createdBy || null,
                now,
                now,
                now
            ]);
            const member = result.rows[0];
            member.phoneNumbers = this.parseJsonField(member.phone_numbers);
            member.additionalLinks = this.parseJsonField(member.additional_links);
            console.log('Team member created successfully:', member);
            return member;
        }
        catch (error) {
            console.error('Database error creating team member:', error);
            throw error;
        }
    }
    async findAll(userId) {
        try {
            let query = 'SELECT * FROM team_members ORDER BY created_at DESC';
            let params = [];
            if (userId) {
                query = 'SELECT * FROM team_members WHERE created_by = $1 ORDER BY created_at DESC';
                params = [userId];
            }
            const result = await pool.query(query, params);
            return result.rows.map(member => ({
                ...member,
                phoneNumbers: this.parseJsonField(member.phone_numbers),
                additionalLinks: this.parseJsonField(member.additional_links)
            }));
        }
        catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    }
    async findOne(id) {
        try {
            const result = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
            if (result.rows.length === 0)
                return null;
            const member = result.rows[0];
            member.phoneNumbers = this.parseJsonField(member.phone_numbers);
            member.additionalLinks = this.parseJsonField(member.additional_links);
            return member;
        }
        catch (error) {
            console.error('Error fetching team member:', error);
            return null;
        }
    }
    async update(id, updateTeamMemberDto) {
        try {
            console.log('Service: Updating team member ID:', id);
            console.log('Service: Update data:', JSON.stringify(updateTeamMemberDto, null, 2));
            const existingMember = await this.findOne(id);
            if (!existingMember) {
                throw new Error(`Team member with ID ${id} not found`);
            }
            const now = new Date();
            const setParts = [];
            const values = [];
            let paramCount = 1;
            if (updateTeamMemberDto.firstName !== undefined) {
                setParts.push(`first_name = $${paramCount++}`);
                values.push(updateTeamMemberDto.firstName);
            }
            if (updateTeamMemberDto.lastName !== undefined) {
                setParts.push(`last_name = $${paramCount++}`);
                values.push(updateTeamMemberDto.lastName);
            }
            if (updateTeamMemberDto.photoUrl !== undefined) {
                setParts.push(`photo_url = $${paramCount++}`);
                values.push(updateTeamMemberDto.photoUrl);
            }
            if (updateTeamMemberDto.isIndividual !== undefined) {
                setParts.push(`is_individual = $${paramCount++}`);
                values.push(updateTeamMemberDto.isIndividual);
            }
            if (updateTeamMemberDto.company !== undefined) {
                setParts.push(`company = $${paramCount++}`);
                values.push(updateTeamMemberDto.company);
            }
            if (updateTeamMemberDto.source !== undefined) {
                setParts.push(`source = $${paramCount++}`);
                values.push(updateTeamMemberDto.source);
            }
            if (updateTeamMemberDto.position !== undefined) {
                setParts.push(`position = $${paramCount++}`);
                values.push(updateTeamMemberDto.position);
            }
            if (updateTeamMemberDto.positionDescription !== undefined) {
                setParts.push(`position_description = $${paramCount++}`);
                values.push(updateTeamMemberDto.positionDescription);
            }
            if (updateTeamMemberDto.email !== undefined) {
                setParts.push(`email = $${paramCount++}`);
                values.push(updateTeamMemberDto.email);
            }
            if (updateTeamMemberDto.phoneNumbers !== undefined) {
                setParts.push(`phone_numbers = $${paramCount++}`);
                values.push(JSON.stringify(updateTeamMemberDto.phoneNumbers));
            }
            if (updateTeamMemberDto.skype !== undefined) {
                setParts.push(`skype = $${paramCount++}`);
                values.push(updateTeamMemberDto.skype);
            }
            if (updateTeamMemberDto.linkedin !== undefined) {
                setParts.push(`linkedin = $${paramCount++}`);
                values.push(updateTeamMemberDto.linkedin);
            }
            if (updateTeamMemberDto.additionalLinks !== undefined) {
                setParts.push(`additional_links = $${paramCount++}`);
                values.push(JSON.stringify(updateTeamMemberDto.additionalLinks));
            }
            if (updateTeamMemberDto.addressLine1 !== undefined) {
                setParts.push(`address_line1 = $${paramCount++}`);
                values.push(updateTeamMemberDto.addressLine1);
            }
            if (updateTeamMemberDto.addressLine2 !== undefined) {
                setParts.push(`address_line2 = $${paramCount++}`);
                values.push(updateTeamMemberDto.addressLine2);
            }
            if (updateTeamMemberDto.zipCode !== undefined) {
                setParts.push(`zip_code = $${paramCount++}`);
                values.push(updateTeamMemberDto.zipCode);
            }
            if (updateTeamMemberDto.city !== undefined) {
                setParts.push(`city = $${paramCount++}`);
                values.push(updateTeamMemberDto.city);
            }
            if (updateTeamMemberDto.state !== undefined) {
                setParts.push(`state = $${paramCount++}`);
                values.push(updateTeamMemberDto.state);
            }
            if (updateTeamMemberDto.country !== undefined) {
                setParts.push(`country = $${paramCount++}`);
                values.push(updateTeamMemberDto.country);
            }
            if (updateTeamMemberDto.description !== undefined) {
                setParts.push(`description = $${paramCount++}`);
                values.push(updateTeamMemberDto.description);
            }
            if (updateTeamMemberDto.status !== undefined) {
                setParts.push(`status = $${paramCount++}`);
                values.push(updateTeamMemberDto.status);
            }
            if (setParts.length === 0) {
                console.log('No fields to update, returning existing member');
                return existingMember;
            }
            setParts.push(`updated_at = $${paramCount++}`);
            values.push(now);
            values.push(id);
            const query = `UPDATE team_members SET ${setParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;
            console.log('Executing query:', query);
            console.log('With values:', values);
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error(`No team member was updated for ID ${id}`);
            }
            const member = result.rows[0];
            member.phoneNumbers = this.parseJsonField(member.phone_numbers);
            member.additionalLinks = this.parseJsonField(member.additional_links);
            console.log('Team member updated successfully:', member);
            return member;
        }
        catch (error) {
            console.error('Service: Database error updating team member:', error);
            throw error;
        }
    }
    async remove(id) {
        try {
            const result = await pool.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0)
                return null;
            const member = result.rows[0];
            member.phoneNumbers = this.parseJsonField(member.phone_numbers);
            member.additionalLinks = this.parseJsonField(member.additional_links);
            return member;
        }
        catch (error) {
            console.error('Error deleting team member:', error);
            return null;
        }
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)()
], TeamService);
//# sourceMappingURL=team.service.js.map