import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  benchmark?: number;
  change?: number;
  isForecast?: boolean;
  category?: string;
}

export type ColorTheme = 'cyan' | 'purple' | 'emerald' | 'amber' | 'silver' | 'rose' | 'forecast';

interface BusinessChartProps {
  data: DataPoint[];
  type?: 'area' | 'line' | 'bar' | 'waterfall' | 'forecast';
  colorTheme?: ColorTheme;
  height?: number;
  prefix?: string;
  suffix?: string;
  title?: string;
  subtitle?: string;
  highlightIndex?: number;
  className?: string;
}

export const BusinessChart: React.FC<BusinessChartProps> = ({
  data,
  type = 'area',
  height = 230,
  prefix = '₹',
  suffix = ' Cr',
  title,
  subtitle,
}) => {
  const { tokens: t } = useTheme();

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
        fontFamily: "'Inter', sans-serif",
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-lg"
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              {title}
            </h4>
          )}
          {subtitle && (
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={t.border} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }}
              axisLine={{ stroke: t.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 16,
                fontSize: 12,
                color: t.text,
                boxShadow: t.mode === 'light' ? '0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.4)',
                fontFamily: "'Inter', sans-serif",
              }}
              formatter={(val: any) => [`${prefix}${val}${suffix}`, 'Value']}
            />
            <Bar dataKey="value" fill={t.accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="bizChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={t.accent} stopOpacity={0.35} />
                <stop offset="95%" stopColor={t.accent} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={t.border} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }}
              axisLine={{ stroke: t.border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 16,
                fontSize: 12,
                color: t.text,
                boxShadow: t.mode === 'light' ? '0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.4)',
                fontFamily: "'Inter', sans-serif",
              }}
              formatter={(val: any) => [`${prefix}${val}${suffix}`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={t.accent}
              strokeWidth={2.6}
              fillOpacity={1}
              fill="url(#bizChartGradient)"
              dot={{ r: 3, fill: t.accent }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
