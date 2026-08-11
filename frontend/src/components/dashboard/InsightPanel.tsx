import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_AI_INSIGHTS, type InsightCategory } from '../../mock/insightData';

export const InsightPanel: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const insights = MOCK_AI_INSIGHTS;

  const getCategoryBadge = (cat: InsightCategory) => {
    switch (cat) {
      case 'Risk':
        return { color: t.warn, bg: t.accentSoft };
      case 'Opportunity':
        return { color: t.ok, bg: t.accentSoft };
      case 'Trend':
        return { color: t.accent, bg: t.accentSoft };
      case 'Recommendation':
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
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            AI Business Insights
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Real-time diagnostic synthesis
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.map((item) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={item.id}
              style={{
                padding: '12px 14px',
                borderRadius: 16,
                background: t.accentSoft,
                border: `1px solid ${t.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
              className="hover:translate-x-1 hover:border-purple-300 dark:hover:border-purple-800"
            >
              <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: badge.color,
                    background: t.card,
                    borderRadius: 999,
                    padding: '2px 10px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: 11, color: t.textFaint, fontFamily: "'Inter', sans-serif" }}>
                  Source: {item.sourceExecutive}
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {item.title}
              </h4>

              <div style={{ fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif", lineHeight: 1.45 }}>
                <strong>Why it matters:</strong> {item.whyItMatters}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', pt: 4, borderTop: `1px solid ${t.border}` }}>
                <span style={{ fontSize: 11, color: t.textFaint }}>
                  {item.recommendedAction}
                </span>
                <button
                  onClick={() => navigate(item.actionRoute)}
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
                  <span>{item.actionText}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
