import { useState, useCallback } from 'react';
import { X, Check, User, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal = ({ isOpen, onClose }: ModalProps) => {
  const [meetingName, setMeetingName] = useState('');
  const [timeZone, setTimeZone] = useState('Asia/Calcutta IST - India (UTC +05:30)');
  const [duration, setDuration] = useState('1 hour');
  const [place, setPlace] = useState('');
  const [shareDeadline, setShareDeadline] = useState(false);
  const [onlineMeeting, setOnlineMeeting] = useState(false);
  const [setDeadline, setSetDeadline] = useState(false);
  const [hideInvitees, setHideInvitees] = useState(false);
  const [ignoreSchedules, setIgnoreSchedules] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSave = useCallback(() => {
    if (!meetingName.trim()) {
      alert('Please enter a meeting name');
      return;
    }
    console.log('Saving meeting:', { meetingName, timeZone, duration, place });
    onClose();
  }, [meetingName, timeZone, duration, place, onClose]);

  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = new Date(date);
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
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1 transition-colors"
            >
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
                <select 
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="Asia/Calcutta IST - India (UTC +05:30)">Asia/Calcutta IST - India (UTC +05:30)</option>
                  <option value="America/New_York EST - Eastern (UTC -05:00)">America/New_York EST - Eastern (UTC -05:00)</option>
                  <option value="Europe/London GMT - London (UTC +00:00)">Europe/London GMT - London (UTC +00:00)</option>
                  <option value="Asia/Tokyo JST - Tokyo (UTC +09:00)">Asia/Tokyo JST - Tokyo (UTC +09:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={shareDeadline}
                  onChange={(e) => setShareDeadline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <span className="text-sm text-gray-400">share the link to the deadline proposal</span>
              </label>
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
                  <button 
                    onClick={() => setSelectedTimeSlots(timeSlots)}
                    className="text-blue-400 text-sm flex items-center space-x-1 hover:text-blue-300 transition-colors"
                  >
                    <Check size={16} />
                    <span>Select All</span>
                  </button>
                  <button 
                    onClick={() => setSelectedTimeSlots([])}
                    className="text-blue-400 text-sm flex items-center space-x-1 hover:text-blue-300 transition-colors"
                  >
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
                    {weekDays.map((day, dayIndex) => {
                      const slotKey = `${day.dateObj.toDateString()}-${time}`;
                      const isSelected = selectedTimeSlots.includes(slotKey);
                      return (
                        <div 
                          key={dayIndex} 
                          className={`p-2 border-l border-gray-800 min-h-[40px] cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-500/30 border-blue-400' : 'hover:bg-blue-900/20'
                          }`}
                          onClick={() => {
                            setSelectedTimeSlots(prev => 
                              prev.includes(slotKey) 
                                ? prev.filter(slot => slot !== slotKey)
                                : [...prev, slotKey]
                            );
                          }}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
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

export default ScheduleMeetingModal;