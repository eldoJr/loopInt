import { useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Menu, X, ChevronDown, Github, Linkedin, Instagram, ArrowRight, Sparkles, LayoutDashboard, Settings, Users, FileText, Calendar, CreditCard, ShoppingBag, CheckCircle, Zap, Tag, Clipboard, BarChart2 } from 'lucide-react';
import logoImg from "../../assets/img/logo/logo-b.svg"

interface NavItem {
  label: string;
  href: string;
  description?: string;
  isNew?: boolean;
  icon?: ReactElement;
}

interface NavSection {
  title: string;
  items: NavItem[];
  color?: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Navigation data with Lucide icons
  const navigationData: Record<string, NavSection> = {
    solutions: {
      title: 'Solutions',
      color: 'blue',
      items: [
        { label: 'Project Management', href: '#project-management', description: 'Streamline your projects with powerful collaboration tools', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'CBM Tools', href: '#cbm-tools', description: 'Comprehensive business management solutions', icon: <Settings className="w-4 h-4" /> },
        { label: 'Freshwear Management', href: '#freshwear-management', description: 'Complete inventory and retail management', icon: <ShoppingBag className="w-4 h-4" />, isNew: true },
        { label: 'Use Cases', href: '#usecases', description: 'Real-world applications and success stories', icon: <Zap className="w-4 h-4" /> },
        { label: 'Finances', href: '#finances', description: 'Advanced financial tracking and reporting', icon: <CreditCard className="w-4 h-4" /> },
        { label: 'HRMS', href: '#hrms', description: 'Human resource management system', icon: <Users className="w-4 h-4" /> },
        { label: 'Pricing', href: '#pricing', description: 'Flexible pricing plans for every business size', icon: <Tag className="w-4 h-4" /> },
        { label: 'To-do List', href: '#todo-list', description: 'Task management and productivity tools', icon: <CheckCircle className="w-4 h-4" /> }
      ]
    },
    marketing: {
      title: 'Marketing',
      color: 'purple',
      items: [
        { label: 'IT Solutions', href: '#marketing-it', description: 'Technology-focused marketing automation', icon: <BarChart2 className="w-4 h-4" /> },
        { label: 'HR Strategies', href: '#marketing-hr', description: 'Human resources marketing strategies', icon: <Users className="w-4 h-4" /> },
        { label: 'Sales Campaigns', href: '#marketing-sales', description: 'Data-driven sales campaign management', icon: <BarChart2 className="w-4 h-4" />, isNew: true },
        { label: 'Design Teams', href: '#marketing-design', description: 'Creative team collaboration and workflows', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Event Management', href: '#marketing-events', description: 'Complete event planning and execution', icon: <Calendar className="w-4 h-4" /> }
      ]
    },
    useCases: {
      title: 'Use Cases',
      color: 'emerald',
      items: [
        { label: 'Free Invoicing App', href: '#free-invoicing', description: 'Create professional invoices in seconds', icon: <FileText className="w-4 h-4" /> },
        { label: 'HR Management', href: '#hr-usecase', description: 'Employee lifecycle and workflow management', icon: <Users className="w-4 h-4" /> },
        { label: 'Project Tracking', href: '#pm-usecase', description: 'Real-time team collaboration and tracking', icon: <Clipboard className="w-4 h-4" /> },
        { label: 'Finance Suite', href: '#finance-invoice', description: 'Complete financial management platform', icon: <CreditCard className="w-4 h-4" /> },
        { label: 'Freelance Tools', href: '#freelance-management', description: 'Everything independent professionals need', icon: <Zap className="w-4 h-4" />, isNew: true }
      ]
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (mobileMenuRef.current && isMenuOpen && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key and prevent background scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const getColorClasses = (color: string) => {
    type ColorClasses = {
      dot: string;
      hover: string;
      text: string;
      border: string;
      gradient: string;
      bg: string;
    };

    const colorMap: Record<string, ColorClasses> = {
      blue: {
        dot: 'bg-blue-500',
        hover: 'hover:bg-blue-500/10',
        text: 'group-hover:text-blue-400',
        border: 'border-blue-500/20',
        gradient: 'from-blue-500/5 via-blue-500/10 to-transparent',
        bg: 'bg-blue-500/5'
      },
      purple: {
        dot: 'bg-purple-500',
        hover: 'hover:bg-purple-500/10',
        text: 'group-hover:text-purple-400',
        border: 'border-purple-500/20',
        gradient: 'from-purple-500/5 via-purple-500/10 to-transparent',
        bg: 'bg-purple-500/5'
      },
      emerald: {
        dot: 'bg-emerald-500',
        hover: 'hover:bg-emerald-500/10',
        text: 'group-hover:text-emerald-400',
        border: 'border-emerald-500/20',
        gradient: 'from-emerald-500/5 via-emerald-500/10 to-transparent',
        bg: 'bg-emerald-500/5'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderDropdownItems = (items: NavItem[], color: string, isMobile = false) => {
    const colorClasses = getColorClasses(color);
    
    if (isMobile) {
      return (
        <div className="space-y-1 py-2">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`group flex items-start px-4 py-3 text-sm font-medium text-gray-300 hover:text-white ${colorClasses.hover} rounded-lg transition-all duration-200 mx-1 relative overflow-hidden`}
              onClick={closeMenu}

            >
              <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg mr-3 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="group-hover:translate-x-1 transition-transform duration-200 font-semibold text-white truncate">
                    {item.label}
                  </span>
                  {item.isNew && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New
                    </span>
                  )}
                </div>
                {item.description && (
                  <div className={`text-xs text-gray-500 mt-1 ${colorClasses.text} transition-colors duration-200 line-clamp-2`}>
                    {item.description}
                  </div>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100" />
            </a>
          ))}
        </div>
      );
    }

    // Desktop layout - enhanced grid with better spacing
    const chunkSize = Math.min(Math.ceil(items.length / 3), 4);
    const itemChunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      itemChunks.push(items.slice(i, i + chunkSize));
    }

    return (
      <div className={`grid gap-3 ${itemChunks.length === 1 ? 'grid-cols-1' : itemChunks.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {itemChunks.map((chunk, chunkIndex) => (
          <div key={chunkIndex} className="space-y-2">
            {chunk.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`group flex items-start px-4 py-3 text-sm font-medium text-gray-400 hover:text-white ${colorClasses.hover} rounded-lg transition-all duration-200 relative overflow-hidden border border-transparent hover:${colorClasses.border}`}
                onClick={closeMenu}

              >
                <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg mr-3 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 font-semibold text-white truncate">
                      {item.label}
                    </span>
                    {item.isNew && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        New
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div className={`text-xs text-gray-500 ${colorClasses.text} transition-colors duration-200 line-clamp-2 leading-relaxed`}>
                      {item.description}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 opacity-0 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderDesktopDropdown = (sectionKey: string) => {
    const section = navigationData[sectionKey];
    const colorClasses = getColorClasses(section.color || 'blue');
    
    return (
      <div className="relative" key={sectionKey}>
        <button
          onClick={() => toggleDropdown(sectionKey)}
          onMouseEnter={() => setActiveDropdown(sectionKey)}
          className={`flex items-center px-4 py-3 text-sm font-semibold transition-all duration-200 group relative rounded-lg ${
            activeDropdown === sectionKey ? 'text-white bg-gray-800/20' : 'text-gray-300 hover:text-white hover:bg-gray-800/10'
          }`}
          aria-expanded={activeDropdown === sectionKey}
          aria-haspopup="true"
        >
          <span className="relative z-10 tracking-wide">{section.title}</span>
          <ChevronDown className={`ml-2 h-4 w-4 transition-all duration-200 ${
            activeDropdown === sectionKey ? 'rotate-180 text-blue-400' : 'group-hover:text-blue-400'
          }`} />
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 ${colorClasses.dot} transition-all duration-200 ${
            activeDropdown === sectionKey ? 'w-full' : 'w-0 group-hover:w-full'
          } rounded-full`}></div>
        </button>
        
        {activeDropdown === sectionKey && (
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[52rem] bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800/50 overflow-hidden animate-in slide-in-from-top-4 duration-200 z-50"
            onMouseLeave={() => setActiveDropdown(null)}
            role="menu"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              maxWidth: 'calc(100vw - 2rem)'
            }}
          >
            <div className="relative z-10">
              <div className={`px-6 py-4 border-b border-gray-800/50 ${colorClasses.bg}`}>
                <h3 className="text-sm font-bold text-gray-200 flex items-center">
                  <div className={`w-3 h-3 ${colorClasses.dot} rounded-full mr-3`}></div>
                  {section.title}
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    {section.items.length} tools available
                  </span>
                </h3>
              </div>
              <div className="p-6 max-h-[40rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {renderDropdownItems(section.items, section.color || 'blue')}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMobileDropdown = (sectionKey: string) => {
    const section = navigationData[sectionKey];
    const mobileKey = `mobile-${sectionKey}`;
    const colorClasses = getColorClasses(section.color || 'blue');
    
    return (
      <div key={sectionKey} className="border-b border-gray-800/20 last:border-b-0 rounded-lg overflow-hidden bg-gray-900/20">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(mobileKey);
          }}
          className={`flex items-center justify-between w-full px-4 py-4 text-base font-bold text-gray-300 hover:text-white ${colorClasses.hover} rounded-lg transition-all duration-200 group`}
          aria-expanded={activeDropdown === mobileKey}
          type="button"
        >
          <div className="flex items-center">
            <div className={`w-3 h-3 ${colorClasses.dot} rounded-full mr-3 transition-all duration-200 flex-shrink-0`}></div>
            <span className="truncate">{section.title}</span>
          </div>
          <ChevronDown className={`h-5 w-5 transition-transform duration-200 flex-shrink-0 ${
            activeDropdown === mobileKey ? 'rotate-180 text-blue-400' : 'text-gray-500'
          }`} />
        </button>
        
        {activeDropdown === mobileKey && (
          <div className="bg-gray-900/30 animate-in slide-in-from-top-4 duration-200">
            {renderDropdownItems(section.items, section.color || 'blue', true)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className={`fixed w-full z-50 bg-gray-900/95 shadow-sm border-b border-white/5 backdrop-blur-sm transition-all duration-300 ${
        isScrolled ? 'py-0' : 'py-1'
      }`}>
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="#" className="flex items-center group">
                <img src={logoImg} alt="Firmbee Logo" className="h-10 w-auto" />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 ml-auto mr-6" ref={dropdownRef}>
              <a 
                href="#about" 
                className="px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/10 rounded-lg relative group tracking-wide"
              >
                About
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-200 w-0 group-hover:w-full rounded-full"></div>
              </a>
              {Object.keys(navigationData).map(sectionKey => renderDesktopDropdown(sectionKey))}
              <a 
                href="#contact" 
                className="px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/10 rounded-lg relative group tracking-wide"
              >
                Contact
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-200 w-0 group-hover:w-full rounded-full"></div>
              </a>
            </div>

            {/* Desktop Actions & Social Links */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/20 rounded-lg border border-gray-700/40 hover:border-gray-600/60"
                >
                  Login
                </button>
                <button 
                  onClick={() => window.location.href = '/register'}
                  className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 active:scale-100 relative overflow-hidden group"
                >
                  <span className="relative z-10">Join Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-1 px-2 py-1.5 bg-gray-900/40 rounded-lg border border-gray-700/30 ml-1">
                <a 
                  href="#linkedin" 
                  className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-400/10 rounded-md group"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a 
                  href="#github" 
                  className="p-1.5 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/20 rounded-md group"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a 
                  href="#instagram" 
                  className="p-1.5 text-gray-400 hover:text-pink-400 transition-all duration-200 hover:bg-pink-400/10 rounded-md group"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/20 transition-all duration-200"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          ></div>
          
          {/* Side Navigation */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900/95 backdrop-blur-sm shadow-xl animate-in slide-in-from-right duration-200 flex flex-col overflow-y-auto border-l border-gray-800/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/30 bg-gray-900/80 sticky top-0 z-10">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="#" className="flex items-center group">
                <img src={logoImg} alt="Firmbee Logo" className="h-10 w-auto" />
              </a>
            </div>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/20 rounded-lg transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {/* Simple Links */}
              <div className="space-y-1">
                <a 
                  href="#about" 
                  className="flex items-center px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800/20 rounded-lg transition-all duration-200 group"
                  onClick={closeMenu}
                >
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About</span>
                </a>
              </div>

              {/* Dropdown Sections */}
              <div className="space-y-2">
                {Object.keys(navigationData).map(sectionKey => renderMobileDropdown(sectionKey))}
              </div>
              <div className="space-y-1">
                <a 
                  href="#contact" 
                  className="flex items-center px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800/20 rounded-lg transition-all duration-200 group"
                  onClick={closeMenu}
                >
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                </a>
              </div>
              
            </div>
            
            {/* Footer Actions */}
            <div className="sticky bottom-0 border-t border-gray-800/30 p-5 space-y-3 bg-gray-900/95">
              <button 
                onClick={() => { closeMenu(); window.location.href = '/login'; }}
                className="block w-full px-4 py-3 text-base font-semibold text-center text-gray-300 hover:text-white hover:bg-gray-800/20 rounded-lg border border-gray-700/60 hover:border-gray-600/80 transition-all duration-200"
              >
                Login
              </button>
              <button 
                onClick={() => { closeMenu(); window.location.href = '/register'; }}
                className="block w-full px-4 py-3 text-base font-bold text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow transform hover:scale-105 active:scale-100"
              >
                Join Free
              </button>

               {/* Social Links */}
              <div className="pt-3 border-t border-gray-800/30">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
                  Connect With Us
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <a 
                    href="#linkedin" 
                    className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-400/10 rounded-lg"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    onClick={closeMenu}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="#github" 
                    className="p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/20 rounded-lg"
                    title="GitHub"
                    aria-label="GitHub"
                    onClick={closeMenu}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="#instagram" 
                    className="p-2 text-gray-400 hover:text-pink-400 transition-all duration-200 hover:bg-pink-400/10 rounded-lg"
                    title="Instagram"
                    aria-label="Instagram"
                    onClick={closeMenu}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;