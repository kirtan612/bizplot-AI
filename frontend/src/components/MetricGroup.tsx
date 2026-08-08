import React from 'react';
import { Metric } from './Metric';
import type { MetricProps } from './Metric';

interface MetricGroupProps {
  metrics: MetricProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const MetricGroup: React.FC<MetricGroupProps> = ({
  metrics,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {metrics.map((metric, idx) => (
        <Metric key={idx} {...metric} />
      ))}
    </div>
  );
};
