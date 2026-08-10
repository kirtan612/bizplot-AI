import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

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
  colorTheme = 'cyan',
  height = 240,
  prefix = '₹',
  suffix = ' Cr',
  title,
  subtitle,
  highlightIndex,
  className = '',
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(highlightIndex ?? null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxValue = Math.max(...data.flatMap((d) => [d.value, d.secondaryValue || 0, d.benchmark || 0])) * 1.18 || 1;
  const paddingX = 45;
  const paddingY = 35;
  const chartWidth = 720;
  const chartHeight = height;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Split historical vs forecast if type === 'forecast'
  const historicalPoints = points.filter((p) => !p.isForecast);
  const forecastPoints = points.filter((p, i) => p.isForecast || (i > 0 && points[i - 1]?.isForecast));

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const getThemeColors = (theme: ColorTheme) => {
    switch (theme) {
      case 'purple':
        return {
          stroke: '#CF9EFF',
          gradientStart: '#CF9EFF',
          gradientEnd: '#CF9EFF',
          fillOpacity: 0.12,
          barStart: '#CF9EFF',
          barEnd: '#7E22CE',
          activeDot: '#FFFFFF',
          glow: 'rgba(207, 158, 255, 0.2)',
        };
      case 'emerald':
        return {
          stroke: '#34D399',
          gradientStart: '#34D399',
          gradientEnd: '#34D399',
          fillOpacity: 0.12,
          barStart: '#34D399',
          barEnd: '#047857',
          activeDot: '#A7F3D0',
          glow: 'rgba(16, 185, 129, 0.2)',
        };
      case 'amber':
        return {
          stroke: '#FBBF24',
          gradientStart: '#FBBF24',
          gradientEnd: '#FBBF24',
          fillOpacity: 0.12,
          barStart: '#FBBF24',
          barEnd: '#B45309',
          activeDot: '#FEF08A',
          glow: 'rgba(245, 158, 11, 0.2)',
        };
      case 'rose':
        return {
          stroke: '#FB7185',
          gradientStart: '#FB7185',
          gradientEnd: '#FB7185',
          fillOpacity: 0.12,
          barStart: '#FB7185',
          barEnd: '#9F1239',
          activeDot: '#FECDD3',
          glow: 'rgba(244, 63, 94, 0.2)',
        };
      case 'forecast':
        return {
          stroke: '#818CF8',
          gradientStart: '#818CF8',
          gradientEnd: '#818CF8',
          fillOpacity: 0.12,
          barStart: '#818CF8',
          barEnd: '#3730A3',
          activeDot: '#C7D2FE',
          glow: 'rgba(99, 102, 241, 0.2)',
        };
      case 'silver':
        return {
          stroke: '#E2E8F0',
          gradientStart: '#FFFFFF',
          gradientEnd: '#FFFFFF',
          fillOpacity: 0.1,
          barStart: '#F1F5F9',
          barEnd: '#475569',
          activeDot: '#FFFFFF',
          glow: 'rgba(255, 255, 255, 0.15)',
        };
      case 'cyan':
      default:
        return {
          stroke: '#22D3EE',
          gradientStart: '#22D3EE',
          gradientEnd: '#22D3EE',
          fillOpacity: 0.12,
          barStart: '#22D3EE',
          barEnd: '#0991B1',
          activeDot: '#CFFAFE',
          glow: 'rgba(6, 182, 212, 0.2)',
        };
    }
  };

  const themeStyle = getThemeColors(colorTheme);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    const mouseY = ((e.clientY - rect.top) / rect.height) * chartHeight;
    setMousePos({ x: mouseX, y: mouseY });

    // Find closest index
    let minDistance = Infinity;
    let closestIndex = 0;

    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setActiveIdx(closestIndex);
  };

  const activePoint = activeIdx !== null ? points[activeIdx] : null;

  const defaultBgClass = className.includes('bg-') ? '' : 'bg-[#0D0B14]';
  const defaultBorderClass = className.includes('border-') ? '' : 'border border-[#252033]';

  return (
    <div
      ref={containerRef}
      className={`rounded-xl p-5 relative overflow-hidden group ${defaultBgClass} ${defaultBorderClass} ${className}`}
    >
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            {title && <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>}
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          {activePoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-right px-3 py-1.5 rounded-lg bg-[#151221] border border-[#2D263B] font-mono shadow-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  {activePoint.label} {activePoint.isForecast ? '(Forecast)' : ''}
                </span>
                {activePoint.change !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      activePoint.change >= 0 ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'
                    }`}
                  >
                    {activePoint.change >= 0 ? '+' : ''}
                    {activePoint.change}%
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-white block mt-0.5">
                {prefix}
                {activePoint.value.toLocaleString('en-IN')}
                {suffix}
              </span>
            </motion.div>
          )}
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setActiveIdx(highlightIndex ?? null);
            setMousePos(null);
          }}
        >
          <defs>
            <linearGradient id={`gradient-${colorTheme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeStyle.gradientStart} stopOpacity={themeStyle.fillOpacity} />
              <stop offset="100%" stopColor={themeStyle.gradientStart} stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id={`bar-gradient-${colorTheme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={themeStyle.barStart} stopOpacity="0.9" />
              <stop offset="100%" stopColor={themeStyle.barEnd} stopOpacity="0.4" />
            </linearGradient>

            <filter id={`glow-filter-${colorTheme}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingY + pct * (chartHeight - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#1A1A1A"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          {(type === 'area' || type === 'line' || type === 'forecast') && (
            <motion.path
              d={areaD}
              fill={`url(#gradient-${colorTheme})`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Main Line Path (Left-to-Right drawing animation) */}
          {(type === 'area' || type === 'line' || type === 'forecast') && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={themeStyle.stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#glow-filter-${colorTheme})`}
              strokeDasharray={type === 'forecast' ? '6 4' : undefined}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Vertical Guide Line crosshair following active point */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingY}
                x2={activePoint.x}
                y2={chartHeight - paddingY}
                stroke={themeStyle.stroke}
                strokeOpacity="0.5"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />
              <line
                x1={paddingX}
                y1={activePoint.y}
                x2={chartWidth - paddingX}
                y2={activePoint.y}
                stroke={themeStyle.stroke}
                strokeOpacity="0.2"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
            </g>
          )}

          {/* Bars representation if type === 'bar' or 'waterfall' */}
          {(type === 'bar' || type === 'waterfall') &&
            points.map((p, idx) => {
              const barWidth = Math.max(16, (chartWidth - paddingX * 2) / data.length - 16);
              const x = p.x - barWidth / 2;
              const barHeight = (p.value / maxValue) * (chartHeight - paddingY * 2);
              const y = chartHeight - paddingY - barHeight;
              const isHovered = activeIdx === idx;

              return (
                <g key={idx} onMouseEnter={() => setActiveIdx(idx)} className="cursor-pointer">
                  <motion.rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={isHovered ? themeStyle.activeDot : `url(#bar-gradient-${colorTheme})`}
                    stroke={isHovered ? themeStyle.stroke : 'transparent'}
                    strokeWidth={isHovered ? 2 : 0}
                    initial={{ height: 0, y: chartHeight - paddingY }}
                    whileInView={{ height: barHeight, y }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill={isHovered ? '#FFFFFF' : '#888888'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

          {/* Interactive Dots for line/area */}
          {(type === 'area' || type === 'line' || type === 'forecast') &&
            points.map((p, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <g key={idx} onMouseEnter={() => setActiveIdx(idx)} className="cursor-pointer">
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 7 : 4.5}
                    fill={isSelected ? themeStyle.activeDot : '#080808'}
                    stroke={themeStyle.stroke}
                    strokeWidth={isSelected ? 3.5 : 2}
                    filter={isSelected ? `url(#glow-filter-${colorTheme})` : undefined}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.2 }}
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#737373'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
};

