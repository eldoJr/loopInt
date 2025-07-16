import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Command, ArrowUp, ArrowDown, Enter, FolderOpen, CheckSquare, Users, Calendar, BarChart3, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type?: string;
  action?: () => void;
}

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  filters?: FilterOption[];
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  showCommandHint?: boolean;
  loading?: boolean;
  searchData?: any[];
  searchKeys?: string[];
  onResultSelect?: (result: any) => void;
  showResults?: boolean;
  maxResults?: number;
}

const SearchBar = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  filters = [],
  selectedFilters = [],
  onFilterChange,
  showCommandHint = false,
  loading = false,
  searchData = [],
  searchKeys = ['name', 'title'],
  onResultSelect,
  showResults = false,
  maxResults = 5
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { results: searchResults } = useSearch({
    data: searchData,
    keys: searchKeys,
    threshold: 0.3
  });

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchValue && showResults && searchData.length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
    setSelectedIndex(-1);
  }, [searchValue, showResults, searchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    const visibleResults = searchResults.slice(0, maxResults);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < visibleResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : visibleResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < visibleResults.length) {
          handleResultSelect(visibleResults[selectedIndex].item);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultSelect = (result: any) => {
    onResultSelect?.(result);
    setShowSearchResults(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onChange?.("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange?.(newFilters);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`relative flex items-center bg-gray-800/30 border rounded-lg transition-all duration-200 ${
            isFocused 
              ? 'border-blue-500 bg-gray-800/50 shadow-lg shadow-blue-500/10' 
              : 'border-gray-700/50 hover:border-gray-600/50'
          }`}
          whileFocus={{ scale: 1.02 }}
        >
          {/* Search Icon */}
          <div className="pl-3 pr-2">
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (searchValue && showResults && searchData.length > 0) {
                setShowSearchResults(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay hiding results to allow for clicks
              setTimeout(() => {
                setShowSearchResults(false);
                setSelectedIndex(-1);
              }, 150);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-300 placeholder-gray-500 py-3 px-2 focus:outline-none"
          />

          {/* Command Hint */}
          {showCommandHint && !isFocused && !searchValue && (
            <div className="hidden sm:flex items-center space-x-1 px-2 text-xs text-gray-500">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}

          {/* Clear Button */}
          {searchValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="p-1 mx-1 text-gray-400 hover:text-gray-300 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          {/* Filter Button */}
          {filters.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 mx-1 rounded transition-colors ${
                selectedFilters.length > 0 || showFilters
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
              }`}
            >
              <Filter className="w-4 h-4" />
              {selectedFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          )}
        </motion.div>
      </form>

      {/* Filters Dropdown */}
      <AnimatePresence>
        {showFilters && filters.length > 0 && (
          <motion.div
            ref={filtersRef}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Filters</h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(filter.id)}
                        onChange={() => toggleFilter(filter.id)}
                        className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">{filter.label}</span>
                    </div>
                    {filter.count !== undefined && (
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        {filter.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              
              {selectedFilters.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => onFilterChange?.([])}
                    className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showSearchResults && searchResults.length > 0 && (
          <motion.div
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 mb-2">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
              {searchResults.slice(0, maxResults).map((result, index) => {
                const item = result.item;
                const isSelected = index === selectedIndex;
                
                const getTypeIcon = (type: string) => {
                  switch (type) {
                    case 'project': return <FolderOpen className="w-4 h-4 text-blue-400" />;
                    case 'task': return <CheckSquare className="w-4 h-4 text-green-400" />;
                    case 'team': return <Users className="w-4 h-4 text-purple-400" />;
                    case 'page': return getPageIcon(item.section || '');
                    default: return <Search className="w-4 h-4 text-gray-400" />;
                  }
                };
                
                const getPageIcon = (section: string) => {
                  switch (section) {
                    case 'Dashboard': return <Home className="w-4 h-4 text-orange-400" />;
                    case 'Projects': return <FolderOpen className="w-4 h-4 text-blue-400" />;
                    case 'Tasks': return <CheckSquare className="w-4 h-4 text-green-400" />;
                    case 'Team': return <Users className="w-4 h-4 text-purple-400" />;
                    case 'Calendar': return <Calendar className="w-4 h-4 text-red-400" />;
                    case 'Analytics': return <BarChart3 className="w-4 h-4 text-yellow-400" />;
                    default: return <Search className="w-4 h-4 text-gray-400" />;
                  }
                };
                
                return (
                  <div
                    key={item.id || index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'hover:bg-gray-800/50 border border-transparent'
                    }`}
                    onClick={() => handleResultSelect(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getTypeIcon(item.type || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-300 truncate">
                            {item.name || item.title}
                          </div>
                          {(item.description || item.subtitle) && (
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {item.description || item.subtitle}
                            </div>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="text-xs text-blue-400 capitalize">
                              {item.type}
                            </div>
                            {item.section && item.section !== item.type && (
                              <>
                                <span className="text-xs text-gray-600">•</span>
                                <div className="text-xs text-gray-500">
                                  {item.section}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
                          <Enter className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {searchResults.length > maxResults && (
                <div className="text-xs text-gray-500 px-2 py-2 border-t border-gray-800 mt-2">
                  +{searchResults.length - maxResults} more results
                </div>
              )}
              
              <div className="text-xs text-gray-600 px-2 py-2 border-t border-gray-800 mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <ArrowUp className="w-3 h-3" />
                    <ArrowDown className="w-3 h-3" />
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Enter className="w-3 h-3" />
                    <span>Select</span>
                  </span>
                </div>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;