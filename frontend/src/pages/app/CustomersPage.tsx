import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Users, ShieldCheck, AlertTriangle } from 'lucide-react';

export const CustomersPage: React.FC = () => {
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
              <Users size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              CUSTOMER INTELLIGENCE
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Customer Accounts & Retention
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Order gap acceleration, churn probability, and distributor credit telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>342 Active Accounts</span>
        </div>
      </div>

      {/* Customer Health Table Card */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 10, borderBottom: `1px solid ${t.border}` }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            Account Health Telemetry
          </h3>
          <span style={{ fontSize: 11.5, color: t.textFaint }}>Sorted by Retention Priority</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}`, color: t.textFaint }}>
                <th className="pb-3 font-semibold">CUSTOMER ACCOUNT</th>
                <th className="pb-3 font-semibold">HEALTH STATUS</th>
                <th className="pb-3 font-semibold">LAST ORDER GAP</th>
                <th className="pb-3 font-semibold">CLV</th>
                <th className="pb-3 font-semibold text-right">ACTION RECOMMENDATION</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                <td className="py-3.5">
                  <span style={{ fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif", display: 'block' }}>ABC Industries Ltd. (Surat)</span>
                  <span style={{ fontSize: 11, color: t.textFaint }}>Distributor • Tier A</span>
                </td>
                <td className="py-3.5">
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: t.warn, background: t.accentSoft }}>
                    At Risk (88%)
                  </span>
                </td>
                <td className="py-3.5" style={{ color: t.textSub }}>42 Days (+28d gap)</td>
                <td className="py-3.5 font-bold font-mono" style={{ color: t.text }}>₹1.84 Cr</td>
                <td className="py-3.5 text-right">
                  <button style={{ padding: '4px 12px', borderRadius: 999, background: t.dark, color: t.darkText, border: 'none', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    Dispatch Tier Discount
                  </button>
                </td>
              </tr>

              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                <td className="py-3.5">
                  <span style={{ fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif", display: 'block' }}>Shree Engineering (Ahmedabad)</span>
                  <span style={{ fontSize: 11, color: t.textFaint }}>OEM Partner • Tier A+</span>
                </td>
                <td className="py-3.5">
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: t.ok, background: t.accentSoft }}>
                    Healthy (96%)
                  </span>
                </td>
                <td className="py-3.5" style={{ color: t.textSub }}>6 Days Ago</td>
                <td className="py-3.5 font-bold font-mono" style={{ color: t.text }}>₹94.2 L</td>
                <td className="py-3.5 text-right">
                  <span style={{ fontSize: 12, color: t.textSub }}>Standard Annual Renewal</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
