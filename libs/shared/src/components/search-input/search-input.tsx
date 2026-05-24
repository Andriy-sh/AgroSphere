'use client';

import React, { useRef, useEffect } from 'react';
import { Input } from '../input/input';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  isActive: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  bottomBorder?: boolean;
  closeButton?: boolean;
  iconSize?: number;
  clearOnClose?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  isActive,
  searchTerm,
  onSearchChange,
  onClose,
  onKeyDown,
  className,
  placeholder = 'Search...',
  inputClassName,
  bottomBorder = true,
  closeButton = true,
  iconSize = 20,
  clearOnClose = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isActive &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, onClose]);

  const handleCloseClick = () => {
    onClose();
    if (clearOnClose) {
      onSearchChange({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className={`flex items-center bg-white first-line:search-overlay-active  ${className}`}
    >
      <Input
        className={`relative flex-1 py-1 shadow-none overflow-hidden border-none ${inputClassName}`}
      >
        <Input.Content
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          className="pl-10 pr-10  bg-white w-full border-none focus:ring-0 peer"
        />
        {bottomBorder && (
          <div className="absolute bottom-0 left-1/2 h-[2px] w-full bg-basic-green transition-transform duration-300 ease-out transform -translate-x-1/2 scale-x-0 peer-focus:scale-x-100"></div>
        )}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          <Search size={iconSize} className="text-gray-400" />
        </div>
        {closeButton && (
          <button
            onClick={handleCloseClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-basic-gray hover:text-basic-green focus:border-basic-green rounded-full"
            aria-label="Close Search"
          >
            <X size={iconSize} />
          </button>
        )}
      </Input>
    </div>
  );
};
