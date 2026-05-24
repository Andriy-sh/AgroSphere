'use client';

import React, { useState } from 'react';
import { StatusIndicator } from '../status-indicator/status-indicator';

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: 'pending' | 'in_progress' | 'completed') => void;
  className?: string;
}

const STATUS_OPTIONS = [
  {
    value: 'pending' as const,
    label: 'Not started',
    icon: 'hourglass_bottom',
    color: 'text-basic-yellow',
  },
  {
    value: 'in_progress' as const,
    label: 'In progress',
    icon: 'timelapse',
    color: 'text-basic-blue',
  },
  {
    value: 'completed' as const,
    label: 'Completed',
    icon: 'task_alt',
    color: 'text-basic-green',
  },
];

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  className = '',
}: StatusDropdownProps) {
  const [isHovered, setIsHovered] = useState(false);

  const currentStatusOption =
    STATUS_OPTIONS.find((option) => option.value === currentStatus) ||
    STATUS_OPTIONS[0];

  const handleStatusClick = (
    status: 'pending' | 'in_progress' | 'completed'
  ) => {
    onStatusChange(status);
    setIsHovered(false);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cursor-pointer">
        <StatusIndicator
          status={currentStatus as any}
          showTooltip={false}
          className="hover:opacity-80 transition-opacity"
        />
      </div>

      {isHovered && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="py-1">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusClick(option.value)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                  currentStatus === option.value ? 'bg-gray-50' : ''
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${option.color}`}
                >
                  {option.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                {currentStatus === option.value && (
                  <span className="material-symbols-outlined text-basic-blue text-sm ml-auto">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
