import React from 'react';
import { Package, Clock, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';
import AIWidgetShell from '../ui/AIWidgetShell';

export default function InventoryMonitoring({ aiTrained, onNavigate }) {
  const categories = [
    { name: 'Seamless Steel Pipes', weight: '580.4 MT', val: '₹ 2.45 Cr', share: '50.8%', count: '320 Skus', status: 'Optimal' },
    { name: 'ERW Structural Pipes', weight: '340.2 MT', val: '₹ 1.12 Cr', share: '23.2%', count: '185 Skus', status: 'Low Safety Margin' },
    { name: 'Hollow Sections (MS)', weight: '310.0 MT', val: '₹ 88.5 L', share: '18.4%', count: '210 Skus', status: 'Optimal' },
    { name: 'Spiral Welded Pipes', weight: '189.4 MT', val: '₹ 36.5 L', share: '7.6%', count: '127 Skus', status: 'Aging Risk' },
  ];

  const agingItems = [
    { code: 'SP-304-89-4.5', category: 'Seamless Pipe', ageDays: 112, weight: '42.5 MT', value: '₹ 77.3 L', risk: 'High', yard: 'Yard B-04' },
    { code: 'SW-CS-400-8.0', category: 'Spiral Welded', ageDays: 98, weight: '65.0 MT', value: '₹ 40.3 L', risk: 'Medium', yard: 'Yard C-02' },
    { code: 'SP-316-60-5.0', category: 'Seamless Pipe', ageDays: 92, weight: '8.4 MT', value: '₹ 20.5 L', risk: 'Medium', yard: 'Yard B-08' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Inventory Monitoring & Aging Audits
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Category breakdowns, stock aging analysis (&gt;90 days), and stockout prevention triggers.
        </p>
      </div>

      {/* Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '14px'
      }}>
        {categories.map((cat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)' }}>{cat.name}</span>
              <span className={`badge ${cat.status === 'Optimal' ? 'badge-success' : 'badge-warning'}`}>
                {cat.status}
              </span>
            </div>

            <div className="font-mono-tabular" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {cat.weight}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>Valuation: <strong className="font-mono-tabular" style={{ color: 'var(--text-primary)' }}>{cat.val}</strong></span>
              <span className="font-mono-tabular">{cat.share} share</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Stock Aging Anomaly Surface */}
      <AIWidgetShell
        title="AI Stock Aging & Liquidation Anomaly Detector"
        modelName="Inventory Turnover & Margin Optimization Model"
        aiTrained={aiTrained}
        requiredRecords={600}
        currentRecords={410}
        estimatedDays={9}
        onUploadInvoices={() => alert('Opening stock history import...')}
        activeContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--accent-ai-active)' }}>
              <Clock size={15} />
              <span>3 Inventory Batches Flagged for Price Margin Risk (&gt;90 Days in Yard)</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Our ML model detected that Stainless 304 pipe spot rates are projected to fluctuate next month. Clearing slow-moving 42.5 MT stock in Stockyard B will lock in current peak margins.
            </p>
          </div>
        }
      />

      {/* Aging Stock Table */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Aging Stock Register (&gt;90 Days)</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Items at risk of carrying cost overheads</span>
          </div>

          <button onClick={() => onNavigate('registers')} className="btn-terminal btn-secondary" style={{ fontSize: '11px' }}>
            View Full Stock Register
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Aging Days</th>
                <th style={{ textAlign: 'right' }}>Stock (MT)</th>
                <th style={{ textAlign: 'right' }}>Valuation</th>
                <th>Yard Location</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {agingItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-mono-tabular" style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{item.code}</td>
                  <td>{item.category}</td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', color: 'var(--semantic-danger)', fontWeight: '700' }}>
                    {item.ageDays} days
                  </td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', fontWeight: '600' }}>{item.weight}</td>
                  <td className="font-mono-tabular" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{item.value}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.yard}</td>
                  <td>
                    <span className={`badge ${item.risk === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                      {item.risk} Risk
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
