import React from 'react';
import { LayoutDashboard, FileSpreadsheet, PackageSearch, DollarSign, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, isAdmin }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive BI', icon: LayoutDashboard },
    { id: 'registers', label: 'Stock Registers', icon: FileSpreadsheet },
    { id: 'inventory', label: 'Inventory Monitor', icon: PackageSearch },
    { id: 'cashflow', label: 'Cash Flow & Ledger', icon: DollarSign, adminOnly: true },
    { id: 'ai-terminal', label: 'AI Intelligence Hub', icon: Cpu, badge: 'Gated ML' },
  ];

  return (
    <aside style={{
      width: collapsed ? '56px' : '220px',
      height: '100%',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      zIndex: 15
    }}>
      {/* Top Nav Links */}
      <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: collapsed ? '10px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={collapsed ? item.label : ''}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  height: '60%',
                  width: '3px',
                  background: 'var(--accent-primary)',
                  borderRadius: '0 2px 2px 0'
                }} />
              )}
              <Icon size={16} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
              
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: 'var(--accent-ai-active)',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            width: '100%',
            padding: '8px 10px',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          {!collapsed && <span>Collapse Sidebar</span>}
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
