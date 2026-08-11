import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_RECEIVABLES_AGING } from '../../mock/dashboardData';

export const ReceivablesAgingChart: React.FC = () => {
  const { tokens: t } = useTheme();
  const buckets = MOCK_RECEIVABLES_AGING;
  const total = buckets.reduce((a, b) => a + b.amount, 0);

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
            Receivables aging
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Invoice payment age distribution
          </p>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
          Total: ₹{total.toFixed(2)}Cr
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {buckets.map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: t.text, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? t.ok : i < 3 ? t.warn : t.accent }} />
                {b.bucket}
              </span>
              <span style={{ color: t.textSub, fontWeight: 600 }}>
                ₹{b.amount}Cr ({b.count} inv)
              </span>
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 999, background: t.track, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${b.percentage}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: i === 0 ? t.ok : i < 3 ? t.warn : t.accent,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
