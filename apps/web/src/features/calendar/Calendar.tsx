import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown, Settings, Check, User, Calendar as CalendarIcon, Plus } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface CalendarProps {
  onNavigateBack?: () => void;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateObj: Date;
}

const ScheduleMeetingModal = ({ isOpen, onClose }) => {
  const [meetingName, setMeetingName] = useState('');
  const [timeZone, setTimeZone] = useState('Asia/Calcutta IST - India (UTC +05:30)');
  const [duration, setDuration] = useState('1 hour');
  const [place, setPlace] = useState('');
  const [contact, setContact] = useState('Choose');
  const [shareDeadline, setShareDeadline] = useState(false);
  const [onlineMeeting, setOnlineMeeting] = useState(false);
  const [setDeadline, setSetDeadline] = useState(false);
  const [hideInvitees, setHideInvitees] = useState(false);
  const [ignoreSchedules, setIgnoreSchedules] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [selectedView, setSelectedView] = useState('Week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const timeSlots = [
    '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', 
    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1:00'
  ];

  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = new Date(date);
    // Start from Sunday of the current week
    currentDay.setDate(currentDay.getDate() - currentDay.getDay());
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDay);
      const today = new Date();
      days.push({
        date: dayDate.getDate(),
        day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayDate.getDay()],
        isToday: dayDate.toDateString() === today.toDateString(),
        dateObj: dayDate
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const weekDays = getWeekDays(selectedDate);
  const viewOptions = ['Day', '2 days', 'Week', 'Month'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-white">Schedule meeting</h2>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">i</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white border border-gray-700 rounded-md hover:bg-gray-800"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1">
              <Check size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Left Panel */}
          <div className="w-1/3 p-4 border-r border-gray-800 bg-gray-900/50">
            {/* Host */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-white">Host</span>
              </div>
              <span className="text-sm text-blue-400">FAM</span>
            </div>

            {/* Meeting Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Meeting name</label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="Meeting name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            {/* Time Zone & Duration */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Time zone</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                  <option className="bg-gray-800">{timeZone}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Duration</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                  <option className="bg-gray-800">{duration}</option>
                </select>
              </div>
            </div>

            {/* Share Deadline */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={shareDeadline}
                  onChange={(e) => setShareDeadline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">share the link to the deadline proposal</span>
              </label>
            </div>

            {/* Additional Options */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={onlineMeeting}
                  onChange={(e) => setOnlineMeeting(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">online meeting</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={setDeadline}
                  onChange={(e) => setSetDeadline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">set a deadline for response</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hideInvitees}
                  onChange={(e) => setHideInvitees(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">hide the list of invitees</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ignoreSchedules}
                  onChange={(e) => setIgnoreSchedules(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">ignore work schedules</span>
              </label>
            </div>

            {/* Place */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Place</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Place"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            {/* Proposed Dates */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">Proposed dates</span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-400 text-sm flex items-center space-x-1 hover:text-blue-300">
                    <Check size={16} />
                    <span>Select All</span>
                  </button>
                  <button className="text-blue-400 text-sm flex items-center space-x-1 hover:text-blue-300">
                    <X size={16} />
                    <span>Clear selection</span>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Right Panel - Calendar */}
          <div className="flex-1 p-4 bg-gray-900/30">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">
                  <Settings size={16} />
                </button>
                <button className="px-3 py-1.5 text-gray-300 hover:text-white border border-gray-700 rounded-md hover:bg-gray-800">
                  Today
                </button>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() - 7);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(newDate.getDate() + 7);
                      setSelectedDate(newDate);
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {weekDays[0].dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center space-x-1">
                {viewOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedView(option)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedView === option
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Week Header */}
              <div className="grid grid-cols-8 bg-gray-900 border-b border-gray-800">
                <div className="p-2"></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-2 text-center border-l border-gray-800">
                    <div className="text-xs text-gray-400 uppercase">{day.day}</div>
                    <div className={`text-sm font-medium mt-1 ${
                      day.isToday ? 'bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto' : 'text-white'
                    }`}>
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="max-h-96 overflow-y-auto">
                {timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="grid grid-cols-8 border-b border-gray-800 hover:bg-gray-800/30">
                    <div className="p-2 text-sm text-gray-400 border-r border-gray-800">{time}</div>
                    {weekDays.map((day, dayIndex) => (
                      <div 
                        key={dayIndex} 
                        className="p-2 border-l border-gray-800 min-h-[40px] hover:bg-blue-900/20 cursor-pointer"
                        onClick={() => {
                          const selectedDateTime = new Date(day.dateObj);
                          const [hours] = time.split(':').map(Number);
                          selectedDateTime.setHours(hours);
                          setSelectedDate(selectedDateTime);
                        }}
                      >
                        {/* Time slot content */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewIssueModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('event');
  const [subject, setSubject] = useState('');
  const [project, setProject] = useState('Choose');
  const [calendar, setCalendar] = useState('General');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [wholeDay, setWholeDay] = useState(true);
  const [contact, setContact] = useState('Choose');

  const issueTypes = [
    { id: 'event', label: 'event', icon: '●' },
    { id: 'meeting', label: 'meeting', icon: '📅' },
    { id: 'task', label: 'task', icon: '✓' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">★</span>
            <h2 className="text-lg font-semibold text-white">New Issue</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Issue Type */}
          <div className="flex items-center space-x-4 mb-4">
            {issueTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedType === type.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-blue-400 text-sm">● New</span>
              <button className="text-gray-400 hover:text-white">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Project</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
              <option className="bg-gray-800">{project}</option>
            </select>
          </div>

          {/* Calendar */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Calendar</label>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
              <option className="bg-gray-800">{calendar}</option>
            </select>
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Start</label>
              <input
                type="text"
                value={startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                onChange={(e) => {
                  // In a real app, you'd parse the date input properly
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setStartDate(newDate);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">End</label>
              <input
                type="text"
                value={endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    setEndDate(newDate);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Whole Day */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={wholeDay}
                onChange={(e) => setWholeDay(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
              />
              <span className="text-sm text-blue-400">whole day</span>
            </label>
          </div>

          {/* Assigned User */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-white">Assigned user</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">F</span>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">+</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-white">Contact</span>
            </div>
            <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
              <option className="bg-gray-800">{contact}</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white bg-gray-800 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-gray-300 hover:text-white bg-gray-800 rounded-md hover:bg-gray-700">
              More options
            </button>
          </div>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1">
            <Check size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Calendar = ({ onNavigateBack }: CalendarProps) => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [view, setView] = useState('Month');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const viewOptions = ['Day', '2 days', 'Week', '2 weeks', 'Month', 'Agenda'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days in month
    const daysInMonth = lastDay.getDate();
    // Day of week for first day of month (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    const todayString = today.toDateString();
    
    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = prevMonthLastDay - startingDayOfWeek + i + 1;
      const dateObj = new Date(year, month - 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        dateObj
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: dateObj.toDateString() === todayString,
        dateObj
      });
    }
    
    // Add next month's leading days to complete the grid
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const dateObj = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        dateObj
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      // Handle year transition if needed
      if (newDate.getMonth() !== (prev.getMonth() + direction) % 12) {
        newDate.setFullYear(prev.getFullYear() + (direction > 0 ? 1 : -1));
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  const breadcrumbItems = [
    { label: 'LoopInt', onClick: onNavigateBack },
    { label: 'Calendar' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Calendar</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowNewIssueModal(true)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>New Issue</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center space-x-1"
                >
                  <CalendarIcon size={16} />
                  <span>Schedule meeting</span>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-700 rounded-md hover:bg-gray-800"
                >
                  Today
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {months[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}
                </h2>
              </div>
              
              <div className="flex items-center space-x-1">
                {viewOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setView(option)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      view === option
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-px mb-2">
                {weekdays.map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-400 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-gray-800 rounded-lg overflow-hidden">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`bg-gray-900/70 p-2 min-h-[100px] hover:bg-gray-800/50 cursor-pointer ${
                      !day.isCurrentMonth ? 'text-gray-600' : 'text-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-sm font-medium ${
                          day.isToday
                            ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                            : day.isCurrentMonth
                            ? 'text-gray-200'
                            : 'text-gray-600'
                        }`}
                      >
                        {day.date}
                      </span>
                      {day.isToday && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    {/* Example event - you might want to make this dynamic */}
                    {day.date === currentDate.getDate() && 
                     day.isCurrentMonth && 
                     currentDate.getMonth() === new Date().getMonth() && 
                     currentDate.getFullYear() === new Date().getFullYear() && (
                      <div className="mt-2 bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded">
                        Event
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modals */}
          <ScheduleMeetingModal
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
          />
          <NewIssueModal
            isOpen={showNewIssueModal}
            onClose={() => setShowNewIssueModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;