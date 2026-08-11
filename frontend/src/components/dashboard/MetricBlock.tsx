import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { KPIMetric } from '../../mock/dashboardData';

interface MetricBlockProps {
  metric: KPIMetric;
}

export const MetricBlock: React.FC<MetricBlockProps> = ({ metric }) => {
  const isPositive = metric.change >= 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate">
        {metric.label}
      </span>

      <div className="my-2 flex items-baseline space-x-1">
        {metric.prefix && (
          <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400 font-mono">
            {metric.prefix}
          </span>
        )}
        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
          {metric.value}
        </span>
        {metric.suffix && (
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 font-mono">
            {metric.suffix}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] font-mono">
        <span
          className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[10px] ${isPositive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/50'
            }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
          )}
          {isPositive ? '+' : ''}
          {metric.change}%
        </span>
        <span className="text-slate-400 dark:text-zinc-500 truncate">{metric.periodComparison}</span>
      </div>
    </div>
  );
};
