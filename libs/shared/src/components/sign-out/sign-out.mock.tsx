'use client';
import React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

type LogoutButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  iconSize?: number;
  className?: string;
};

export function LogoutButton({
  iconSize = 24,
  className,
  ...props
}: LogoutButtonProps) {
  const handleSignOut = () => {
    console.log('Mock signOut called in Storybook');
    alert('Mock sign out triggered');
  };

  return (
    <button
      onClick={handleSignOut}
      className={cn(
        'p-2 rounded-md flex items-center justify-center',
        'text-gray-500 dark:text-gray-400 hover:text-gray-700',
        'transition-colors duration-200 ease-in-out',
        className
      )}
      aria-label="Logout"
      {...props}
    >
      <LogOut size={iconSize} />
    </button>
  );
}
