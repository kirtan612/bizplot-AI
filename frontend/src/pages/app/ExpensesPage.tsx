import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { Wallet, ShieldCheck } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
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
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
        className="flex-col sm:flex-row"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              EXPENSE CONTROL
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Expense Control & Cost Allocation
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Operational expenditure, freight costs, and departmental overhead tracking.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>Within Budget (-2.4%)</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="Logistics & Freight Expense (₹ Lakh)"
          subtitle="Monthly transport and freight expenditure"
          data={[
            { label: 'Apr', value: 4.8 },
            { label: 'May', value: 5.2 },
            { label: 'Jun', value: 5.9 },
            { label: 'Jul', value: 6.4 },
          ]}
          type="area"
          prefix="₹"
          suffix=" L"
        />
        <BusinessChart
          title="Department Expense Mix"
          subtitle="Cost distribution across departments"
          data={[
            { label: 'Logistics', value: 6.4 },
            { label: 'Sales Ops', value: 3.2 },
            { label: 'Admin', value: 2.1 },
            { label: 'IT & Cloud', value: 1.5 },
          ]}
          type="bar"
          prefix="₹"
          suffix=" L"
        />
      </div>
    </div>
  );
};
