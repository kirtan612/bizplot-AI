import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export const CashflowPage: React.FC = () => {
  const { tokens: t } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Banner */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 24,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
        className="flex-col sm:flex-row"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              CASH FLOW FORECASTING
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Cash Flow Forecasting & Liquidity
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Predictive liquidity models, incoming receivables pacing, and bank buffer limits.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>30-Day Liquidity Safe</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="Projected Cash In vs Cash Out (30-Day Forecast)"
          subtitle="Net cash flow trajectory"
          data={[
            { label: 'Wk 1', value: 12.5 },
            { label: 'Wk 2', value: 18.2 },
            { label: 'Wk 3', value: 24.1 },
            { label: 'Wk 4', value: 31.0 },
          ]}
          type="area"
          prefix="₹"
          suffix=" L"
        />
        <BusinessChart
          title="Receivables Realization Probability"
          subtitle="Probability of collection by age bucket"
          data={[
            { label: '< 15 Days', value: 92 },
            { label: '15-30 Days', value: 78 },
            { label: '30-60 Days', value: 54 },
            { label: '60+ Days', value: 22 },
          ]}
          type="bar"
          suffix="%"
        />
      </div>
    </div>
  );
};
