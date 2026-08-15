import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_AI_ALERTS } from '../../mock/alertData';

export const AlertCenter: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const alerts = MOCK_AI_ALERTS;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Critical':
        return { color: t.warn, bg: t.accentSoft };
      case 'Attention':
        return { color: t.warn, bg: t.accentSoft };
      case 'Opportunity':
        return { color: t.ok, bg: t.accentSoft };
      default:
        return { color: t.accent, bg: t.accentSoft };
    }
  };

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            AI Alerts
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Intelligent alert notifications
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alerts.map((alt) => {
          const catMeta = getCategoryColor(alt.category);
          return (
            <div
              key={alt.id}
              style={{
                padding: '10px 14px',
                borderRadius: 16,
                background: t.accentSoft,
                border: `1px solid ${t.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'transform 0.15s ease',
              }}
              className="hover:translate-x-1"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: catMeta.color,
                    background: t.card,
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {alt.category}
                </span>
                <span style={{ fontSize: 10, color: t.textFaint, fontFamily: "'Inter', sans-serif" }}>{alt.timestamp}</span>
              </div>

              <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {alt.title}
              </h4>
              <p style={{ margin: 0, fontSize: 11.5, color: t.textSub, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                {alt.explanation}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 10.5, color: t.textFaint }}>{alt.sourceExecutive}</span>
                <button
                  onClick={() => navigate(alt.actionRoute)}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: t.accent,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>{alt.actionText}</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
