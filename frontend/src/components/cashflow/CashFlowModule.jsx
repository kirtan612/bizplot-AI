import React from 'react';
import { DollarSign, ShieldAlert, ArrowUpRight, TrendingUp, AlertTriangle, Lock } from 'lucide-react';
import AIWidgetShell from '../ui/AIWidgetShell';

export default function CashFlowModule({ isAdmin, aiTrained }) {
  if (!isAdmin) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--semantic-danger)'
        }}>
          <Lock size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Admin Permission Required</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '380px', marginTop: '4px' }}>
            Cash flow ledgers, customer credit balances, and profit margin forecasts are restricted to business owners and admin roles.
          </p>
        </div>
        <span className="badge badge-warning" style={{ padding: '6px 12px' }}>
          Switch to "Admin View" in the top header bar to inspect financial ledgers
        </span>
      </div>
    );
  }

  const ledgers = [
    { party: 'Apex Tubes Pvt Ltd', type: 'Receivable', total: '₹ 24,50,000', overdue: '₹ 12,00,000', daysOverdue: 42, risk: 'High Risk' },
    { party: 'National Infrastructure Co.', type: 'Receivable', total: '₹ 18,20,000', overdue: '₹ 0', daysOverdue: 0, risk: 'Low Risk' },
    { party: 'JSW Steel Supplier (Credit Line)', type: 'Payable', total: '₹ 45,00,000', overdue: '₹ 0', daysOverdue: 0, risk: 'Scheduled' },
    { party: 'Metro Steel Fabricators', type: 'Receivable', total: '₹ 8,40,000', overdue: '₹ 3,20,000', daysOverdue: 18, risk: 'Medium Risk' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Cash Flow & Ledger Receivables
          </h1>
          <span className="badge badge-warning">Admin Only</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Customer credit limits, overdue ledger tracking, and 30-day liquidity forecasting.
        </p>
      </div>

      {/* Financial KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        <div className="glass-card" style={{ padding: '14px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-tertiary)' }}>TOTAL RECEIVABLES</span>
          <div className="font-mono-tabular" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--semantic-success)', marginTop: '4px' }}>
            ₹ 68.40 Lakhs
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>18 Customer Ledgers</span>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-tertiary)' }}>CRITICAL OVERDUE</span>
          <div className="font-mono-tabular" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--semantic-danger)', marginTop: '4px' }}>
            ₹ 15.20 Lakhs
          </div>
          <span style={{ fontSize: '11px', color: 'var(--semantic-danger)' }}>3 Accounts &gt;30 Days Overdue</span>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-tertiary)' }}>PROJECTED 30-DAY INFLOW</span>
          <div className="font-mono-tabular" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '4px' }}>
            ₹ 52.80 Lakhs
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Based on payment terms</span>
        </div>
      </div>

      {/* AI Liquidity AI Surface */}
      <AIWidgetShell
        title="AI 30-Day Liquidity Buffer Forecast"
        modelName="Ledger Payment Timing & Default Probability Engine"
        aiTrained={aiTrained}
        requiredRecords={750}
        currentRecords={510}
        estimatedDays={16}
        onUploadInvoices={() => alert('Importing ledger history...')}
        activeContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--semantic-success)' }}>
                Healthy Liquidity Buffer Projected for August 2026
              </span>
              <span className="font-mono-tabular" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>94% Model Confidence</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Historical payment speeds indicate Apex Tubes will settle ₹12L overdue balance by Aug 15 following their project milestone disbursement.
            </p>
          </div>
        }
      />

      {/* Ledgers Table */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Active Party Ledgers</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Party Name</th>
                <th>Ledger Type</th>
                <th style={{ textAlign: 'right' }}>Total Balance</th>
                <th style={{ textAlign: 'right' }}>Overdue Amount</th>
                <th style={{ textAlign: 'right' }}>Days Overdue</th>
                <th>Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((l, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{l.party}</td>
                  <td>
                    <span className={`badge ${l.type === 'Receivable' ? 'badge-info' : 'badge-warning'}`}>{l.type}</span>
                  </td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', fontWeight: '600' }}>{l.total}</td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', color: l.overdue !== '₹ 0' ? 'var(--semantic-danger)' : 'var(--text-tertiary)', fontWeight: '700' }}>
                    {l.overdue}
                  </td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right' }}>{l.daysOverdue > 0 ? `${l.daysOverdue} days` : '-'}</td>
                  <td>
                    <span className={`badge ${l.risk === 'High Risk' ? 'badge-danger' : l.risk === 'Medium Risk' ? 'badge-warning' : 'badge-success'}`}>
                      {l.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
