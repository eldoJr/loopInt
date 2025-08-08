import { useState, useCallback, useEffect } from 'react';
import {
  X,
  Check,
  User,
  Calendar as CalendarIcon,
  Tag,
  FileText,
  Video,
  CheckSquare,
  Target,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewIssueModal = ({ isOpen, onClose }: ModalProps) => {
  useTheme();
  const [selectedType, setSelectedType] = useState('event');
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState(false);
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
    { id: 'deadline', label: 'Deadline', icon: Target, color: 'bg-red-500' },
  ];

  // Auto-focus subject field when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const subjectInput = document.getElementById('issue-subject');
        if (subjectInput) subjectInput.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Escape key to close modal
      if (e.key === 'Escape') {
        onClose();
      }

      // Ctrl/Cmd + Enter to save
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!subject.trim()) {
      setSubjectError(true);
      document.getElementById('issue-subject')?.focus();
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: subject.trim(),
          description: description.trim(),
          eventType: selectedType,
          startDate: wholeDay
            ? startDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
            : new Date(
                `${startDate.toISOString().split('T')[0]}T${startTime}:00.000Z`
              ).toISOString(),
          endDate: wholeDay
            ? endDate.toISOString().split('T')[0] + 'T23:59:59.999Z'
            : new Date(
                `${endDate.toISOString().split('T')[0]}T${endTime}:00.000Z`
              ).toISOString(),
          allDay: wholeDay,
          calendarName: calendar,
          priority,
          status,
          tags,
          reminders,
          createdBy: '00000000-0000-0000-0000-000000000001',
        }),
      });

      if (response.ok) {
        console.log('Issue created successfully');
        onClose();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to create issue' }));
        console.error('Error creating issue:', errorData.message);
        showError(`Failed to create issue: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      showError('Failed to create issue. Please try again.');
    }
  }, [
    selectedType,
    subject,
    description,
    project,
    calendar,
    priority,
    status,
    startDate,
    endDate,
    startTime,
    endTime,
    wholeDay,
    tags,
    reminders,
    onClose,
  ]);

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorMsg(true);
    setTimeout(() => setShowErrorMsg(false), 5000);
  };

  const addCustomTag = () => {
    const customTagInput = document.getElementById(
      'custom-tag-input'
    ) as HTMLInputElement;
    if (
      customTagInput &&
      customTagInput.value.trim() &&
      !tags.includes(customTagInput.value.trim())
    ) {
      setTags([...tags, customTagInput.value.trim()]);
      customTagInput.value = '';
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[70vh] overflow-hidden relative">
        {/* Error Message */}
        {showErrorMsg && (
          <div className="absolute top-0 left-0 right-0 p-2 bg-red-500 text-white text-sm flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errorMessage}
            </div>
            <button
              onClick={() => setShowErrorMsg(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Create New Issue
            </h2>
            <div className="hidden sm:flex items-center ml-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>Press Esc to close, Ctrl+Enter to save</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1 transition-colors text-sm"
            >
              <Check size={14} />
              <span>Create</span>
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-1/2 p-3 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            {/* Issue Type Selection */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                Issue Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {issueTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-2 rounded-lg border transition-all flex items-center space-x-2 text-sm ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-100 dark:bg-blue-500/10'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <IconComponent className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Subject *
              </label>
              <input
                id="issue-subject"
                type="text"
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  if (e.target.value.trim()) setSubjectError(false);
                }}
                placeholder="Enter subject or title"
                className={`w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border ${subjectError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:outline-none focus:ring-2 ${subjectError ? 'focus:ring-red-500' : 'focus:ring-blue-500'} text-gray-900 dark:text-white text-sm`}
              />
              {subjectError && (
                <p className="mt-1 text-xs text-red-500">Subject is required</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add description or notes..."
                rows={2}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none text-sm"
              />
            </div>

            {/* Project & Calendar */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Project
                </label>
                <select
                  value={project}
                  onChange={e => setProject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">No project available</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Calendar
                </label>
                <select
                  value={calendar}
                  onChange={e => setCalendar(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Team">Team</option>
                </select>
              </div>
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <select
                  value={newTag}
                  onChange={e => {
                    const selectedTag = e.target.value;
                    if (selectedTag && !tags.includes(selectedTag)) {
                      setTags([...tags, selectedTag]);
                      setNewTag('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">Select a tag...</option>
                  <option value="urgent">Urgent</option>
                  <option value="meeting">Meeting</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="review">Review</option>
                  <option value="testing">Testing</option>
                  <option value="deployment">Deployment</option>
                  <option value="bug-fix">Bug Fix</option>
                  <option value="feature">Feature</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>
              <div className="flex space-x-2 mb-2">
                <input
                  id="custom-tag-input"
                  type="text"
                  placeholder="Add custom tag..."
                  className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                  onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                />
                <button
                  onClick={addCustomTag}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-3 overflow-y-auto">
            {/* Date & Time */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Schedule
              </label>

              {/* Whole Day Toggle */}
              <div className="mb-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={wholeDay}
                    onChange={e => setWholeDay(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-800"
                  />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    All day event
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate.toISOString().split('T')[0]}
                    onChange={e => setStartDate(new Date(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                  />
                  {!wholeDay && (
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={e => setEndDate(new Date(e.target.value))}
                    className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                  />
                  {!wholeDay && (
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Reminders
              </label>
              <div className="space-y-1">
                {['15min', '1hour', '1day'].map(reminder => (
                  <label key={reminder} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reminders.includes(reminder)}
                      onChange={e => {
                        if (e.target.checked) {
                          setReminders([...reminders, reminder]);
                        } else {
                          setReminders(reminders.filter(r => r !== reminder));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-800"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {reminder === '15min' && '15 minutes before'}
                      {reminder === '1hour' && '1 hour before'}
                      {reminder === '1day' && '1 day before'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assigned User */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Assigned User
                </span>
              </div>
              <select className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm">
                <option value="current">You (Current User)</option>
                <option value="">Select a user...</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssueModal;
