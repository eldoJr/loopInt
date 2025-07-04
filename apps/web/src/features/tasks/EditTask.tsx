import { useState, useEffect } from 'react';
import { Calendar, User, Flag, FileText, Save, X, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isToday, isTomorrow, isThisWeek } from 'date-fns';

interface EditTaskModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const EditTaskModal = ({ taskId, isOpen, onClose, onTaskUpdated }: EditTaskModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    project_id: '',
    assigned_to: ''
  });

  const quickDateOptions = [
    { label: 'Today', value: format(new Date(), 'yyyy-MM-dd'), icon: '📅' },
    { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd'), icon: '⏰' },
    { label: 'This Weekend', value: format(addDays(startOfWeek(new Date()), 6), 'yyyy-MM-dd'), icon: '🎯' },
    { label: 'Next Week', value: format(addWeeks(new Date(), 1), 'yyyy-MM-dd'), icon: '📆' }
  ];

  const getDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      if (isThisWeek(date)) return 'This Week';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr;
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      const fetchTask = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
          if (response.ok) {
            const task = await response.json();
            setFormData({
              title: task.title || '',
              description: task.description || '',
              status: task.status || 'todo',
              priority: task.priority || 'medium',
              due_date: task.due_date ? task.due_date.split('T')[0] : '',
              project_id: task.project_id || '',
              assigned_to: task.assigned_to || ''
            });
          }
        } catch (error) {
          console.error('Error fetching task:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [isOpen, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean the form data before sending - exclude project_id and assigned_to for now
      const cleanedData = {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null
      };
      
      console.log('Sending update request:', cleanedData);
      
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });
      
      if (response.ok) {
        onTaskUpdated();
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert(`Failed to update task: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Edit Task</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter task title"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date {formData.due_date && (
                  <span className="text-blue-400 text-xs ml-2">({getDateLabel(formData.due_date)})</span>
                )}
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {quickDateOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, due_date: option.value })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                      formData.due_date === option.value
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50 hover:text-gray-300'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                <option value="">Select Project</option>
                <option value="1">E-commerce Platform</option>
                <option value="2">Mobile App Redesign</option>
                <option value="3">API Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />Assign To
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                <option value="">Assign to someone</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Mike Johnson</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Updating...' : 'Update Task'}</span>
            </button>
          </div>
        </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;