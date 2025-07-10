import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './types/calendar-event.interface';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  async createEvent(@Body() createEventDto: CreateCalendarEventDto): Promise<CalendarEvent> {
    try {
      return await this.calendarService.createEvent(createEventDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create calendar event: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('events')
  async findAllEvents(): Promise<CalendarEvent[]> {
    return this.calendarService.findAllEvents();
  }

  @Get('events/user/:userId')
  async findEventsByUser(@Param('userId') userId: string): Promise<CalendarEvent[]> {
    return this.calendarService.findEventsByUser(userId);
  }

  @Get('events/:id')
  async findEvent(@Param('id') id: string): Promise<CalendarEvent | null> {
    return this.calendarService.findEvent(id);
  }

  @Put('events/:id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateCalendarEventDto
  ): Promise<CalendarEvent | null> {
    try {
      const result = await this.calendarService.updateEvent(id, updateEventDto);
      if (!result) {
        throw new HttpException('Calendar event not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to update calendar event: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('events/:id')
  async removeEvent(@Param('id') id: string): Promise<CalendarEvent | null> {
    return this.calendarService.removeEvent(id);
  }
}