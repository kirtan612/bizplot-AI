import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { cn } from '@/utils/cn';

export interface ChartDataPoint {
  [key: string]: any;
}

export interface ChartProps {
  data: ChartDataPoint[];
  xAxisKey: string;
  dataKeys: { key: string; name: string; color?: string }[];
  title?: string;
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = ['#7C3AED', '#A855F7', '#C084FC', '#22C55E', '#F59E0B', '#3B82F6'];

// Custom Recharts Dark Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-elevated/95 border border-borderToken rounded-lg p-3 shadow-xl glass-panel text-xs space-y-1 select-none">
        <p className="font-semibold text-text-primary mb-1 border-b border-borderToken pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}:</span>
            <strong className="text-text-primary font-mono">{entry.value.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const LineChartWrapper: React.FC<ChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  title,
  height = 280,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full bg-surface border border-borderToken rounded-xl p-5 shadow-card", className)}
    >
      {title && (
        <h4 className="text-sm font-semibold text-text-primary mb-4">
          {title}
        </h4>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xAxisKey} stroke="#71717A" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#A1A1AA' }} />
            {dataKeys.map((dk, idx) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export const BarChartWrapper: React.FC<ChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  title,
  height = 280,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full bg-surface border border-borderToken rounded-xl p-5 shadow-card", className)}
    >
      {title && (
        <h4 className="text-sm font-semibold text-text-primary mb-4">
          {title}
        </h4>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xAxisKey} stroke="#71717A" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#A1A1AA' }} />
            {dataKeys.map((dk, idx) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.name}
                fill={dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export const AreaChartWrapper: React.FC<ChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  title,
  height = 280,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full bg-surface border border-borderToken rounded-xl p-5 shadow-card", className)}
    >
      {title && (
        <h4 className="text-sm font-semibold text-text-primary mb-4">
          {title}
        </h4>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {dataKeys.map((dk, idx) => {
                const color = dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
                return (
                  <linearGradient key={dk.key} id={`color-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xAxisKey} stroke="#71717A" fontSize={11} tickLine={false} />
            <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#A1A1AA' }} />
            {dataKeys.map((dk, idx) => {
              const color = dk.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
              return (
                <Area
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  name={dk.name}
                  stroke={color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#color-${dk.key})`}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
