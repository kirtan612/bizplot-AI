import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  BriefcaseBusiness,
  TrendingUp,
  Bot,
  UsersRound,
  Shield,
  Truck,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
  Sparkles,
  Send,
  Lightbulb,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { MOCK_AI_EXECUTIVES } from '../../mock/executiveData';
import { ExecutiveStatusBadge } from '../../components/dashboard/ExecutiveCard';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  DollarSign,
  BriefcaseBusiness,
  TrendingUp,
  Bot,
  UsersRound,
  Shield,
  Truck,
  ShoppingCart,
  BarChart3,
};

export const ExecutiveWorkspacePage: React.FC = () => {
  const { executiveId } = useParams<{ executiveId: string }>();
  const navigate = useNavigate();
  const { tokens: t } = useTheme();
  const [queryInput, setQueryInput] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; text: string; time: string }[]>([]);

  const targetExec = MOCK_AI_EXECUTIVES.find(
    (e) => e.id === `ai-${executiveId}` || e.route === `/app/ai/${executiveId}` || e.code.toLowerCase() === executiveId?.toLowerCase()
  ) || MOCK_AI_EXECUTIVES[0];

  const IconComp = ICON_MAP[targetExec.iconName] || Bot;

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    const userMsg = { sender: 'You', text: queryInput, time: 'Just now' };
    setChatLog((prev) => [...prev, userMsg]);
    const currentInput = queryInput;
    setQueryInput('');

    setTimeout(() => {
      const responseMsg = {
        sender: targetExec.name,
        text: `Executing domain analysis for query: "${currentInput}". Telemetry indicates healthy baseline, recommending 2-stage verification.`,
        time: 'Just now',
      };
      setChatLog((prev) => [...prev, responseMsg]);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Back Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
        <button
          onClick={() => navigate('/app/executives')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: t.textSub,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to AI Executive Center</span>
        </button>

        <span style={{ fontSize: 12, color: t.textFaint }}>
          Workspace • <strong style={{ color: t.accent }}>{targetExec.code}</strong>
        </span>
      </div>

      {/* Executive Workspace Banner */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 24,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: 20,
        }}
        className="flex-col lg:flex-row"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              background: t.accent,
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            <IconComp size={26} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                {targetExec.name}
              </h1>
              <ExecutiveStatusBadge status={targetExec.status} />
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: t.textFaint }}>
              {targetExec.role} • {targetExec.department}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: t.textSub, lineHeight: 1.5, maxWidth: 620 }}>
              {targetExec.description}
            </p>
          </div>
        </div>

        {/* Primary Metric Highlight */}
        <div
          style={{
            background: t.accentSoft,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: '14px 20px',
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: t.textSub, display: 'block' }}>
            {targetExec.primaryMetricLabel}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", display: 'block', margin: '2px 0' }}>
            {targetExec.primaryMetricValue}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: t.ok }}>
            {targetExec.primaryMetricChange}
          </span>
        </div>
      </div>

      {/* Domain Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {targetExec.domainMetrics.map((dm, i) => (
          <div
            key={i}
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 12, color: t.textSub, fontWeight: 500 }}>{dm.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{dm.value}</span>
              {dm.change && (
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: t.accentSoft, color: t.accent }}>
                  {dm.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostic Stream & Strategic Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Diagnostic Telemetry */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 28,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={15} color={t.accent} />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                Live Diagnostic Telemetry
              </h3>
            </div>
            <span style={{ fontSize: 11, color: t.textFaint }}>Updated 2m ago</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {targetExec.recentDiagnostic.map((diag, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  background: t.accentSoft,
                  border: `1px solid ${t.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: t.textFaint }}>{diag.timestamp}</span>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{diag.finding}</h4>
                <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>Impact: {diag.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 28,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lightbulb size={15} color={t.warn} />
              </div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
                Strategic Recommendations
              </h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.ok }}>Action Ready</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {targetExec.strategicOptions.map((opt, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  background: t.accentSoft,
                  border: `1px solid ${t.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>{opt.title}</h4>
                  <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: t.card, color: t.accent }}>
                    Risk: {opt.riskLevel}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: t.textSub, lineHeight: 1.45 }}>{opt.impact}</p>

                <button
                  style={{
                    alignSelf: 'flex-end',
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: t.dark,
                    color: t.darkText,
                    border: 'none',
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>Execute</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Prompt */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color={t.accent} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            Direct Executive Inquiry
          </h3>
        </div>

        {chatLog.length > 0 && (
          <div style={{ padding: 14, borderRadius: 18, background: t.accentSoft, display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
            {chatLog.map((msg, i) => (
              <div key={i} style={{ fontSize: 12.5, color: t.textSub }}>
                <strong style={{ color: t.text, fontFamily: "'Manrope', sans-serif" }}>{msg.sender}: </strong>
                {msg.text}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={`Ask ${targetExec.name} to analyze pricing, run scenario models, or check ledgers...`}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 999,
              background: t.accentSoft,
              border: `1px solid ${t.border}`,
              fontSize: 13,
              color: t.text,
              outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              background: t.dark,
              color: t.darkText,
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <Send size={13} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
