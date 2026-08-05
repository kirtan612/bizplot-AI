import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

export interface DebouncedSearchProps {
  value?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

export const DebouncedSearch: React.FC<DebouncedSearchProps> = ({
  value: initialValue = '',
  onSearch,
  debounceMs = 300,
  placeholder = 'Search products, invoices, suppliers...',
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onSearch]);

  return (
    <Input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      leftIcon={<Search className="w-4 h-4" />}
      rightIcon={
        searchTerm ? (
          <button
            onClick={() => setSearchTerm('')}
            className="hover:text-text-primary transition-colors focus:outline-none"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : undefined
      }
      className={className}
    />
  );
};
