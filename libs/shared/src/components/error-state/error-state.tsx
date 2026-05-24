import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../button/button';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>

      <p className="text-gray-600 mb-6 max-w-md">
        {error ||
          'We encountered an error while loading the task details. Please try again.'}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  );
};
