import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, Cpu, Package, ArrowRight, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectTab }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { title: 'View Stock Registers (Steel Pipes)', cat: 'Registers', icon: FileSpreadsheet, action: () => { onSelectTab('registers'); onClose(); } },
    { title: 'Check HRC Spot Price Forecast', cat: 'AI Intelligence', icon: Cpu, action: () => { onSelectTab('ai-terminal'); onClose(); } },
    { title: 'Inspect Stock Aging & Slow Movers', cat: 'Inventory', icon: Package, action: () => { onSelectTab('inventory'); onClose(); } },
    { title: 'Review Cash Flow & Overdue Ledgers', cat: 'Finance', icon: FileSpreadsheet, action: () => { onSelectTab('cashflow'); onClose(); } },
  ];

  const filtered = quickActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '80px',
      zIndex: 100
    }} onClick={onClose}>
      <div 
        className="glass-modal"
        style={{
          width: '560px',
          maxWidth: '90vw',
          overflow: 'hidden',
          animation: 'beaconPulse 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-inset)'
        }}>
          <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Type a command or search stock, ledgers, forecast models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)'
            }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ padding: '8px', maxHeight: '320px', overflowY: 'auto' }}>
          <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Suggested Actions & Shortcuts
          </div>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 0.1s ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)'
                    }}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{item.cat}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              );
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px' }}>
              No commands found matching "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          background: 'var(--bg-canvas)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-tertiary)'
        }}>
          <span>Press <strong>Esc</strong> to close</span>
          <span><strong>BizPilot AI</strong> Quick Terminal</span>
        </div>
      </div>
    </div>
  );
}
