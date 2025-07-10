import { useState } from 'react';
import { X, Home, FolderOpen, CheckSquare, Calendar, Users, BarChart3, FileText, ChevronRight, Filter, Target, Settings, MessageSquare, Building } from 'lucide-react';
import logoImg from '../../assets/img/logo/logo-b.svg';
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

const Sidebar = ({ isOpen, onClose, currentView, onNavigate, isHovered, setIsHovered, isMouseOverButton }: SidebarProps) => {
  useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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
    { name: 'Reports', icon: FileText }
  ];

  const recentItems = [
    { name: 'Monthly Report', icon: FileText, time: '2 hours ago' },
    { name: 'Team Meeting', icon: Calendar, time: '1 day ago' },
    { name: 'Project Alpha', icon: FolderOpen, time: '3 days ago' }
  ];

  const shouldShow = isOpen || isHovered || isMouseOverButton;

  return (
    <>
      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transform transition-all duration-300 ease-in-out shadow-2xl ${
          shouldShow ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered?.(true)}
        onMouseLeave={() => setIsHovered?.(false)}
      >

        
        <div className="flex-1 overflow-y-auto pb-16">
          {/* For You Section */}
          <div className="p-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">For You</h3>
            <div className="space-y-1">
              {navItems.map((item) => {
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
                      onClose();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : isHovered
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Section */}
          <div className="p-3">
            <button
              onClick={() => toggleSection('recent')}
              className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <span>Recent</span>
              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${expandedSections.recent ? 'rotate-90' : ''}`} />
            </button>
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedSections.recent ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              {recentItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
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
              className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <span>More</span>
              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${expandedSections.more ? 'rotate-90' : ''}`} />
            </button>
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedSections.more ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Filters</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Goals</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                   onClick={() => { onNavigate('Clients'); onClose(); }}>
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Clients</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                   onClick={() => { onNavigate('Help Center'); onClose(); }}>
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Help Center</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                   onClick={() => { onNavigate('Account Settings'); onClose(); }}>
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Customize sidebar</span>
              </div>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button 
            onClick={() => { onNavigate('Report Bug'); onClose(); }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Give feedback on LoopInt</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;