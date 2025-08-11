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
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-gradient-to-b from-white/95 via-gray-50/90 to-gray-100/85 dark:from-gray-900/98 dark:via-gray-900/95 dark:to-gray-800/92 border-r border-gray-200/70 dark:border-gray-700/70 shadow-2xl backdrop-blur-xl ${
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
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <div className="w-2 h-2 bg-tech-orange-500 rounded-full mr-2"></div>
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
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold group ${
                    isActive
                      ? 'bg-gradient-to-r from-tech-orange-500 to-tech-orange-600 text-white shadow-lg shadow-tech-orange-500/30 ring-1 ring-tech-orange-400/20'
                      : isHovered
                        ? 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-600/50'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shadow-sm ${
                      isActive
                        ? 'bg-white/25 shadow-inner'
                        : 'bg-gray-200/60 dark:bg-gray-700/60 group-hover:bg-tech-orange-100/80 dark:group-hover:bg-tech-orange-900/40'
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
            className="w-full flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 hover:text-tech-purple-600 dark:hover:text-tech-purple-400 group px-2 py-1 rounded-lg hover:bg-tech-purple-50/50 dark:hover:bg-tech-purple-900/20"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-tech-purple-500 rounded-full mr-2"></div>
              <span>Recent</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 group-hover:text-tech-purple-500 ${expandedSections.recent ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className={`space-y-1 overflow-hidden ${expandedSections.recent ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {recentItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group"
                >
                  <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-purple-100/80 dark:group-hover:bg-tech-purple-900/40 shadow-sm">
                    <IconComponent className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-purple-600 dark:group-hover:text-tech-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
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
            className="w-full flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 hover:text-tech-purple-600 dark:hover:text-tech-purple-400 group px-2 py-1 rounded-lg hover:bg-tech-purple-50/50 dark:hover:bg-tech-purple-900/20"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-tech-purple-500 rounded-full mr-2"></div>
              <span>More</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 group-hover:text-tech-purple-500 ${expandedSections.more ? 'rotate-90' : ''}`}
            />
          </button>
          <div
            className={`space-y-1 overflow-hidden ${expandedSections.more ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group">
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-orange-100/80 dark:group-hover:bg-tech-orange-900/40 shadow-sm">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-orange-600 dark:group-hover:text-tech-orange-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Filters
              </span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group">
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-orange-100/80 dark:group-hover:bg-tech-orange-900/40 shadow-sm">
                <Target className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-orange-600 dark:group-hover:text-tech-orange-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Goals
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group"
              onClick={() => {
                onNavigate('Clients');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-purple-100/80 dark:group-hover:bg-tech-purple-900/40 shadow-sm">
                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-purple-600 dark:group-hover:text-tech-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Clients
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group"
              onClick={() => {
                onNavigate('HR Project');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-purple-100/80 dark:group-hover:bg-tech-purple-900/40 shadow-sm">
                <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-purple-600 dark:group-hover:text-tech-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Job Ads
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group"
              onClick={() => {
                onNavigate('Help Center');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-purple-100/80 dark:group-hover:bg-tech-purple-900/40 shadow-sm">
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-purple-600 dark:group-hover:text-tech-purple-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Help Center
              </span>
            </div>
            <div
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:shadow-md hover:ring-1 hover:ring-gray-200/30 dark:hover:ring-gray-600/30 cursor-pointer group"
              onClick={() => {
                onNavigate('Account Settings');
                if (!isOpen) onClose();
              }}
            >
              <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-orange-100/80 dark:group-hover:bg-tech-orange-900/40 shadow-sm">
                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-orange-600 dark:group-hover:text-tech-orange-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Customize sidebar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-t from-gray-100/60 to-transparent dark:from-gray-800/60 backdrop-blur-md">
        <button
          onClick={() => {
            onNavigate('Report Bug');
            if (!isOpen) onClose();
          }}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tech-orange-50 dark:hover:bg-tech-orange-900/30 hover:shadow-lg hover:ring-1 hover:ring-tech-orange-200/50 dark:hover:ring-tech-orange-700/50 text-left group"
        >
          <div className="p-1.5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-tech-orange-100 dark:group-hover:bg-tech-orange-900/50 shadow-sm">
            <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-tech-orange-600 dark:group-hover:text-tech-orange-400" />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-tech-orange-700 dark:group-hover:text-tech-orange-300">
            Give feedback on LoopInt
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;