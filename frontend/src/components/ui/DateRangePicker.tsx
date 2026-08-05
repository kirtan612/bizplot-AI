import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
  onRangeChange?: (start: string, end: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate = '',
  endDate = '',
  onRangeChange,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2 bg-surface border border-borderToken rounded-lg p-1.5", className)}>
      <div className="flex items-center gap-1.5 text-text-muted px-2">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">Date:</span>
      </div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onRangeChange?.(e.target.value, endDate)}
        className="bg-surface-elevated text-text-primary text-xs rounded border border-borderToken px-2 py-1 focus:outline-none focus:border-primary"
      />
      <span className="text-xs text-text-muted">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onRangeChange?.(startDate, e.target.value)}
        className="bg-surface-elevated text-text-primary text-xs rounded border border-borderToken px-2 py-1 focus:outline-none focus:border-primary"
      />
    </div>
  );
};
