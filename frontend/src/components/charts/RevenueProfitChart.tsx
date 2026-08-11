import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_TREND_DATA } from '../../mock/dashboardData';

function CustomTooltip({ active, payload, label }: any) {
  const { tokens: t } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: '10px 14px',
        boxShadow: t.mode === 'light' ? '0 4px 16px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 11, color: t.textFaint, marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, marginBottom: 2 }}>
          <span style={{ color: t.textSub, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}
          </span>
          <span style={{ color: t.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            ₹{p.value}L
          </span>
        </div>
      ))}
    </div>
  );
}

export const RevenueProfitChart: React.FC = () => {
  const { tokens: t } = useTheme();
  const [period, setPeriod] = useState<'30d' | '6m' | '1y'>('6m');
  const data = MOCK_TREND_DATA[period] || MOCK_TREND_DATA['6m'];

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            Revenue & profit trend
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Last 6 months, in ₹ lakh
          </p>
        </div>

        <div style={{ display: 'flex', gap: 4, background: t.accentSoft, padding: 3, borderRadius: 999, border: `1px solid ${t.border}` }}>
          {(['30d', '6m', '1y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                border: 'none',
                background: period === p ? t.dark : 'transparent',
                color: period === p ? t.darkText : t.textSub,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={t.border} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }} axisLine={{ stroke: t.border }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.border, strokeDasharray: '3 3' }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: t.textSub, paddingTop: 8 }}
          />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke={t.accent} strokeWidth={2.4} dot={{ r: 3, fill: t.accent }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="profit" name="Profit" stroke={t.ok} strokeWidth={2.4} dot={{ r: 3, fill: t.ok }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
