import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BusinessChart } from '../../components/BusinessChart';
import { FileText, ShieldCheck } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
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
              <FileText size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              INVOICING TELEMETRY
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Invoices & Receivables Billing
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Billing velocity, overdue ledger collection, and GST reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>GST Reconciled (100%)</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BusinessChart
          title="Monthly Billed Volume"
          subtitle="Total billed value per month"
          data={[
            { label: 'Apr', value: 1.82 },
            { label: 'May', value: 2.14 },
            { label: 'Jun', value: 2.48 },
            { label: 'Jul', value: 2.89 },
          ]}
          type="area"
          prefix="₹"
          suffix=" Cr"
        />
        <BusinessChart
          title="Overdue Invoice Bucket Count"
          subtitle="Number of invoices past due"
          data={[
            { label: '1-15d', value: 14 },
            { label: '16-30d', value: 8 },
            { label: '31-60d', value: 5 },
            { label: '60d+', value: 2 },
          ]}
          type="bar"
          suffix=" Inv"
        />
      </div>
    </div>
  );
};
