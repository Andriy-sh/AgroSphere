'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SearchResult {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

interface MapSearchBarProps {
  accessToken: string;
  onSearchResult: (result: SearchResult) => void;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  accessToken,
  onSearchResult,
  placeholder = 'Find address or places...',
  initialValue,
  value,
  onValueChange,
}) => {
  const [internalQuery, setInternalQuery] = useState(initialValue ?? '');
  const query = value !== undefined ? value : internalQuery;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPlaces = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || !accessToken) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${accessToken}&types=place,address,poi&limit=5`
        );
        const data = await response.json();
        setResults(data.features || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchPlaces(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchPlaces]);

  useEffect(() => {
    if (initialValue !== undefined) {
      setInternalQuery(initialValue);
    }
  }, [initialValue]);

  const handleResultClick = (result: SearchResult) => {
    onSearchResult(result);
    if (onValueChange) {
      onValueChange(result.place_name);
    } else {
      setInternalQuery(result.place_name);
    }
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            if (onValueChange) {
              onValueChange(e.target.value);
            } else {
              setInternalQuery(e.target.value);
            }
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 h-9 bg-white rounded-lg border border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900 truncate">
                {result.place_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

