import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  loading = false
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
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
          whileFocusWithin={{ scale: 1.02 }}
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
    </div>
  );
};

export default SearchBar;