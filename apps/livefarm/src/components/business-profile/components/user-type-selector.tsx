'use client';

import React from 'react';
import { Button, Icon, Radio } from '@@agrosphere/shared';
import type { UserType } from '../types/form';

interface UserTypeSelectorProps {
  userType: UserType;
  onUserTypeChange: (value: UserType) => void;
  error?: string;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  userType,
  onUserTypeChange,
  error,
}) => {
  const options = [
    {
      value: 'farmer' as const,
      label: "I'm a farmer",
      icon: 'psychiatry',
    },
    {
      value: 'agri-business' as const,
      label: "I'm an agri-business",
      icon: 'home_work',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900 mb-3">
        Please select your account type
      </div>
      <div className="flex gap-2">
        {options.map((option) => {
          const isSelected = userType === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              variant="ghost"
              onClick={() => onUserTypeChange(option.value)}
              className={`flex-1 flex items-center text-start p-2 rounded-lg border-2 transition-all duration-200 h-auto ${
                isSelected
                  ? 'border-basic-green bg-white'
                  : 'border-basic-gray-light bg-white hover:border-basic-green hover:shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-basic-green-light">
                <Icon
                  icon={option.icon}
                  size="sm"
                  className="text-basic-green font-normal !cursor-default pointer-events-none"
                />
              </div>

              <span className="flex-1 text-sm text-basic-black font-medium">
                {option.label}
              </span>
              <Radio
                name="userType"
                options={[{ value: option.value, label: '' }]}
                value={isSelected ? option.value : ''}
                onChange={() => onUserTypeChange(option.value)}
                className="!mb-0"
              />
            </Button>
          );
        })}
      </div>
      {error && <div className="text-basic-red text-xs mt-1">{error}</div>}
    </div>
  );
};
