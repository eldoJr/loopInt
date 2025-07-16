import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
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
  searchData?: Array<Record<string, unknown>>;
  searchKeys?: string[];
  onResultSelect?: (result: Record<string, unknown>) => void;
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

  const handleResultSelect = (result: Record<string, unknown>) => {
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
          className={`relative flex items-center bg-white dark:bg-gray-800/30 border rounded-lg transition-all duration-200 ${
            isFocused 
              ? 'border-blue-500 dark:border-blue-500 bg-blue-50/50 dark:bg-gray-800/50 shadow-lg shadow-blue-500/10' 
              : 'border-gray-300 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600/50'
          }`}
          whileFocus={{ scale: 1.01 }}
        >
          <div className="pl-2.5 pr-1.5">
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
            )}
          </div>

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
              setTimeout(() => {
                setShowSearchResults(false);
                setSelectedIndex(-1);
              }, 150);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 py-2 px-2 focus:outline-none text-sm"
          />

          {showCommandHint && !isFocused && !searchValue && (
            <div className="hidden sm:flex items-center space-x-1 px-2 text-xs text-gray-500 dark:text-gray-500">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}

          {searchValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="p-1 mx-1 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}

          {filters.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 mx-1 rounded transition-colors ${
                selectedFilters.length > 0 || showFilters
                  ? 'text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10'
                  : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
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

      <AnimatePresence>
        {showFilters && filters.length > 0 && (
          <motion.div
            ref={filtersRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-[9999]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-3">Filters</h3>
              <div className="space-y-2">
                {filters.map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(filter.id)}
                        onChange={() => toggleFilter(filter.id)}
                        className="w-4 h-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-300">{filter.label}</span>
                    </div>
                    {filter.count !== undefined && (
                      <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {filter.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearchResults && searchResults.length > 0 && (
          <motion.div
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {searchResults.slice(0, maxResults).map((result, index) => (
                <button
                  key={String(result.item.id) || `result-${index}`}
                  onClick={() => handleResultSelect(result.item)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {String(result.item.name || result.item.title || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                        {(() => {
                          const name = result.item.name as string | undefined;
                          const title = result.item.title as string | undefined;
                          return name || title || 'Untitled';
                        })()}
                      </p>
                      {(() => {
                        const description = result.item.description as string | undefined;
                        return description ? (
                          <p className="text-xs text-gray-400 truncate">
                            {description}
                          </p>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;