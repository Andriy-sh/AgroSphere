import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'vertical',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: orientation === 'vertical' ? 'h-4' : 'w-4',
    md: orientation === 'vertical' ? 'h-6' : 'w-6',
    lg: orientation === 'vertical' ? 'h-8' : 'w-8',
  };

  const baseClasses =
    orientation === 'vertical' ? 'w-px bg-basic-white' : 'h-px bg-basic-white';

  return <div className={`${baseClasses} ${sizeClasses[size]} ${className}`} />;
};
