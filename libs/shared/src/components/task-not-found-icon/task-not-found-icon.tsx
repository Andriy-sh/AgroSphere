import React from 'react';
import { cn } from '../../utils/cn';

interface TaskNotFoundIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const TaskNotFoundIcon: React.FC<TaskNotFoundIconProps> = ({
  className,
  ...props
}) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-24 h-24', className)}
      {...props}
    >
      <circle cx="60" cy="60" r="60" fill="#F3F4F6" />
      <path
        d="M40 40H80V80H40V40Z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 50H70"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 60H70"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 70H60"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="60" r="8" fill="#9CA3AF" />
      <path
        d="M56 60L58 62L64 56"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
