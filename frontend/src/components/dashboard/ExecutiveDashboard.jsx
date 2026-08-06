import React from 'react';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertOctagon, ArrowUpRight, ShieldAlert, Cpu } from 'lucide-react';
import AIWidgetShell from '../ui/AIWidgetShell';
import PriceForecastChart from '../charts/PriceForecastChart';

export default function ExecutiveDashboard({ aiTrained, setAiTrained, onNavigate, onOpenCommandPalette }) {
  const kpis = [
    {
      title: 'INVENTORY VALUATION',
      value: '₹ 4.82 Cr',
      unit: '1,420 MT Total Weight',
      change: '+3.4% vs last month',
      isPositive: true,
      icon: Package,
    },
    {
      title: 'MONTHLY TURNOVER',
      value: '₹ 1.94 Cr',
      unit: '580 MT Dispatched',
      change: '+11.2% vs target',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'OUTSTANDING LEDGERS',
      value: '₹ 68.4 Lakhs',
      unit: '18 Active Customers',
      change: '-2.1% overdue delta',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'STOCK AGING RISK',
      value: '145 MT (>90 Days)',
      unit: 'Valued at ₹ 84.1 L',
      change: '+18 MT needs liquidation',
      isPositive: false,
      icon: AlertOctagon,
    },
  ];

  const quickRegisters = [
    { code: 'SP-304-89-4', desc: 'Seamless Pipe Grade 304 (OD 89mm, Wall 4.5mm)', stock: '42.5 MT', rate: '₹ 1,82,000 / MT', status: 'Optimal' },
    { code: 'ERW-201-114-6', desc: 'ERW Structure Pipe Grade 201 (OD 114mm, Wall 6mm)', stock: '18.0 MT', rate: '₹ 68,500 / MT', status: 'Low Stock' },
    { code: 'HS-MS-50-50', desc: 'Hollow Section MS Square (50x50mm, Wall 3mm)', stock: '85.2 MT', rate: '₹ 56,200 / MT', status: 'Optimal' },
    { code: 'SP-316-60-5', desc: 'Seamless Pipe Heavy Duty Grade 316 (OD 60mm)', stock: '8.4 MT', rate: '₹ 2,45,000 / MT', status: 'Reorder Risk' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Executive BI Cockpit
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Real-time inventory valuation, steel spot index trends, and margin anomalies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => onNavigate('registers')} 
            className="btn-terminal btn-secondary" 
            style={{ fontSize: '12px' }}
          >
            View Full Registers
          </button>
          <button 
            onClick={onOpenCommandPalette} 
            className="btn-terminal" 
            style={{ fontSize: '12px' }}
          >
            Terminal Search (Ctrl+K)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                  {kpi.title}
                </span>
                <Icon size={15} style={{ color: 'var(--text-tertiary)' }} />
              </div>

              <div className="font-mono-tabular" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {kpi.value}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{kpi.unit}</span>
                <span style={{
                  color: kpi.isPositive ? 'var(--semantic-success)' : 'var(--semantic-danger)',
                  fontWeight: '500'
                }}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Price Forecast AI Widget + Anomaly Alerts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px'
      }}>
        {/* Left: Spot Price Forecast AI Surface */}
        <AIWidgetShell
          title="Steel Spot Index & Demand Forecast"
          modelName="ML Price Prediction Engine (HRC / CRC / Seamless)"
          aiTrained={aiTrained}
          requiredRecords={500}
          currentRecords={385}
          estimatedDays={11}
          activeContent={<PriceForecastChart aiTrained={aiTrained} />}
          onUploadInvoices={() => alert('Opening invoice import modal...')}
        />

        {/* Right: AI Anomaly & Opportunity Alerts */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} style={{ color: 'var(--semantic-warning)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Operational Alerts</h3>
            </div>
            <span className="badge badge-warning" style={{ fontSize: '10px' }}>3 Actionable</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Alert 1 */}
            <div style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'var(--semantic-warning)' }}>
                <span>Stock Aging Anomaly</span>
                <span>High Severity</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                45 MT Seamless 304 (OD 89mm) has been in Stockyard B for 112 days. Spot rate risk is rising.
              </p>
              <button 
                onClick={() => onNavigate('inventory')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
              >
                <span>View liquidation route</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Alert 2 */}
            <div style={{
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'var(--semantic-danger)' }}>
                <span>Reorder Threshold Alert</span>
                <span>Critical</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                ERW Structure 114mm stock dropped below 20 MT safety margin. Pending client quotes: 35 MT.
              </p>
              <button 
                onClick={() => onNavigate('registers')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '11px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
              >
                <span>Check supplier rates</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Alert 3 (AI Gated Model Alert) */}
            <div style={{
              background: 'var(--bg-inset)',
              border: '1px dashed var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'var(--accent-ai-gated)' }}>
                <span>Customer Churn Model</span>
                <span>Calibrating</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Logging ledger payment timing to train default risk prediction model.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stock Registers Table */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Fast Stock Register Overview</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>High-density steel pipe inventory items</span>
          </div>

          <button onClick={() => onNavigate('registers')} className="btn-terminal btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
            Open Full Register (842 items)
          </button>
        </div>

        <div className="data-table-container" style={{ maxHeight: '200px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Specification & Grade</th>
                <th style={{ textAlign: 'right' }}>Current Stock</th>
                <th style={{ textAlign: 'right' }}>Benchmark Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {quickRegisters.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-mono-tabular" style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{row.code}</td>
                  <td>{row.desc}</td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', fontWeight: '600' }}>{row.stock}</td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{row.rate}</td>
                  <td>
                    <span className={`badge ${row.status === 'Optimal' ? 'badge-success' : row.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'}`}>
                      {row.status}
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
