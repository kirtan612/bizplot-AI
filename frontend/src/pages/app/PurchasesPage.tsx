import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { Truck, ShieldCheck } from 'lucide-react';

export const PurchasesPage: React.FC = () => {
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
              <Truck size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              PROCUREMENT INTELLIGENCE
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Procurement & Supplier Intelligence
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Input price variance, supplier lead times, and raw material cost inflation tracking.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>12 Active Suppliers</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="Raw Material Cost Index (Steel Coil ₹/MT)"
          subtitle="Monthly input material cost tracking"
          data={[
            { label: 'Apr', value: 58200 },
            { label: 'May', value: 60400 },
            { label: 'Jun', value: 62100 },
            { label: 'Jul', value: 65400 },
          ]}
          type="area"
          prefix="₹"
          suffix=""
        />
        <BusinessChart
          title="Supplier Lead Time Variance"
          subtitle="Delivery lead time in days"
          data={[
            { label: 'JSW Steel', value: 4.2 },
            { label: 'Tata Steel', value: 3.1 },
            { label: 'SAIL Hub', value: 6.5 },
          ]}
          type="bar"
          suffix=" Days"
        />
      </div>
    </div>
  );
};
