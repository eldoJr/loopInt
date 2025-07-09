import { useState, useCallback } from 'react';
import { X, Check, User, Calendar as CalendarIcon, Tag, FileText, Video, CheckSquare, Target } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewIssueModal = ({ isOpen, onClose }: ModalProps) => {
  const [selectedType, setSelectedType] = useState('event');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Choose');
  const [calendar, setCalendar] = useState('General');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('new');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [wholeDay, setWholeDay] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [reminders, setReminders] = useState<string[]>(['15min']);

  const issueTypes = [
    { id: 'event', label: 'Event', icon: CalendarIcon, color: 'bg-purple-500' },
    { id: 'meeting', label: 'Meeting', icon: Video, color: 'bg-blue-500' },
    { id: 'task', label: 'Task', icon: CheckSquare, color: 'bg-green-500' },
    { id: 'deadline', label: 'Deadline', icon: Target, color: 'bg-red-500' }
  ];

  const handleSave = useCallback(() => {
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    
    const issueData = {
      type: selectedType,
      subject: subject.trim(),
      description: description.trim(),
      project,
      calendar,
      priority,
      status,
      startDate,
      endDate,
      startTime: wholeDay ? null : startTime,
      endTime: wholeDay ? null : endTime,
      wholeDay,
      tags,
      reminders
    };
    
    console.log('Saving issue:', issueData);
    onClose();
  }, [selectedType, subject, description, project, calendar, priority, status, startDate, endDate, startTime, endTime, wholeDay, tags, reminders, onClose]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-xl shadow-xl max-w-5xl w-full mx-4 h-[75vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Create New Issue</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2 transition-colors"
            >
              <Check size={16} />
              <span>Create Issue</span>
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-1/2 p-4 border-r border-gray-800 overflow-y-auto">
            {/* Issue Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Issue Type</label>
              <div className="grid grid-cols-2 gap-2">
                {issueTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-lg border transition-all flex items-center space-x-2 ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject or title"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description or notes..."
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
              />
            </div>

            {/* Project & Calendar */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Project</label>
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="Choose">Choose Project</option>
                  <option value="Project Alpha">Project Alpha</option>
                  <option value="Project Beta">Project Beta</option>
                  <option value="Project Gamma">Project Gamma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Calendar</label>
                <select 
                  value={calendar}
                  onChange={(e) => setCalendar(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Team">Team</option>
                </select>
              </div>
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Tags</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-300 hover:text-blue-100"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {/* Date & Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Schedule</label>
              
              {/* Whole Day Toggle */}
              <div className="mb-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={wholeDay}
                    onChange={(e) => setWholeDay(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                  />
                  <span className="text-sm text-blue-400">All day event</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (!isNaN(newDate.getTime())) {
                        setStartDate(newDate);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  />
                  {!wholeDay && (
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">End Date</label>
                  <input
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      if (!isNaN(newDate.getTime())) {
                        setEndDate(newDate);
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                  />
                  {!wholeDay && (
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Reminders</label>
              <div className="space-y-2">
                {['15min', '1hour', '1day'].map((reminder) => (
                  <label key={reminder} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reminders.includes(reminder)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReminders([...reminders, reminder]);
                        } else {
                          setReminders(reminders.filter(r => r !== reminder));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                    />
                    <span className="text-sm text-gray-300">
                      {reminder === '15min' && '15 minutes before'}
                      {reminder === '1hour' && '1 hour before'}
                      {reminder === '1day' && '1 day before'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assigned User */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-white">Assigned user</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">F</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600">
                  <span className="text-gray-300 text-sm">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssueModal;