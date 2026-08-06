import React from 'react';
import { Search, Shield, Cpu, Layers, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Header({ 
  activeBranch, 
  setActiveBranch, 
  isAdmin, 
  setIsAdmin, 
  aiTrained, 
  setAiTrained,
  onOpenCommandPalette 
}) {
  return (
    <header style={{
      height: '52px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 20
    }}>
      {/* Left: Brand Terminal Tag & Branch Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: '13px'
          }}>
            B
          </div>
          <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            BizPilot <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>AI</span>
          </span>
          <span className="badge badge-info" style={{ fontSize: '10px', padding: '1px 6px' }}>
            TERMINAL v1.0
          </span>
        </div>

        <div style={{ height: '16px', width: '1px', background: 'var(--border-default)' }} />

        {/* Multi-Branch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} style={{ color: 'var(--text-tertiary)' }} />
          <select 
            value={activeBranch} 
            onChange={(e) => setActiveBranch(e.target.value)}
            className="input-terminal"
            style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--bg-canvas)' }}
          >
            <option value="Main Yard (Mumbai Port)">Main Yard (Mumbai Port)</option>
            <option value="Stockyard B (Taloja Industrial)">Stockyard B (Taloja Industrial)</option>
            <option value="North Hub (Delhi NCR)">North Hub (Delhi NCR)</option>
          </select>
        </div>
      </div>

      {/* Middle: Command Palette Trigger */}
      <button 
        onClick={onOpenCommandPalette}
        className="input-terminal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '320px',
          padding: '6px 12px',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} />
          <span style={{ fontSize: '12px' }}>Search stock, HSN, ledgers, AI forecast...</span>
        </div>
        <kbd style={{
          background: 'var(--bg-canvas)',
          border: '1px solid var(--border-default)',
          borderRadius: '3px',
          padding: '1px 5px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)'
        }}>
          Ctrl+K
        </kbd>
      </button>

      {/* Right: Controls & Controls for Demoing Gated AI & Admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Network & Live DB Sync status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span className="pulse-beacon" style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--semantic-success)'
          }} />
          <span>Live Sync</span>
        </div>

        <div style={{ height: '16px', width: '1px', background: 'var(--border-default)' }} />

        {/* AI Model State Toggle (Interactive Demonstration) */}
        <button
          onClick={() => setAiTrained(!aiTrained)}
          className={`badge ${aiTrained ? 'badge-ai-active' : 'badge-ai-gated'}`}
          style={{
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Toggle between Trained ML Model output and Honest Calibration Pending state"
        >
          <Cpu size={13} />
          <span>AI State: {aiTrained ? 'Trained (Live)' : 'Calibrating (Gated)'}</span>
        </button>

        {/* Admin Role Toggle */}
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`badge ${isAdmin ? 'badge-warning' : 'btn-secondary'}`}
          style={{
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Shield size={13} />
          <span>{isAdmin ? 'Admin View' : 'Staff View'}</span>
        </button>

        {/* Notifications */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <Bell size={14} />
        </div>
      </div>
    </header>
  );
}
