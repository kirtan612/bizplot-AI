import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  benchmark?: number;
}

interface BusinessChartProps {
  data: DataPoint[];
  type?: 'area' | 'line' | 'bar' | 'waterfall';
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
  height = 240,
  prefix = '₹',
  suffix = ' Cr',
  title,
  subtitle,
  highlightIndex,
  className = '',
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(highlightIndex ?? null);

  const maxValue = Math.max(...data.flatMap((d) => [d.value, d.secondaryValue || 0, d.benchmark || 0])) * 1.15 || 1;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 700;
  const chartHeight = height;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // SVG path for line/area
  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className={`rounded-xl bg-[#0C0C0C] border border-[#1E1E1E] p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h4 className="text-sm font-semibold text-white tracking-wide">{title}</h4>}
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          {activeIdx !== null && data[activeIdx] && (
            <div className="text-right">
              <span className="text-[11px] text-neutral-500 uppercase font-mono block">
                {data[activeIdx].label}
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {prefix}{data[activeIdx].value.toLocaleString('en-IN')}{suffix}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setActiveIdx(highlightIndex ?? null)}
        >
          <defs>
            <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5E5E5" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#404040" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0.2" />
            </linearGradient>
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
                stroke="#1F1F1F"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area Fill */}
          {(type === 'area' || type === 'line') && (
            <motion.path
              d={areaD}
              fill="url(#silverGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Line Path */}
          {(type === 'area' || type === 'line') && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Bars representation if type === 'bar' or 'waterfall' */}
          {(type === 'bar' || type === 'waterfall') &&
            points.map((p, idx) => {
              const barWidth = (chartWidth - paddingX * 2) / data.length - 12;
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
                    rx="4"
                    fill={isHovered ? '#FFFFFF' : 'url(#barGradient)'}
                    initial={{ height: 0, y: chartHeight - paddingY }}
                    animate={{ height: barHeight, y }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill="#737373"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

          {/* Interactive Dots for line/area */}
          {(type === 'area' || type === 'line') &&
            points.map((p, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <g key={idx} onMouseEnter={() => setActiveIdx(idx)} className="cursor-pointer">
                  {isSelected && (
                    <line
                      x1={p.x}
                      y1={paddingY}
                      x2={p.x}
                      y2={chartHeight - paddingY}
                      stroke="#404040"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  )}
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#FFFFFF' : '#141414'}
                    stroke={isSelected ? '#FFFFFF' : '#737373'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    whileHover={{ scale: 1.4 }}
                  />
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#737373'}
                    fontSize="11"
                    fontFamily="monospace"
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
