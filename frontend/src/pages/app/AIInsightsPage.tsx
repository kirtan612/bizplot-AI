import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, ShieldAlert, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getAIInsights, getAIRecommendations, getProfitForecast, getCashflowForecast } from '../../api/ai';
import { formatCurrency, formatPct } from '../../lib/formatters';
import type { AIInsightResponse, AIRecommendationResponse } from '../../types/ai';

export const AIInsightsPage: React.FC = () => {
  const { tokens: t } = useTheme();

  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [profitForecast, setProfitForecast] = useState<any>(null);
  const [cashflowForecast, setCashflowForecast] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      const [insRes, recRes, profRes, cfRes] = await Promise.all([
        getAIInsights().catch(() => null),
        getAIRecommendations().catch(() => null),
        getProfitForecast().catch(() => null),
        getCashflowForecast().catch(() => null),
      ]);
      setInsights(insRes);
      setRecommendations(recRes);
      setProfitForecast(profRes);
      setCashflowForecast(cfRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, []);

  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="pb-6 border-b border-[#1E1E1E] flex justify-between items-end">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold uppercase">
            AI PREDICTIVE TELEMETRY ENGINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Predictive AI Executive Intelligence
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Phase 3 ML model forecasts, customer churn signals, and deterministic executive recommendations.
          </p>
        </div>

        <button
          onClick={fetchInsightsData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 999,
            background: t.card,
            border: `1px solid ${t.border}`,
            color: t.textSub,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 24, padding: 40, textAlign: 'center', color: t.textSub }}>
          <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
          <span>Generating AI executive insights from live PostgreSQL telemetry...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: 'uppercase' }}>FINANCIAL PROFIT RISK</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: insights?.financial.profit_risk === 'CRITICAL' || insights?.financial.profit_risk === 'HIGH' ? '#EF4444' : t.text, marginTop: 4 }}>
                {insights ? insights.financial.profit_risk : 'N/A'} RISK
              </div>
              <div style={{ fontSize: 12, color: t.textSub, marginTop: 4 }}>
                Predicted Profit MoM: {formatPct(insights?.financial.predicted_profit_change_pct)}
              </div>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: 'uppercase' }}>CASHFLOW LIQUIDITY RISK</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: insights?.cashflow.risk === 'CRITICAL' || insights?.cashflow.risk === 'HIGH' ? '#EF4444' : t.text, marginTop: 4 }}>
                {insights ? insights.cashflow.risk : 'N/A'} RISK
              </div>
              <div style={{ fontSize: 12, color: t.textSub, marginTop: 4 }}>
                Predicted Cash MoM: {formatPct(insights?.cashflow.predicted_cash_change_pct)}
              </div>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: 'uppercase' }}>CUSTOMER RETENTION TELEMETRY</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: insights && insights.customers.high_churn_customers > 0 ? '#EF4444' : t.text, marginTop: 4 }}>
                {insights ? `${insights.customers.high_churn_customers} High Risk` : 'N/A'}
              </div>
              <div style={{ fontSize: 12, color: t.textSub, marginTop: 4 }}>
                Portfolio Churn Rate: {insights ? `${insights.customers.overall_churn_rate_pct}%` : '0%'}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations List */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 24, padding: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 16 }}>Prioritized Executive Directives</h3>

            {recommendations?.recommendations && recommendations.recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.recommendations.map((rec, i) => (
                  <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <CheckCircle2 size={16} color={t.accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: rec.priority === 'HIGH' || rec.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : t.accentSoft, color: rec.priority === 'HIGH' || rec.priority === 'CRITICAL' ? '#EF4444' : t.accent }}>
                          {rec.priority} PRIORITY • {rec.area}
                        </span>
                        <span style={{ fontSize: 10, color: t.textFaint }}>Source: {rec.source}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: '4px 0 2px' }}>{rec.title}</h4>
                      <p style={{ fontSize: 12.5, color: t.textSub, margin: 0 }}>{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: t.textSub }}>No active executive recommendations.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
