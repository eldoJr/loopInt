export class CreateCalendarEventDto {
  title: string;
  description?: string;
  eventType?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  calendarName?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  reminders?: string[];
  createdBy?: string;
}