import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CalendarViews from './components/CalendarViews';
import ScheduleMeetingModal from './components/ScheduleMeetingModal';
import NewIssueModal from './components/NewIssueModal';

interface CalendarProps {
  onNavigateBack?: () => void;
}

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'task' | 'event';
  color: string;
  date: Date;
}

interface ViewFilter {
  id: string;
  label: string;
  description: string;
  active: boolean;
}

const Calendar = ({ onNavigateBack }: CalendarProps) => {
  useTheme();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [view, setView] = useState('Month');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      startTime: '10:00',
      endTime: '11:00',
      type: 'meeting',
      color: 'bg-blue-500',
      date: new Date()
    },
    {
      id: '2',
      title: 'Project Review',
      startTime: '14:00',
      endTime: '15:30',
      type: 'task',
      color: 'bg-green-500',
      date: new Date(new Date().setDate(new Date().getDate() + 2))
    }
  ]);
  const [viewFilters, setViewFilters] = useState<ViewFilter[]>([
    { id: 'meetings', label: 'Meetings', description: 'Show scheduled meetings', active: true },
    { id: 'tasks', label: 'Tasks', description: 'Show tasks and deadlines', active: true },
    { id: 'events', label: 'Events', description: 'Show calendar events', active: true },
    { id: 'personal', label: 'Personal', description: 'Show personal items', active: false }
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const viewOptions = [
    { id: 'Day', label: 'Day', description: 'Single day view' },
    { id: 'Week', label: 'Week', description: '7-day week view' },
    { id: 'Month', label: 'Month', description: 'Full month grid' },
    { id: 'Agenda', label: 'Agenda', description: 'List view of events' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEvents = events.filter(event => {
    const activeFilters = viewFilters.filter(f => f.active).map(f => f.id);
    if (activeFilters.includes('meetings') && event.type === 'meeting') return true;
    if (activeFilters.includes('tasks') && event.type === 'task') return true;
    if (activeFilters.includes('events') && event.type === 'event') return true;
    return false;
  });

  const toggleFilter = (filterId: string) => {
    setViewFilters(prev => prev.map(filter => 
      filter.id === filterId ? { ...filter, active: !filter.active } : filter
    ));
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setShowNewIssueModal(true);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      if (newDate.getMonth() !== (prev.getMonth() + direction) % 12) {
        newDate.setFullYear(prev.getFullYear() + (direction > 0 ? 1 : -1));
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

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
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 rounded-xl overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowNewIssueModal(true)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Issue</span>
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center space-x-1"
                >
                  <CalendarIcon size={14} />
                  <span>Meeting</span>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Today
                </button>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Options */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
                  {viewOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setView(option.id)}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        view === option.id
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={option.description}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                {/* Filters */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-colors flex items-center space-x-1 ${
                      showFilters
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Filter size={12} />
                    <span>Filters</span>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-10">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">View Filters</h3>
                      </div>
                      <div className="p-2">
                        {viewFilters.map((filter) => (
                          <label key={filter.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filter.active}
                              onChange={() => toggleFilter(filter.id)}
                              className="w-3 h-3 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-800"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{filter.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{filter.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar Views */}
            <CalendarViews
              view={view}
              currentDate={currentDate}
              events={filteredEvents}
              onDateClick={handleDateClick}
            />
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
      
      {/* Click outside to close filters */}
      {showFilters && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Calendar;