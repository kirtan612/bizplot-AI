import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_AI_EXECUTIVES } from '../../mock/executiveData';
import { ExecutiveStatusBadge } from './ExecutiveCard';
import { useTheme } from '../../context/ThemeContext';

export const ExecutiveHealth: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const executives = MOCK_AI_EXECUTIVES;

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-lg"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>Executive Health</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>AI leadership team telemetry status</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: t.accentSoft, color: t.accent }}>
          10 Active Modules
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {executives.map((exec) => (
          <div
            key={exec.id}
            onClick={() => navigate(exec.route)}
            style={{
              padding: 12,
              borderRadius: 18,
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
            className="hover:-translate-y-0.5 hover:border-purple-300 dark:hover:border-purple-800"
          >
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text, display: 'block', fontFamily: "'Manrope', sans-serif" }}>
                {exec.name}
              </span>
              <span style={{ fontSize: 10.5, color: t.textFaint }}>
                {exec.code}
              </span>
            </div>

            <ExecutiveStatusBadge status={exec.status} />
          </div>
        ))}
      </div>
    </div>
  );
};
