import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

export interface MetricProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  change?: number;
  changeLabel?: string;
  status?: 'healthy' | 'warning' | 'risk' | 'neutral';
  statusText?: string;
  subtitle?: string;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  prefix = '₹',
  suffix = '',
  decimals = 2,
  change,
  changeLabel,
  status,
  statusText,
  subtitle,
  className = '',
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={`p-5 rounded-xl bg-[#0F0F0F] border border-[#222222] hover:border-[#333333] transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">{label}</span>
        {statusText && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              status === 'healthy'
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                : status === 'warning'
                ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                : status === 'risk'
                ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
          >
            {statusText}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 my-1">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
        />
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1A1A1A]">
        {change !== undefined ? (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span
              className={`text-xs font-mono font-medium ${
                isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-neutral-400'
              }`}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
            {changeLabel && <span className="text-[11px] text-neutral-500">{changeLabel}</span>}
          </div>
        ) : (
          <span className="text-xs text-neutral-500">{subtitle || 'Live telemetry'}</span>
        )}
      </div>
    </div>
  );
};
