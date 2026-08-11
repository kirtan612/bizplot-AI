import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Building2, DollarSign, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { MOCK_AI_EXECUTIVES } from '../../mock/executiveData';
import { useTheme } from '../../context/ThemeContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { tokens: t } = useTheme();

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'Dashboard Overview', route: '/app', icon: Building2 },
    { title: 'AI Executive Center', route: '/app/executives', icon: Shield },
    { title: 'Executive Boardroom Meeting', route: '/app/executive-room', icon: TrendingUp },
    { title: 'AI CFO Workspace', route: '/app/ai/cfo', icon: DollarSign },
  ];

  const filteredExecutives = MOCK_AI_EXECUTIVES.filter(
    (exec) =>
      exec.name.toLowerCase().includes(query.toLowerCase()) ||
      exec.role.toLowerCase().includes(query.toLowerCase()) ||
      exec.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 80,
        paddingLeft: 16,
        paddingRight: 16,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 540,
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          boxShadow: t.mode === 'light' ? '0 12px 32px rgba(0,0,0,0.12)' : '0 12px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Search Input Bar */}
        <div style={{ padding: 16, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={18} color={t.textFaint} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI executives, metrics, ledgers, insights..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              fontSize: 13.5,
              color: t.text,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: t.textSub }}>
            <X size={16} />
          </button>
        </div>

        {/* Search Content */}
        <div style={{ padding: 16, maxHeight: 360, overflowY: 'auto' }}>
          {query.trim() === '' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint, paddingLeft: 4 }}>
                QUICK ACCESS ROUTES
              </span>
              {quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      navigate(link.route);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 18,
                      fontSize: 13,
                      color: t.text,
                      cursor: 'pointer',
                      background: t.accentSoft,
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={16} color={t.accent} />
                      <span style={{ fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{link.title}</span>
                    </div>
                    <ArrowRight size={14} color={t.textFaint} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint, paddingLeft: 4 }}>
                MATCHING AI EXECUTIVES ({filteredExecutives.length})
              </span>
              {filteredExecutives.map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => {
                    navigate(exec.route);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 18,
                    fontSize: 13,
                    color: t.text,
                    cursor: 'pointer',
                    background: t.accentSoft,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, display: 'block', fontFamily: "'Manrope', sans-serif" }}>{exec.name}</span>
                    <span style={{ fontSize: 11, color: t.textFaint }}>{exec.role}</span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: t.accent }}>Open Workspace</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
