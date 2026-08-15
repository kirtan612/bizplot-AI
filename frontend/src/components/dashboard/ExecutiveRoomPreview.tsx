import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_MEETING_TOPICS } from '../../mock/meetingData';

export const ExecutiveRoomPreview: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const meeting = MOCK_MEETING_TOPICS[0];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UsersRound size={16} color={t.accent} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              Executive Room
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
              Where your AI leadership team collaborates in real time
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/app/executive-room')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 16px',
            borderRadius: 999,
            background: t.dark,
            color: t.darkText,
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'transform 0.15s ease, opacity 0.15s ease',
          }}
          className="hover:scale-105 hover:opacity-90"
        >
          <span>View Meeting</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 18, background: t.accentSoft, border: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>Current Topic</span>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginTop: 2, fontFamily: "'Manrope', sans-serif" }}>
            "{meeting.title}"
          </div>
        </div>
        <span style={{ fontSize: 11, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>{meeting.date}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {meeting.messages.slice(0, 3).map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '10px 14px',
              borderRadius: 16,
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              transition: 'transform 0.15s ease',
            }}
            className="hover:translate-x-1"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: t.accent,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {msg.executiveName.replace('AI ', '').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{msg.executiveName}</span>
                <span style={{ fontSize: 10.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>({msg.executiveRole})</span>
                <span style={{ fontSize: 10, color: t.textFaint, marginLeft: 'auto' }}>{msg.timestamp}</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.45, fontFamily: "'Inter', sans-serif" }}>
                "{msg.content}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
