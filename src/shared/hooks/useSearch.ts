/**
 * Search Hook
 * Manages search state with URL sync and debouncing
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useDebounce } from './useDebounce';

interface UseSearchOptions {
  paramName?: string;
  debounceMs?: number;
  syncToUrl?: boolean;
}

interface UseSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    paramName = 'search',
    debounceMs = 300,
    syncToUrl = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL if syncing
  const initialSearch = syncToUrl ? searchParams.get(paramName) ?? '' : '';
  const [searchTerm, setSearchTermState] = useState(initialSearch);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Track if we're in a searching state (input changed but not debounced yet)
  const isSearching = searchTerm !== debouncedSearchTerm;

  // Update URL when debounced search changes
  useEffect(() => {
    if (!syncToUrl) return;

    const currentSearch = searchParams.get(paramName) ?? '';
    if (debouncedSearchTerm !== currentSearch) {
      const newParams = new URLSearchParams(searchParams);

      if (debouncedSearchTerm) {
        newParams.set(paramName, debouncedSearchTerm);
        // Reset page when searching
        newParams.set('page', '1');
      } else {
        newParams.delete(paramName);
      }

      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedSearchTerm, paramName, searchParams, setSearchParams, syncToUrl]);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTermState('');
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
  };
}
