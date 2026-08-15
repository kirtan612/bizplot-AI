import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { RevenueProfitChart } from '../../components/charts/RevenueProfitChart';
import { CashFlowChart } from '../../components/charts/CashFlowChart';
import { ExpenseBreakdownChart } from '../../components/charts/ExpenseBreakdownChart';
import { ReceivablesAgingChart } from '../../components/charts/ReceivablesAgingChart';
import { BarChart3, Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { tokens: t } = useTheme();
  const [activeTab, setActiveTab] = useState<'Revenue' | 'Inventory' | 'Orders' | 'Sales'>('Revenue');

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
              <BarChart3 size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              REPORTS HUB
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Reports & Business Telemetry
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Comprehensive multi-period reports, export capabilities, and analytics.
          </p>
        </div>

        <button
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            background: t.dark,
            color: t.darkText,
            border: 'none',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <Download size={14} />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Pill Tabs Selector */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 999,
          padding: 5,
          display: 'flex',
          gap: 4,
          width: 'fit-content',
        }}
      >
        {(['Revenue', 'Inventory', 'Orders', 'Sales'] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                border: 'none',
                background: active ? t.dark : 'transparent',
                color: active ? t.darkText : t.textSub,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Dynamic Report View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeTab === 'Revenue' && (
          <>
            <RevenueProfitChart />
            <CashFlowChart />
          </>
        )}
        {activeTab === 'Inventory' && (
          <>
            <ExpenseBreakdownChart />
            <ReceivablesAgingChart />
          </>
        )}
        {activeTab === 'Orders' && (
          <>
            <CashFlowChart />
            <RevenueProfitChart />
          </>
        )}
        {activeTab === 'Sales' && (
          <>
            <RevenueProfitChart />
            <ExpenseBreakdownChart />
          </>
        )}
      </div>
    </div>
  );
};
