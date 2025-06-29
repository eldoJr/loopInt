import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Github, Linkedin, Instagram } from 'lucide-react';
import logoImg from "../../assets/img/logo/logo-b.svg";

interface NavItem {
  label: string;
  href: string;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navigationData: Record<string, NavSection> = {
    solutions: {
      title: 'SOLUTIONS',
      items: [
        { label: 'Project Management', href: '#project-management', description: 'Streamline your projects with powerful tools' },
        { label: 'CBM Tools', href: '#cbm-tools', description: 'Comprehensive business management solutions' },
        { label: 'Freshwear Management', href: '#freshwear-management', description: 'Complete inventory and retail management' },
        { label: 'Usecases', href: '#usecases', description: 'Real-world applications and examples' },
        { label: 'Finances', href: '#finances', description: 'Financial tracking and reporting tools' },
        { label: 'HRMS', href: '#hrms', description: 'Human resource management system' },
        { label: 'Pricing', href: '#pricing', description: 'Flexible pricing plans for every need' },
        { label: 'To-do list', href: '#todo-list', description: 'Task management and productivity tools' }
      ]
    },
    marketing: {
      title: 'MARKETING',
      items: [
        { label: 'IT Solutions', href: '#marketing-it', description: 'Technology-focused marketing solutions' },
        { label: 'HR Strategies', href: '#marketing-hr', description: 'Human resources marketing strategies' },
        { label: 'Sales Campaigns', href: '#marketing-sales', description: 'Sales-driven marketing campaigns' },
        { label: 'Design Teams', href: '#marketing-design', description: 'Creative team collaboration tools' },
        { label: 'Event Management', href: '#marketing-events', description: 'Complete event planning and execution' }
      ]
    },
    useCases: {
      title: 'USE CASES',
      items: [
        { label: 'Free Invoicing App', href: '#free-invoicing', description: 'Create professional invoices instantly' },
        { label: 'HR Management', href: '#hr-usecase', description: 'Employee management and workflows' },
        { label: 'Project Tracking', href: '#pm-usecase', description: 'Team collaboration and project tracking' },
        { label: 'Finance Suite', href: '#finance-invoice', description: 'Complete financial management suite' },
        { label: 'Freelance Tools', href: '#freelance-management', description: 'Tools for independent professionals' }
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

  const renderDropdownItems = (items: NavItem[], isMobile = false) => {
    if (isMobile) {
      return (
        <div className="space-y-1 py-1">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="group flex items-start px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg transition-all duration-200 mx-1"
              onClick={closeMenu}
            >
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 mt-1.5 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="group-hover:translate-x-1 transition-transform duration-200 font-medium text-white truncate">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-200 line-clamp-2">
                    {item.description}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      );
    }

    // Desktop layout - responsive grid columns
    const chunkSize = Math.min(Math.ceil(items.length / 3), 3);
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
                className="group flex items-start px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all duration-200 relative"
                onClick={closeMenu}
              >
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 mt-1.5 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="group-hover:translate-x-1 transition-transform duration-200 font-medium text-white truncate">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors duration-200 line-clamp-2">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderDesktopDropdown = (sectionKey: string) => {
    const section = navigationData[sectionKey];
    return (
      <div className="relative" key={sectionKey}>
        <button
          onClick={() => toggleDropdown(sectionKey)}
          onMouseEnter={() => setActiveDropdown(sectionKey)}
          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group relative ${
            activeDropdown === sectionKey ? 'text-white' : 'text-gray-300 hover:text-white'
          }`}
          aria-expanded={activeDropdown === sectionKey}
          aria-haspopup="true"
        >
          <span className="relative z-10">{section.title}</span>
          <ChevronDown className={`ml-2 h-3 w-3 transition-transform duration-200 ${
            activeDropdown === sectionKey ? 'rotate-180' : ''
          }`} />
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-200 ${
            activeDropdown === sectionKey ? 'w-full' : 'w-0 group-hover:w-full'
          }`}></div>
        </button>
        
        {activeDropdown === sectionKey && (
          <div 
            className="absolute top-full left-0 mt-1 w-[44rem] bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50"
            onMouseLeave={() => setActiveDropdown(null)}
            role="menu"
          >
            <div className="relative z-10 py-4">
              <div className="px-6 py-3 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/30 to-transparent">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  {section.title}
                </h3>
              </div>
              <div className="p-4 max-h-[32rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {renderDropdownItems(section.items)}
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
    
    return (
      <div key={sectionKey} className="border-b border-gray-800/20 last:border-b-0 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleDropdown(mobileKey)}
          className="flex items-center justify-between w-full px-4 py-4 text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg transition-all duration-200 group"
          aria-expanded={activeDropdown === mobileKey}
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
            <span className="truncate">{section.title}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
            activeDropdown === mobileKey ? 'rotate-180 text-blue-400' : 'text-gray-500'
          }`} />
        </button>
        
        {activeDropdown === mobileKey && (
          <div className="bg-gray-900/30 animate-in slide-in-from-top-2 duration-200">
            {renderDropdownItems(section.items, true)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className={`fixed w-full z-50 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95 shadow-[0_0_60px_#ffffff1a] border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'py-0' : 'py-1'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
        
        <div className="relative z-10 max-w-8xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="#" className="flex items-center group">
                <img src={logoImg} alt="Firmbee Logo" className="h-10 w-auto" />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:block" ref={dropdownRef}>
              <div className="flex items-center space-x-2">
                <a 
                  href="#about" 
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/30 rounded-lg relative group"
                >
                  ABOUT
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-200 w-0 group-hover:w-full"></div>
                </a>
                {Object.keys(navigationData).map(sectionKey => renderDesktopDropdown(sectionKey))}
                <a 
                  href="#contact" 
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/30 rounded-lg relative group"
                >
                  CONTACT
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-200 w-0 group-hover:w-full"></div>
                </a>
              </div>
            </div>

            {/* Desktop Actions & Social Links */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <a 
                  href="#login" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50"
                >
                  LOGIN
                </a>
                <a 
                  href="#join" 
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-100"
                >
                  JOIN FREE
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-1 px-3 py-1.5 bg-gray-900/30 rounded-full backdrop-blur-sm border border-gray-700/30">
                <a 
                  href="#linkedin" 
                  className="p-1.5 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-400/10 rounded-full group"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="#github" 
                  className="p-1.5 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/30 rounded-full group"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="#instagram" 
                  className="p-1.5 text-gray-400 hover:text-pink-400 transition-all duration-200 hover:bg-pink-400/10 rounded-full group"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          ></div>
          
          {/* Side Navigation */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800/30 bg-gray-900/50 sticky top-0 z-10">
              <div className="flex items-center">
                <img src={logoImg} alt="Firmbee Logo" className="h-8 w-auto" />
              </div>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded-lg transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Simple Links */}
              <div className="space-y-1">
                <a 
                  href="#about" 
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg transition-all duration-200 group"
                  onClick={closeMenu}
                >
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">ABOUT</span>
                </a>
                <a 
                  href="#contact" 
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg transition-all duration-200 group"
                  onClick={closeMenu}
                >
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">CONTACT</span>
                </a>
                <a 
                  href="#pricing" 
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg transition-all duration-200 group"
                  onClick={closeMenu}
                >
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors duration-200 flex-shrink-0"></div>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">PRICING</span>
                </a>
              </div>

              {/* Dropdown Sections */}
              <div className="space-y-1">
                {Object.keys(navigationData).map(sectionKey => renderMobileDropdown(sectionKey))}
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="sticky bottom-0 border-t border-gray-800/30 p-4 space-y-3 bg-gray-900/95 backdrop-blur-sm">
              <a 
                href="#login" 
                className="block px-4 py-3 text-base font-medium text-center text-gray-300 hover:text-white hover:bg-gray-800/40 rounded-lg border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200"
                onClick={closeMenu}
              >
                LOGIN
              </a>
              <a 
                href="#join" 
                className="block px-4 py-3 text-base font-semibold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                onClick={closeMenu}
              >
                JOIN FREE
              </a>

              {/* Social Links */}
              <div className="pt-4 border-t border-gray-800/20">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
                  Connect With Us
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <a 
                    href="#linkedin" 
                    className="p-2 text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-400/10 rounded-full"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    onClick={closeMenu}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="#github" 
                    className="p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/30 rounded-full"
                    title="GitHub"
                    aria-label="GitHub"
                    onClick={closeMenu}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="#instagram" 
                    className="p-2 text-gray-400 hover:text-pink-400 transition-all duration-200 hover:bg-pink-400/10 rounded-full"
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