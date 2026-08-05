import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "There are no entries matching your filter criteria or query.",
  icon,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-xl bg-surface border border-borderToken", className)}>
      <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-text-muted mb-3 border border-borderToken">
        {icon || <PackageOpen className="w-6 h-6 text-primary" />}
      </div>
      <h4 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h4>
      <p className="text-sm text-text-secondary max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
