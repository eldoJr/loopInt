import { useState } from 'react';
import { X, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleMeetingModal = ({ isOpen, onClose }: ModalProps) => {
  useTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a meeting title');
      return;
    }
    console.log('Meeting scheduled:', { title, date, startTime, endTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Schedule Meeting</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="p-3 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1 transition-colors text-sm"
          >
            <Check size={14} />
            <span>Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;