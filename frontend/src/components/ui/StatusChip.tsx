import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';

export interface StatusChipProps {
  type: 'reorder_flag' | 'payment_status';
  value: boolean | string;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ type, value, className }) => {
  if (type === 'reorder_flag') {
    const isReorder = Boolean(value);
    if (isReorder) {
      return (
        <Badge
          variant="warning"
          icon={<AlertTriangle className="w-3 h-3 text-status-warning animate-pulse" />}
          className={className}
        >
          Reorder Alert
        </Badge>
      );
    }
    return (
      <Badge
        variant="neutral"
        icon={<CheckCircle2 className="w-3 h-3 text-zinc-400" />}
        className={className}
      >
        Optimal Stock
      </Badge>
    );
  }

  if (type === 'payment_status') {
    const statusStr = String(value).toLowerCase();
    if (statusStr === 'paid') {
      return (
        <Badge
          variant="success"
          icon={<CheckCircle2 className="w-3 h-3" />}
          className={className}
        >
          Paid
        </Badge>
      );
    }
    if (statusStr === 'pending') {
      return (
        <Badge
          variant="warning"
          icon={<Clock className="w-3 h-3" />}
          className={className}
        >
          Pending
        </Badge>
      );
    }
    if (statusStr === 'overdue') {
      return (
        <Badge
          variant="danger"
          icon={<AlertCircle className="w-3 h-3" />}
          className={className}
        >
          Overdue
        </Badge>
      );
    }

    return <Badge variant="neutral" className={className}>{String(value)}</Badge>;
  }

  return null;
};
