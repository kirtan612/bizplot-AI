import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export const SalesPage: React.FC = () => {
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
              <ShoppingCart size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              SALES ACCELERATION
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Sales Acceleration & Orders
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Realtime order velocity, customer tier margins, and revenue per SKU category.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <TrendingUp size={16} color={t.ok} />
          <span>Velocity: +18.4% YoY</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="Sales Velocity (₹ Lakh per Week)"
          subtitle="Weekly order revenue trajectory"
          data={[
            { label: 'Wk 1', value: 42.1 },
            { label: 'Wk 2', value: 48.6 },
            { label: 'Wk 3', value: 52.4 },
            { label: 'Wk 4', value: 61.8 },
          ]}
          type="area"
          prefix="₹"
          suffix=" L"
        />
        <BusinessChart
          title="Category Sales Mix"
          subtitle="Revenue distribution by product line"
          data={[
            { label: 'GI Pipes', value: 14.2 },
            { label: 'MS Tubes', value: 6.8 },
            { label: 'GP Sections', value: 3.8 },
          ]}
          type="bar"
          prefix="₹"
          suffix=" Cr"
        />
      </div>
    </div>
  );
};
