import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_INTELLIGENCE_TIMELINE } from '../../mock/timelineData';

export const IntelligenceTimeline: React.FC = () => {
  const { tokens: t } = useTheme();
  const events = MOCK_INTELLIGENCE_TIMELINE;

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
            Company Intelligence
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            Continuous telemetry activity log
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `2px solid ${t.border}`, paddingLeft: 12, marginLeft: 4 }}>
        {events.map((evt) => (
          <div key={evt.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, transition: 'transform 0.15s ease' }} className="hover:translate-x-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: t.textFaint, fontFamily: "'Inter', sans-serif" }}>{evt.time}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {evt.eventText}
              </span>
            </div>
            {evt.detailText && (
              <p style={{ margin: 0, fontSize: 11.5, color: t.textSub, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>
                {evt.detailText}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
