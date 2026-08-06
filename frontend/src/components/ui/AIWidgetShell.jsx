import React from 'react';
import { Cpu, Database, AlertCircle, Sparkles, UploadCloud, Info } from 'lucide-react';

export default function AIWidgetShell({ 
  title, 
  modelName = 'Price & Demand Forecasting Model',
  aiTrained = false,
  requiredRecords = 500,
  currentRecords = 340,
  estimatedDays = 14,
  activeContent,
  onUploadInvoices
}) {
  const progressPercent = Math.min(100, Math.round((currentRecords / requiredRecords) * 100));

  return (
    <div className="glass-card" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-sm)',
            background: aiTrained ? 'rgba(139, 92, 246, 0.15)' : 'rgba(113, 113, 122, 0.15)',
            border: `1px solid ${aiTrained ? 'rgba(139, 92, 246, 0.3)' : 'rgba(113, 113, 122, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: aiTrained ? 'var(--accent-ai-active)' : 'var(--accent-ai-gated)'
          }}>
            {aiTrained ? <Sparkles size={13} /> : <Cpu size={13} />}
          </div>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h3>
            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{modelName}</span>
          </div>
        </div>

        {/* Status Pill */}
        <span className={`badge ${aiTrained ? 'badge-ai-active' : 'badge-ai-gated'}`}>
          <span className="pulse-beacon" style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: aiTrained ? 'var(--accent-ai-active)' : 'var(--text-tertiary)'
          }} />
          {aiTrained ? 'Model Live (Trained)' : 'Calibration Pending'}
        </span>
      </div>

      {/* Conditional Rendering: Trained Live State vs Honest Untrained Calibration State */}
      {aiTrained ? (
        <div style={{ animation: 'beaconPulse 0.2s ease-out' }}>
          {activeContent}
        </div>
      ) : (
        /* Untrained / Calibration Pending Surface (As specified in Design Architecture) */
        <div style={{
          background: 'var(--bg-inset)',
          border: '1px dashed var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={15} style={{ color: 'var(--accent-ai-gated)' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Historical Data Collation In Progress
              </span>
            </div>
            <span className="font-mono-tabular" style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>
              {progressPercent}% Complete
            </span>
          </div>

          {/* Precision Telemetry Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--bg-canvas)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Model Requirements Diagnostics Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Minimum Valid Registers Required:</span>
              <strong className="font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>{requiredRecords} records</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Currently Logged & Validated:</span>
              <strong className="font-mono-tabular" style={{ color: 'var(--semantic-success)' }}>{currentRecords} records</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Model Activation Horizon:</span>
              <strong className="font-mono-tabular" style={{ color: 'var(--text-secondary)' }}>~{estimatedDays} days at current logging velocity</strong>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-tertiary)' }}>
              <Info size={12} />
              <span>No fabricated estimates. Real trained weights only.</span>
            </div>

            <button 
              onClick={onUploadInvoices}
              className="btn-terminal btn-secondary"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              <UploadCloud size={13} />
              <span>Import Past Invoices</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
