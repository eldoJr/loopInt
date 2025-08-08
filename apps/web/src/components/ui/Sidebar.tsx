import { useState } from 'react';
import {
  Home,
  FolderOpen,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  FileText,
  ChevronRight,
  Filter,
  Target,
  Settings,
  MessageSquare,
  Building,
  Briefcase,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (section: string) => void;
  isHovered?: boolean;
  setIsHovered?: (hovered: boolean) => void;
  isMouseOverButton?: boolean;
  setIsMouseOverButton?: (hovered: boolean) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  isHovered,
  setIsHovered,
  isMouseOverButton,
}: SidebarProps) => {
  useTheme();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Projects', icon: FolderOpen },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Calendar', icon: Calendar },
    { name: 'Team', icon: Users },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Reports', icon: FileText },
  ];

  const recentItems = [
    { name: 'Monthly Report', icon: FileText, time: '2 hours ago' },
    { name: 'Team Meeting', icon: Calendar, time: '1 day ago' },
    { name: 'Project Alpha', icon: FolderOpen, time: '3 days ago' },
  ];

  const shouldShow = isOpen || isHovered || isMouseOverButton;

  return (
    <div
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 ease-in-out shadow-xl backdrop-blur-sm ${
        isOpen ? 'w-72 z-30' : shouldShow ? 'w-72 z-40' : 'w-0 z-40'
      } overflow-hidden`}
      onMouseEnter={() => {
        if (!isOpen) {
          setIsHovered?.(true);
        }
      }}
      onMouseLeave={() => {
        if (!isOpen) {
          setIsHovered?.(false);
        }
      }}
    >
      <div className="flex-1 overflow-y-auto pb-16">
        {/* For You Section */}
        <div className="p-3">
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            For You
          </h3>
          <div className="space-y-1">
            {navItems.map(item => {
              const IconComponent = item.icon;
              const isActive = currentView === item.name;
              const isHovered = hoveredItem === item.name;

              return (
                <button
                  key={item.name}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    onNavigate(item.name);
                    if (!isOpen) onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : isHovered
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-slate-200/50 dark:bg-slate-700/50 group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Section */}
        <div className="p-3">
          <button
            onClick={() => toggleSection('recent')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              <span>Recent</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 group-hover:text-blue-500 ${expandedSections.recent ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedSections.recent ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {recentItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                    <IconComponent className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* More Section */}
        <div className="p-3">
          <button
            onClick={() => toggleSection('more')}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>More</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-300 group-hover:text-blue-500 ${expandedSections.more ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedSections.more ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group">
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Filters
              </span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group">
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <Target className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Goals
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                onNavigate('Clients');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <Building className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Clients
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                onNavigate('HR Project');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <Briefcase className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Job Ads
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                onNavigate('Help Center');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Help Center
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                onNavigate('Account Settings');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-300/70 dark:group-hover:bg-slate-600/70 transition-colors">
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Customize sidebar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-t from-slate-100/50 to-transparent dark:from-slate-800/50 backdrop-blur-sm">
        <button
          onClick={() => {
            onNavigate('Report Bug');
            if (!isOpen) onClose();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 text-left group"
        >
          <div className="p-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
            <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
            Give feedback on LoopInt
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
