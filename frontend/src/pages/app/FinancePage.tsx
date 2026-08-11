import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { DollarSign, ShieldCheck } from 'lucide-react';

export const FinancePage: React.FC = () => {
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
              <DollarSign size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              FINANCE TELEMETRY
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Financial Telemetry & Treasury
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Gross margins, EBITDA pacing, ROIC, and capital allocation efficiency.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>EBITDA Margin: 18.4%</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="EBITDA Margin Trajectory (%)"
          subtitle="Quarterly margin progression"
          data={[
            { label: 'Q1 FY25', value: 16.2 },
            { label: 'Q2 FY25', value: 17.1 },
            { label: 'Q3 FY25', value: 18.0 },
            { label: 'Q4 FY25', value: 18.4 },
          ]}
          type="area"
          prefix=""
          suffix="%"
        />
        <BusinessChart
          title="Working Capital Buffer (₹ Lakh)"
          subtitle="Liquid capital reserve"
          data={[
            { label: 'Apr', value: 18.5 },
            { label: 'May', value: 15.2 },
            { label: 'Jun', value: 12.1 },
            { label: 'Jul', value: 9.2 },
          ]}
          type="bar"
          prefix="₹"
          suffix=" L"
        />
      </div>
    </div>
  );
};
