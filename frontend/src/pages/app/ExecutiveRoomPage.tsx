import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersRound,
  Building2,
  DollarSign,
  BriefcaseBusiness,
  ShoppingCart,
  Truck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { MOCK_MEETING_TOPICS } from '../../mock/meetingData';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const ExecutiveRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const [selectedTopicId, setSelectedTopicId] = useState(MOCK_MEETING_TOPICS[0].id);

  const currentTopic = MOCK_MEETING_TOPICS.find((topic) => topic.id === selectedTopicId) || MOCK_MEETING_TOPICS[0];

  const participantIcons: Record<string, React.ElementType> = {
    'ai-ceo': Building2,
    'ai-cfo': DollarSign,
    'ai-coo': BriefcaseBusiness,
    'ai-sales': ShoppingCart,
    'ai-supply-chain': Truck,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Boardroom Banner */}
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
              <UsersRound size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              AI EXECUTIVE BOARDROOM
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Executive Collaboration Room
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Where your AI leadership team collaborates to solve complex business problems.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
          <Sparkles size={16} color={t.ok} />
          <span>Status: Session Finalized</span>
        </div>
      </div>

      {/* Main Boardroom Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar: Sessions & Participants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="lg:col-span-1">
          {/* Sessions List */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint }}>
              Boardroom Sessions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MOCK_MEETING_TOPICS.map((topic) => {
                const active = selectedTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      border: `1px solid ${active ? t.accent : t.border}`,
                      background: active ? t.accentSoft : t.card,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700 }}>
                      <span style={{ color: t.accent, textTransform: 'uppercase' }}>{topic.category}</span>
                      <span style={{ color: t.textFaint }}>{topic.date.split('•')[0]}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: active ? 700 : 500, color: t.text, fontFamily: "'Manrope', sans-serif", lineHeight: 1.3 }}>
                      {topic.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Participants */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.textFaint }}>
              Board Participants ({currentTopic.participants.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentTopic.participants.map((pId) => {
                const Icon = participantIcons[pId] || UsersRound;
                const name = pId === 'ai-ceo' ? 'AI CEO' : pId === 'ai-cfo' ? 'AI CFO' : pId === 'ai-coo' ? 'AI COO' : pId === 'ai-sales' ? 'AI Sales' : 'AI Supply Chain';

                return (
                  <div
                    key={pId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 10,
                      borderRadius: 16,
                      background: t.accentSoft,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text, display: 'block', fontFamily: "'Manrope', sans-serif" }}>{name}</span>
                      <span style={{ fontSize: 10.5, color: t.textFaint }}>Verified Executive</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Topic & Discussion Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="lg:col-span-3">
          {/* Diagnostic Banner */}
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 28,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: t.accent }}>
              TOPIC DIAGNOSTIC
            </span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
              "{currentTopic.title}"
            </h2>
            <p style={{ margin: 0, fontSize: 12.5, color: t.textSub, lineHeight: 1.5 }}>
              {currentTopic.subtitle}
            </p>
          </div>

          {/* Conversation Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentTopic.messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 28,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.accent, color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>
                      {msg.executiveName.replace('AI ', '').slice(0, 2)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{msg.executiveName}</h4>
                      <p style={{ margin: 0, fontSize: 11, color: t.textFaint }}>{msg.executiveRole}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 10.5, color: t.textFaint }}>{msg.timestamp}</span>
                </div>

                <p style={{ margin: 0, fontSize: 12.5, color: t.textSub, lineHeight: 1.5, borderLeft: `3px solid ${t.accent}`, paddingLeft: 12 }}>
                  "{msg.content}"
                </p>

                {msg.dataReferences && msg.dataReferences.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
                    {msg.dataReferences.map((ref, idx) => (
                      <div key={idx} style={{ padding: '4px 10px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 11 }}>
                        <span style={{ color: t.textSub }}>{ref.label}: </span>
                        <strong style={{ color: t.accent }}>{ref.value}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Strategic Decision & Conclusion (Dark Card for Contrast) */}
          <div
            style={{
              background: t.dark,
              color: t.darkText,
              borderRadius: 28,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={20} color={t.accent} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.darkText, fontFamily: "'Manrope', sans-serif" }}>
                {currentTopic.finalConclusion.title}
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: 12.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              {currentTopic.finalConclusion.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {currentTopic.finalConclusion.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: 16,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: t.accent, display: 'block' }}>
                      LEAD: {rec.leadExecutive}
                    </span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Manrope', sans-serif" }}>{rec.title}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
                      Impact: <strong style={{ color: t.ok }}>{rec.expectedImpact}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(rec.actionRoute)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      background: t.accent,
                      color: '#ffffff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    <span>{rec.actionText}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
