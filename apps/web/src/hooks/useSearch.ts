import { useMemo, useState } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  keys: string[];
  threshold?: number;
}

export const useSearch = <T>({ data, keys }: UseSearchOptions<T>) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return data.map(item => ({ item }));
    }

    const searchTerm = query.toLowerCase();
    return data
      .filter(item => {
        return keys.some(key => {
          const value = (item as Record<string, unknown>)[key];
          if (Array.isArray(value)) {
            return value.some(v =>
              String(v).toLowerCase().includes(searchTerm)
            );
          }
          return String(value || '')
            .toLowerCase()
            .includes(searchTerm);
        });
      })
      .map(item => ({ item }));
  }, [data, keys, query]);

  return {
    query,
    setQuery,
    results,
    hasQuery: query.trim().length > 0,
  };
};

export default useSearch;
