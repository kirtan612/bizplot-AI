import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "An error occurred while fetching information from the server.",
  onRetry,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-xl bg-status-danger/5 border border-status-danger/20", className)}>
      <div className="w-12 h-12 rounded-full bg-status-danger/10 flex items-center justify-center text-status-danger mb-3 border border-status-danger/20">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h4>
      <p className="text-sm text-text-secondary max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Retry Request
        </Button>
      )}
    </div>
  );
};
