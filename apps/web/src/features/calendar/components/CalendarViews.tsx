import { Video, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'task' | 'event';
  color: string;
  date: Date;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateObj: Date;
}

interface CalendarViewsProps {
  view: string;
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}

const MonthView = ({
  currentDate,
  events,
  onDateClick,
}: {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}) => {
  useTheme();
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();
    const todayString = today.toDateString();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = prevMonthLastDay - startingDayOfWeek + i + 1;
      const dateObj = new Date(year, month - 1, day);
      days.push({ date: day, isCurrentMonth: false, isToday: false, dateObj });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: dateObj.toDateString() === todayString,
        dateObj,
      });
    }

    const totalDays = days.length;
    const remainingDays = 42 - totalDays;
    for (let day = 1; day <= remainingDays; day++) {
      const dateObj = new Date(year, month + 1, day);
      days.push({ date: day, isCurrentMonth: false, isToday: false, dateObj });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-px mb-2">
        {weekdays.map(day => (
          <div
            key={day}
            className="p-1.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-900/70 p-2 min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
              !day.isCurrentMonth
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-900 dark:text-gray-200'
            }`}
            onClick={() => onDateClick(day.dateObj)}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={`text-sm font-medium ${
                  day.isToday
                    ? 'bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs'
                    : day.isCurrentMonth
                      ? 'text-gray-900 dark:text-gray-200'
                      : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {day.date}
              </span>
              {day.isToday && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>

            <div className="space-y-1">
              {events
                .filter(
                  event =>
                    event.date.toDateString() === day.dateObj.toDateString()
                )
                .slice(0, 3)
                .map(event => (
                  <div
                    key={event.id}
                    className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${
                      event.type === 'meeting'
                        ? 'bg-blue-500/80'
                        : event.type === 'task'
                          ? 'bg-green-500/80'
                          : 'bg-purple-500/80'
                    }`}
                    title={`${event.title} (${event.startTime} - ${event.endTime})`}
                  >
                    <div className="flex items-center space-x-1">
                      {event.type === 'meeting' && <Video size={8} />}
                      {event.type === 'task' && <Check size={8} />}
                      {event.type === 'event' && <CalendarIcon size={8} />}
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}
              {events.filter(
                event =>
                  event.date.toDateString() === day.dateObj.toDateString()
              ).length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                  +
                  {events.filter(
                    event =>
                      event.date.toDateString() === day.dateObj.toDateString()
                  ).length - 3}{' '}
                  more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeekView = ({
  currentDate,
  events,
  onDateClick,
}: {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}) => {
  useTheme();
  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = new Date(date);
    currentDay.setDate(currentDay.getDate() - currentDay.getDay());

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDay);
      const today = new Date();
      days.push({
        date: dayDate.getDate(),
        day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
          dayDate.getDay()
        ],
        isToday: dayDate.toDateString() === today.toDateString(),
        dateObj: dayDate,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="p-2"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="p-2 text-center border-l border-gray-200 dark:border-gray-800"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {day.day}
            </div>
            <div
              className={`text-sm font-medium mt-1 ${
                day.isToday
                  ? 'bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center mx-auto text-xs'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {day.date}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((time, timeIndex) => (
          <div
            key={timeIndex}
            className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
          >
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800">
              {time}
            </div>
            {weekDays.map((day, dayIndex) => {
              const dayEvents = events.filter(
                event =>
                  event.date.toDateString() === day.dateObj.toDateString() &&
                  event.startTime === time
              );

              return (
                <div
                  key={dayIndex}
                  className="p-1 border-l border-gray-200 dark:border-gray-800 min-h-[32px] hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer relative"
                  onClick={() => onDateClick(day.dateObj)}
                >
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 rounded text-white mb-1 ${
                        event.type === 'meeting'
                          ? 'bg-blue-500'
                          : event.type === 'task'
                            ? 'bg-green-500'
                            : 'bg-purple-500'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DayView = ({
  currentDate,
  events,
  onDateClick,
}: {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}) => {
  useTheme();
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${9 + i}:00`);
  const dayEvents = events.filter(
    event => event.date.toDateString() === currentDate.toDateString()
  );

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {timeSlots.map((time, index) => {
          const timeEvents = dayEvents.filter(
            event => event.startTime === time
          );

          return (
            <div
              key={index}
              className="flex border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
            >
              <div className="w-16 p-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800">
                {time}
              </div>
              <div
                className="flex-1 p-2 min-h-[48px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => onDateClick(currentDate)}
              >
                {timeEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded mb-2 text-white ${
                      event.type === 'meeting'
                        ? 'bg-blue-500'
                        : event.type === 'task'
                          ? 'bg-green-500'
                          : 'bg-purple-500'
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-80">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarViews = ({
  view,
  currentDate,
  events,
  onDateClick,
}: CalendarViewsProps) => {
  const renderView = () => {
    switch (view) {
      case 'Day':
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
      case 'Week':
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
      case 'Month':
      default:
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
    }
  };

  return <div className="p-3">{renderView()}</div>;
};

export default CalendarViews;
