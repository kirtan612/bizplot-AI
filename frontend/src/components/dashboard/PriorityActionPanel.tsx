import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_PRIORITY_ACTIONS } from '../../mock/insightData';

export const PriorityActionPanel: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const actions = MOCK_PRIORITY_ACTIONS;

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-lg"
    >
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            What should I do next?
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Prioritized AI executive recommendations
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {actions.map((act) => (
          <div
            key={act.step}
            style={{
              padding: '12px 14px',
              borderRadius: 16,
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: 12,
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            className="hover:translate-x-1 hover:border-purple-300 dark:hover:border-purple-800 cursor-pointer"
            onClick={() => navigate(act.actionRoute)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: t.accent, fontFamily: "'Manrope', sans-serif" }}>
                #{act.step}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }} className="truncate">
                    {act.title}
                  </h4>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: t.card, color: t.accent }}>
                    {act.metricBadge}
                  </span>
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }} className="truncate">
                  {act.subtitle} • Lead: {act.leadExecutive}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(act.actionRoute);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                fontSize: 12,
                fontWeight: 600,
                color: t.accent,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0,
              }}
            >
              <span>{act.actionText}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
