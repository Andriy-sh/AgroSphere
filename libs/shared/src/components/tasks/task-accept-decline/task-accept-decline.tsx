import React from 'react';
import { X, Check } from 'lucide-react';

interface TaskAcceptDeclineProps {
  onAccept: () => void;
  onDecline: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskAcceptDecline: React.FC<TaskAcceptDeclineProps> = ({
  onAccept,
  onDecline,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      <button
        className={`rounded-md bg-basic-gray-light p-1 hover:bg-gray-200 shadow-[0_-1px_0_rgba(228,229,235,255)] ${sizeClasses[size]}`}
        onClick={onDecline}
      >
        <X size={iconSizes[size]} />
      </button>
      <button
        className={`rounded-md bg-basic-green p-1 hover:bg-basic-green-dark ${sizeClasses[size]} shadow-[0_-1px_0_rgba(127,211,149,255)]`}
        onClick={onAccept}
      >
        <Check size={iconSizes[size]} className="text-white" />
      </button>
    </div>
  );
};
