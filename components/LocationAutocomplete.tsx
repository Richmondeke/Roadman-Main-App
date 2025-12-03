import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRPORTS, Airport } from '../data/airports';
import { searchLocations } from '../services/duffelService';

interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize query if value provided externally changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced Search Effect
  useEffect(() => {
    // 1. If query is empty, show default Popular list instantly
    if (query.trim().length === 0) {
        setResults(AIRPORTS.slice(0, 5));
        return;
    }

    // 2. If query matches selection exactly (likely just clicked), don't re-search immediately unless typing
    // Actually, we usually want to search if user is typing.
    // We'll rely on the 300ms debounce.

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
        try {
            // Call API
            const locations = await searchLocations(query);
            setResults(locations);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, 400); // 400ms debounce

    return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    setQuery(airport.code);
    onChange(airport.code);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
      setIsOpen(true);
      if (query.trim().length === 0) {
        setResults(AIRPORTS.slice(0, 5));
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.toUpperCase();
      setQuery(val);
      onChange(val); // Update parent immediately with raw text so they can type freely
      setIsOpen(true);
  };

  return (
    <div className={`flex flex-col gap-1 w-full relative ${className}`} ref={containerRef}>
      <label className="text-sm font-semibold text-gray-300 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm uppercase font-semibold tracking-wide"
            value={query}
            onChange={handleChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            maxLength={30}
        />
        {/* Loading / Icon Indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {isLoading ? (
                <svg className="animate-spin w-5 h-5 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            ) : value.length === 3 && results.some(a => a.code === value) ? (
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {results.length === 0 && !isLoading ? (
                <div className="p-4 text-gray-500 text-center text-sm">No locations found</div>
            ) : (
                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                {results.map((airport) => (
                    <li
                    key={airport.code + airport.name}
                    onClick={() => handleSelect(airport)}
                    className="p-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center border-b border-slate-700/50 last:border-0 group"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-white font-bold text-sm truncate max-w-[200px]">{airport.city || airport.name}</span>
                            <span className="text-gray-400 text-xs truncate max-w-[200px]">{airport.name} {airport.country ? `, ${airport.country}` : ''}</span>
                        </div>
                        <span className="bg-slate-900 text-brand-400 font-mono font-bold px-2 py-1 rounded text-xs group-hover:bg-brand-900 group-hover:text-brand-300 transition-colors shrink-0">
                            {airport.code}
                        </span>
                    </li>
                ))}
                </ul>
            )}
             <div className="bg-slate-900 p-2 text-center text-xs text-gray-500 border-t border-slate-700">
                {query.length < 2 ? 'Type to search global airports' : 'Search results provided by Duffel'}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};