import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'table' | 'chart';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const baseStyles = "bg-surface-elevated animate-pulse rounded-md";

  if (variant === 'circular') {
    return <div className={cn(baseStyles, "rounded-full w-10 h-10", className)} {...props} />;
  }

  if (variant === 'text') {
    return <div className={cn(baseStyles, "h-4 w-full rounded", className)} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={cn("p-5 border border-borderToken rounded-xl bg-surface space-y-4", className)}>
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-1/3 h-5" />
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
        <Skeleton variant="text" className="w-2/3 h-8" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("w-full border border-borderToken rounded-xl bg-surface p-4 space-y-3", className)}>
        <div className="flex gap-4 pb-3 border-b border-borderToken">
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton variant="text" className="w-1/4 h-4" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            <Skeleton variant="text" className="w-1/4 h-4" />
            <Skeleton variant="text" className="w-1/4 h-4" />
            <Skeleton variant="text" className="w-1/4 h-4" />
            <Skeleton variant="text" className="w-1/4 h-4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn("w-full border border-borderToken rounded-xl bg-surface p-5 space-y-4", className)}>
        <Skeleton variant="text" className="w-1/4 h-5" />
        <div className="flex items-end gap-3 h-48 pt-4">
          {[40, 75, 55, 90, 65, 80, 45, 95].map((heightPct, idx) => (
            <div
              key={idx}
              className="flex-1 bg-surface-elevated animate-pulse rounded-t-sm"
              style={{ height: `${heightPct}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <div className={cn(baseStyles, className)} {...props} />;
};
