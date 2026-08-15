import React, { useState, useEffect } from 'react';
import {
  UsersRound,
  Building2,
  DollarSign,
  BriefcaseBusiness,
  ShoppingCart,
  Truck,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Play
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getLatestExecutiveMeeting, runExecutiveMeeting } from '../../api/ai';
import type { ExecutiveMeetingResponse } from '../../types/ai';

export const ExecutiveRoomPage: React.FC = () => {
  const { tokens: t } = useTheme();
  
  const [meeting, setMeeting] = useState<ExecutiveMeetingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);

  const fetchMeeting = async () => {
    setLoading(true);
    try {
      const data = await getLatestExecutiveMeeting();
      setMeeting(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewMeeting = async () => {
    setRunning(true);
    try {
      const data = await runExecutiveMeeting();
      setMeeting(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, []);

  const getExecIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case 'CEO': return Building2;
      case 'CFO': return DollarSign;
      case 'COO': return BriefcaseBusiness;
      case 'CMO': return ShoppingCart;
      default: return Building2;
    }
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
            Executive Boardroom Collaboration
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            AI CFO, COO, CMO, and CEO collaborate to synthesize financial, operational, and customer risk.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleStartNewMeeting}
            disabled={running}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 999,
              background: t.accent,
              color: '#000',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: running ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(207, 158, 255, 0.3)'
            }}
          >
            {running ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
            <span>{running ? 'Synthesizing Boardroom...' : 'Start Boardroom Session'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 40, textAlign: 'center', color: t.textSub }}>
          <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
          <span>Collecting executive telemetry for boardroom session...</span>
        </div>
      ) : meeting ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Boardroom Chat Log & Dialogue */}
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${t.border}` }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.accent }}>BOARDROOM DIALOGUE LOG</span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.text }}>Session #{meeting.meeting_id}</h3>
                </div>
                <span style={{ fontSize: 11, color: t.textFaint }}>{meeting.started_at}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {meeting.messages.map((msg, i) => {
                  const Icon = getExecIcon(msg.from_executive);
                  const isCEO = msg.from_executive === 'CEO';
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, background: isCEO ? t.accentSoft : t.card, border: `1px solid ${t.border}`, padding: 14, borderRadius: 18 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: isCEO ? t.accent : t.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={isCEO ? '#000' : t.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: t.text }}>AI {msg.from_executive}</span>
                          <span style={{ fontSize: 10, color: t.textFaint }}>{msg.timestamp}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 12.5, color: t.textSub, lineHeight: 1.5 }}>{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Strategic Decisions & Action Owner Assignments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="lg:col-span-1">
            {/* CEO Strategic Decisions */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Sparkles size={18} color={t.accent} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.text }}>CEO Strategic Decisions</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meeting.decisions.map((dec, idx) => (
                  <div key={idx} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
                      {dec.priority} PRIORITY
                    </span>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: '6px 0 2px' }}>{dec.decision}</h4>
                    <p style={{ fontSize: 11.5, color: t.textSub, margin: 0 }}>{dec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Executive Action Items */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 22 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: t.text }}>Assigned Executive Actions</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meeting.actions.map((act, idx) => (
                  <div key={idx} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} color={t.ok} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: t.accent }}>OWNER: AI {act.owner}</span>
                      <p style={{ fontSize: 12, color: t.text, margin: '2px 0 4px', fontWeight: 600 }}>{act.action}</p>
                      <span style={{ fontSize: 10, color: t.textFaint }}>Timeline: {act.target_timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
