import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Layers } from 'lucide-react';

export default function PriceForecastChart({ aiTrained }) {
  const [selectedCommodity, setSelectedCommodity] = useState('HRC 2.5mm (Hot Rolled Coil)');
  const [hoveredData, setHoveredData] = useState(null);

  // Mock empirical steel spot price trajectory data (₹ per MT)
  const historicalPoints = [
    { date: '15 Jul', actual: 56200, forecast: null, ciLow: null, ciHigh: null },
    { date: '18 Jul', actual: 56800, forecast: null, ciLow: null, ciHigh: null },
    { date: '21 Jul', actual: 57100, forecast: null, ciLow: null, ciHigh: null },
    { date: '24 Jul', actual: 56900, forecast: null, ciLow: null, ciHigh: null },
    { date: '27 Jul', actual: 57500, forecast: null, ciLow: null, ciHigh: null },
    { date: '30 Jul', actual: 58200, forecast: 58200, ciLow: 58200, ciHigh: 58200 }, // Transition
  ];

  const forecastPoints = [
    { date: '02 Aug', actual: null, forecast: 58900, ciLow: 58300, ciHigh: 59500 },
    { date: '05 Aug', actual: null, forecast: 59600, ciLow: 58800, ciHigh: 60400 },
    { date: '08 Aug', actual: null, forecast: 60200, ciLow: 59200, ciHigh: 61200 },
    { date: '11 Aug', actual: null, forecast: 61100, ciLow: 59900, ciHigh: 62300 },
    { date: '14 Aug', actual: null, forecast: 61800, ciLow: 60300, ciHigh: 63100 },
  ];

  const allPoints = [...historicalPoints, ...forecastPoints];
  const minVal = 55000;
  const maxVal = 64000;

  const width = 640;
  const height = 220;
  const paddingLeft = 50;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const getX = (index) => paddingLeft + (index / (allPoints.length - 1)) * chartW;
  const getY = (val) => paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build SVG path strings
  const actualSvgPath = historicalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.actual)}`).join(' ');
  const forecastSvgPath = forecastPoints.map((p, i) => `${i === 0 ? 'M ' + getX(historicalPoints.length - 1) + ' ' + getY(historicalPoints[historicalPoints.length - 1].actual) : ''} L ${getX(historicalPoints.length - 1 + i)} ${getY(p.forecast)}`).join(' ');

  // Confidence Interval Polygon
  const ciPolygonPoints = [
    ...forecastPoints.map((p, i) => `${getX(historicalPoints.length - 1 + i)},${getY(p.ciHigh)}`),
    ...forecastPoints.slice().reverse().map((p, i) => `${getX(historicalPoints.length - 1 + (forecastPoints.length - 1 - i))},${getY(p.ciLow)}`)
  ].join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Chart Control Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="input-terminal"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            <option value="HRC 2.5mm (Hot Rolled Coil)">HRC 2.5mm (Hot Rolled Coil) — ₹/MT</option>
            <option value="CRC 1.2mm (Cold Rolled Coil)">CRC 1.2mm (Cold Rolled Coil) — ₹/MT</option>
            <option value="Seamless Pipe Grade 304">Seamless Pipe Grade 304 — ₹/MT</option>
          </select>

          <span className="badge badge-success" style={{ fontSize: '10px' }}>
            <TrendingUp size={12} />
            +4.8% Projected 14-Day Trajectory
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '2px', background: 'var(--accent-primary)' }} />
            <span>Actual Spot Price</span>
          </div>

          {aiTrained && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '2px', background: 'var(--accent-ai-active)', strokeDasharray: '2 2' }} />
                <span>AI Forecast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }} />
                <span>80% Confidence Band</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SVG Canvas Render */}
      <div style={{ position: 'relative', width: '100%', background: 'var(--bg-inset)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '10px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Horizontal Gridlines */}
          {[56000, 58000, 60000, 62000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fill="var(--text-tertiary)" fontSize="9" fontFamily="var(--font-mono)">
                  ₹{(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Vertical X-axis Labels */}
          {allPoints.map((p, i) => {
            const x = getX(i);
            return (
              <text key={i} x={x} y={height - 8} textAnchor="middle" fill="var(--text-tertiary)" fontSize="9" fontFamily="var(--font-mono)">
                {p.date}
              </text>
            );
          })}

          {/* Confidence Band Polygon (If Trained) */}
          {aiTrained && (
            <polygon points={ciPolygonPoints} fill="rgba(139, 92, 246, 0.12)" stroke="rgba(139, 92, 246, 0.3)" strokeDasharray="2 2" />
          )}

          {/* Actual Spot Price Line */}
          <path d={actualSvgPath} fill="none" stroke="var(--accent-primary)" strokeWidth="2" />

          {/* Actual Data Points */}
          {historicalPoints.map((p, i) => (
            <circle key={i} cx={getX(i)} cy={getY(p.actual)} r="3" fill="var(--bg-canvas)" stroke="var(--accent-primary)" strokeWidth="2" />
          ))}

          {/* AI Forecast Line (If Trained) */}
          {aiTrained && (
            <>
              <path d={forecastSvgPath} fill="none" stroke="var(--accent-ai-active)" strokeWidth="2" strokeDasharray="4 4" />
              {forecastPoints.map((p, i) => {
                const idx = historicalPoints.length - 1 + i;
                return (
                  <circle key={i} cx={getX(idx)} cy={getY(p.forecast)} r="3" fill="var(--bg-canvas)" stroke="var(--accent-ai-active)" strokeWidth="2" />
                );
              })}
            </>
          )}

          {/* Divider between Historical and Forecast */}
          <line
            x1={getX(historicalPoints.length - 1)}
            y1={paddingTop}
            x2={getX(historicalPoints.length - 1)}
            y2={height - paddingBottom}
            stroke="var(--border-default)"
            strokeDasharray="2 2"
          />
        </svg>

        {!aiTrained && (
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '30px',
            background: 'rgba(18, 18, 21, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="pulse-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-ai-gated)' }} />
            <span>AI Forecast Zone: Calibration In Progress</span>
          </div>
        )}
      </div>

      {/* Summary Footer Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
        <span>Source: JSW / Tata Steel Spot Index Collation</span>
        <span className="font-mono-tabular">Last Spot Sync: 10 mins ago</span>
      </div>
    </div>
  );
}
