import { Injectable } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './types/calendar-event.interface';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

@Injectable()
export class CalendarService {

  private parseJsonField(field: any, defaultValue: any = []): any {
    if (!field) return defaultValue;
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  }

  async createEvent(createEventDto: CreateCalendarEventDto): Promise<CalendarEvent> {
    try {
      const now = new Date();
      const result = await pool.query(
        `INSERT INTO calendar_events (
          title, description, event_type, start_date, end_date, all_day,
          location, calendar_name, priority, status, tags, reminders, created_by,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING *`,
        [
          createEventDto.title,
          createEventDto.description || null,
          createEventDto.eventType || 'event',
          createEventDto.startDate,
          createEventDto.endDate,
          createEventDto.allDay || false,
          createEventDto.location || null,
          createEventDto.calendarName || 'General',
          createEventDto.priority || 'medium',
          createEventDto.status || 'scheduled',
          JSON.stringify(createEventDto.tags || []),
          JSON.stringify(createEventDto.reminders || []),
          createEventDto.createdBy || null,
          now,
          now
        ]
      );
      
      const event = result.rows[0];
      event.tags = this.parseJsonField(event.tags);
      event.reminders = this.parseJsonField(event.reminders);
      
      return event;
    } catch (error) {
      console.error('Database error creating calendar event:', error);
      throw error;
    }
  }

  async findAllEvents(): Promise<CalendarEvent[]> {
    try {
      const result = await pool.query('SELECT * FROM calendar_events ORDER BY start_date ASC');
      
      return result.rows.map(event => ({
        ...event,
        tags: this.parseJsonField(event.tags),
        reminders: this.parseJsonField(event.reminders)
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  async findEventsByUser(userId: string): Promise<CalendarEvent[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM calendar_events WHERE created_by = $1 ORDER BY start_date ASC',
        [userId]
      );
      
      return result.rows.map(event => ({
        ...event,
        tags: this.parseJsonField(event.tags),
        reminders: this.parseJsonField(event.reminders)
      }));
    } catch (error) {
      console.error('Error fetching user calendar events:', error);
      return [];
    }
  }

  async findEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const result = await pool.query('SELECT * FROM calendar_events WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      
      const event = result.rows[0];
      event.tags = this.parseJsonField(event.tags);
      event.reminders = this.parseJsonField(event.reminders);
      
      return event;
    } catch (error) {
      console.error('Error fetching calendar event:', error);
      return null;
    }
  }

  async updateEvent(id: string, updateEventDto: UpdateCalendarEventDto): Promise<CalendarEvent | null> {
    try {
      const existingEvent = await this.findEvent(id);
      if (!existingEvent) {
        throw new Error(`Calendar event with ID ${id} not found`);
      }
      
      const now = new Date();
      const setParts: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (updateEventDto.title !== undefined) {
        setParts.push(`title = $${paramCount++}`);
        values.push(updateEventDto.title);
      }
      if (updateEventDto.description !== undefined) {
        setParts.push(`description = $${paramCount++}`);
        values.push(updateEventDto.description);
      }
      if (updateEventDto.eventType !== undefined) {
        setParts.push(`event_type = $${paramCount++}`);
        values.push(updateEventDto.eventType);
      }
      if (updateEventDto.startDate !== undefined) {
        setParts.push(`start_date = $${paramCount++}`);
        values.push(updateEventDto.startDate);
      }
      if (updateEventDto.endDate !== undefined) {
        setParts.push(`end_date = $${paramCount++}`);
        values.push(updateEventDto.endDate);
      }
      if (updateEventDto.allDay !== undefined) {
        setParts.push(`all_day = $${paramCount++}`);
        values.push(updateEventDto.allDay);
      }
      if (updateEventDto.location !== undefined) {
        setParts.push(`location = $${paramCount++}`);
        values.push(updateEventDto.location);
      }
      if (updateEventDto.calendarName !== undefined) {
        setParts.push(`calendar_name = $${paramCount++}`);
        values.push(updateEventDto.calendarName);
      }
      if (updateEventDto.priority !== undefined) {
        setParts.push(`priority = $${paramCount++}`);
        values.push(updateEventDto.priority);
      }
      if (updateEventDto.status !== undefined) {
        setParts.push(`status = $${paramCount++}`);
        values.push(updateEventDto.status);
      }
      if (updateEventDto.tags !== undefined) {
        setParts.push(`tags = $${paramCount++}`);
        values.push(JSON.stringify(updateEventDto.tags));
      }
      if (updateEventDto.reminders !== undefined) {
        setParts.push(`reminders = $${paramCount++}`);
        values.push(JSON.stringify(updateEventDto.reminders));
      }

      if (setParts.length === 0) {
        return existingEvent;
      }

      setParts.push(`updated_at = $${paramCount++}`);
      values.push(now);
      values.push(id);

      const query = `UPDATE calendar_events SET ${setParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error(`No calendar event was updated for ID ${id}`);
      }
      
      const event = result.rows[0];
      event.tags = this.parseJsonField(event.tags);
      event.reminders = this.parseJsonField(event.reminders);
      
      return event;
    } catch (error) {
      console.error('Database error updating calendar event:', error);
      throw error;
    }
  }

  async removeEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const result = await pool.query('DELETE FROM calendar_events WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return null;
      
      const event = result.rows[0];
      event.tags = this.parseJsonField(event.tags);
      event.reminders = this.parseJsonField(event.reminders);
      
      return event;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return null;
    }
  }
}