export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location?: string;
  calendar_name: string;
  priority: string;
  status: string;
  tags: string[];
  reminders: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}