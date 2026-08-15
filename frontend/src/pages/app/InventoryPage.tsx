import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { Package, ShieldAlert } from 'lucide-react';

export const InventoryPage: React.FC = () => {
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
              <Package size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              INVENTORY CONTROL
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Inventory & SKU Health
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Stock turnover, idle capital detection, and reorder point automation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.warn, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldAlert size={16} color={t.warn} />
          <span>4 Low Stock Items</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="SKU Stock Value (₹ Lakh)"
          subtitle="Valuation by primary SKU category"
          data={[
            { label: 'GI Pipes', value: 84.2 },
            { label: 'MS Tubes', value: 42.1 },
            { label: 'Seamless', value: 28.5 },
            { label: 'Coils', value: 65.0 },
          ]}
          type="bar"
          prefix="₹"
          suffix=" L"
        />
        <BusinessChart
          title="Stock Aging Curve"
          subtitle="Inventory age distribution"
          data={[
            { label: '0-30 Days', value: 120 },
            { label: '31-60 Days', value: 45 },
            { label: '61-90 Days', value: 18 },
            { label: '90+ Days', value: 8 },
          ]}
          type="area"
          suffix=" SKUs"
        />
      </div>
    </div>
  );
};
