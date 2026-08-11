import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleAlert, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { AIExecutive, ExecutiveStatusType } from '../../mock/executiveData';

export const ExecutiveStatusBadge: React.FC<{ status: ExecutiveStatusType }> = ({ status }) => {
  const { tokens: t } = useTheme();

  const getStatusMeta = (st: ExecutiveStatusType) => {
    switch (st) {
      case 'Healthy':
        return { icon: CircleCheck, label: 'Healthy', color: t.ok, bg: t.accentSoft };
      case 'Attention':
        return { icon: CircleAlert, label: 'Attention', color: t.warn, bg: t.accentSoft };
      case 'Risk':
        return { icon: CircleAlert, label: 'Risk', color: t.warn, bg: t.accentSoft };
      default:
        return { icon: CircleCheck, label: 'Healthy', color: t.ok, bg: t.accentSoft };
    }
  };

  const s = getStatusMeta(status);
  const StatusIcon = s.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        borderRadius: 20,
        padding: '3px 8px',
        fontFamily: "'Inter', sans-serif",
        flexShrink: 0,
      }}
    >
      <StatusIcon size={11} strokeWidth={2.4} />
      {s.label}
    </span>
  );
};

export const ExecutiveCard: React.FC<{ executive: AIExecutive }> = ({ executive }) => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();

  return (
    <div
      style={{
        minWidth: 240,
        flex: '1 1 0',
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: t.card,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-md cursor-pointer group"
      onClick={() => navigate(executive.route)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }} className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {executive.name}
          </div>
          <div style={{ fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            {executive.department}
          </div>
        </div>
        <ExecutiveStatusBadge status={executive.status} />
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
        {executive.primaryMetricLabel}: {executive.primaryMetricValue}
      </div>

      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: t.textSub, fontFamily: "'Inter', sans-serif", flexGrow: 1 }}>
        {executive.insight}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(executive.route);
        }}
        style={{
          alignSelf: 'flex-start',
          fontSize: 12,
          fontWeight: 600,
          color: t.accent,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          transition: 'gap 0.15s ease',
        }}
        className="group-hover:translate-x-1 transition-transform"
      >
        <span>Open {executive.code}</span>
        <ChevronRight size={12} />
      </button>
    </div>
  );
};
