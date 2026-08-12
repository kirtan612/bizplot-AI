import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  change?: number;
}

export type ColorTheme = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';

interface LandingChartProps {
  data: DataPoint[];
  type?: 'area' | 'line' | 'bar';
  colorTheme?: ColorTheme;
  height?: number;
  prefix?: string;
  suffix?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  isDark?: boolean;
}

export const LandingChart: React.FC<LandingChartProps> = ({
  data,
  type = 'area',
  colorTheme = 'purple',
  height = 230,
  prefix = '₹',
  suffix = ' Cr',
  title,
  subtitle,
  className = '',
  isDark = false,
}) => {
  const themeColors: Record<ColorTheme, string> = {
    purple: '#9B7EDE',
    cyan: '#38BDF8',
    emerald: '#1E8F72',
    amber: '#E0A84B',
    rose: '#F43F5E',
  };

  const accentColor = themeColors[colorTheme] || themeColors.purple;

  const bg = isDark ? '#16141D' : '#FFFFFF';
  const border = isDark ? '#262232' : '#EAE6F1';
  const titleColor = isDark ? '#F3F1F7' : '#1C1A22';
  const subColor = isDark ? '#9D99A8' : '#6F6C79';
  const faintColor = isDark ? '#615D6C' : '#A7A3B0';
  const gridColor = isDark ? '#23202E' : '#EFECF6';

  const gradientId = `landingGradient-${colorTheme}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 28,
        padding: 24,
        fontFamily: "'Inter', sans-serif",
        boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.4)' : '0 8px 28px rgba(0,0,0,0.04)',
      }}
      className={`transition-all duration-200 ${className}`}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 18 }}>
          {title && (
            <h4
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                color: titleColor,
                fontFamily: "'Manrope', sans-serif",
                letterSpacing: '-0.3px',
              }}
            >
              {title}
            </h4>
          )}
          {subtitle && (
            <p
              style={{
                margin: '3px 0 0',
                fontSize: 12.5,
                color: subColor,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11.5, fill: subColor, fontFamily: 'Inter' }}
              axisLine={{ stroke: border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11.5, fill: faintColor, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                fontSize: 12,
                color: titleColor,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                fontFamily: "'Inter', sans-serif",
              }}
              formatter={(val: any) => [`${prefix}${val}${suffix}`, 'Value']}
            />
            <Bar dataKey="value" fill={accentColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11.5, fill: subColor, fontFamily: 'Inter' }}
              axisLine={{ stroke: border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11.5, fill: faintColor, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                fontSize: 12,
                color: titleColor,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                fontFamily: "'Inter', sans-serif",
              }}
              formatter={(val: any) => [`${prefix}${val}${suffix}`, 'Value']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={accentColor}
              strokeWidth={2.8}
              dot={{ r: 4, fill: accentColor, stroke: bg, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: accentColor }}
            />
          </LineChart>
        ) : (
          <AreaChart data={data} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accentColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={accentColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11.5, fill: subColor, fontFamily: 'Inter' }}
              axisLine={{ stroke: border }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11.5, fill: faintColor, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                fontSize: 12,
                color: titleColor,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                fontFamily: "'Inter', sans-serif",
              }}
              formatter={(val: any) => [`${prefix}${val}${suffix}`, 'Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accentColor}
              strokeWidth={2.8}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={{ r: 4, fill: accentColor, stroke: bg, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: accentColor }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
