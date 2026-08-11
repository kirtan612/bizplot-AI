import React, { useState } from 'react';
import { MOCK_AI_EXECUTIVES } from '../../mock/executiveData';
import { ExecutiveCard } from '../../components/dashboard/ExecutiveCard';
import { Brain, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ExecutiveCenterPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const { tokens: t } = useTheme();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const visibleExecutives = MOCK_AI_EXECUTIVES.filter((exec) =>
    hasPermission(exec.permission as any)
  );

  const filtered = visibleExecutives.filter((exec) => {
    const matchesStatus = filterStatus === 'ALL' || exec.status.toUpperCase() === filterStatus.toUpperCase();
    const matchesQuery =
      exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

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
              <Brain size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              AI Executive Center
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            AI Leadership Team
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Autonomous strategic advisors monitoring company ledgers, operations, and growth.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.accent, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <ShieldCheck size={16} color={t.ok} />
          <span>{visibleExecutives.length} Active Executives</span>
        </div>
      </div>

      {/* Filter & Search Pill Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }} className="flex-col sm:flex-row">
        <div style={{ position: 'relative', flex: 1, width: '100%', maxWidth: 420 }}>
          <Search size={15} color={t.textFaint} style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search executive name, role, department..."
            style={{
              width: '100%',
              paddingLeft: 38,
              paddingRight: 14,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 999,
              background: t.card,
              border: `1px solid ${t.border}`,
              fontSize: 13,
              color: t.text,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, background: t.card, padding: 5, borderRadius: 999, border: `1px solid ${t.border}` }}>
          {['ALL', 'HEALTHY', 'ATTENTION', 'RISK'].map((st) => {
            const active = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  border: 'none',
                  background: active ? t.dark : 'transparent',
                  color: active ? t.darkText : t.textSub,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Executive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((exec) => (
          <ExecutiveCard key={exec.id} executive={exec} />
        ))}
      </div>
    </div>
  );
};
