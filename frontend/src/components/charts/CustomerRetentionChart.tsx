import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13 }}>
          <span style={{ color: t.textSub, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {p.name}
          </span>
          <span style={{ color: t.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {p.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

export const CustomerRetentionChart: React.FC = () => {
  const { tokens: t } = useTheme();
  const data = MOCK_TREND_DATA['6m'];
  const latestRate = data[data.length - 1].retentionRate;

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justify: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            Customer retention
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Repeat purchasing & account loyalty curve
          </p>
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, color: t.ok, fontFamily: "'Manrope', sans-serif" }}>
          {latestRate}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={t.border} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }} axisLine={{ stroke: t.border }} tickLine={false} />
          <YAxis domain={[75, 95]} tick={{ fontSize: 11, fill: t.textFaint, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: t.border, strokeDasharray: '3 3' }} />
          <Line type="monotone" dataKey="retentionRate" name="Retention rate" stroke={t.accent} strokeWidth={2.4} dot={{ r: 3, fill: t.accent }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
