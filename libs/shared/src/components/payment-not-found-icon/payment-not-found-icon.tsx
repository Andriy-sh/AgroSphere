import React from 'react';
import { cn } from '../../utils/cn';

interface PaymentNotFoundIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const PaymentNotFoundIcon: React.FC<PaymentNotFoundIconProps> = ({
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
      <rect x="30" y="40" width="60" height="40" rx="4" fill="#9CA3AF" />
      <rect x="40" y="50" width="40" height="4" rx="2" fill="white" />
      <rect x="40" y="60" width="30" height="4" rx="2" fill="white" />
      <circle cx="60" cy="60" r="8" fill="#EF4444" />
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
