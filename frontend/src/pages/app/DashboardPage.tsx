import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ShoppingCart,
  Users,
  Wallet,
  FileText,
  ChevronRight,
  ArrowUpRight,
  Bot,
  Package,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  getDashboardKPIs, getAIInsights, getAIRecommendations, 
  getProfitForecast, getCashflowForecast, getRetentionOverview,
  type DashboardKPIs 
} from '../../api/ai';
import { formatCurrency, formatPct, formatNumber } from '../../lib/formatters';
import type { AIInsightResponse, AIRecommendationResponse } from '../../types/ai';

function BentoCard({ children, style, dark = false, className = '', onClick }: { children: React.ReactNode; style?: React.CSSProperties; dark?: boolean; className?: string; onClick?: () => void }) {
  const { tokens: t } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        background: dark ? t.dark : t.card,
        color: dark ? t.darkText : t.text,
        borderRadius: 28,
        border: dark ? 'none' : `1px solid ${t.border}`,
        padding: 22,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        ...style,
      }}
      className={`hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, ariaLabel, filled }: { children: React.ReactNode; onClick?: () => void; ariaLabel: string; filled?: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: `1px solid ${t.border}`,
        background: filled ? t.dark : t.card,
        color: filled ? t.darkText : t.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'transform 0.15s ease, background 0.15s ease',
      }}
      className="hover:scale-110"
    >
      {children}
    </button>
  );
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tokens: t } = useTheme();
  const navigate = useNavigate();

  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [profitForecast, setProfitForecast] = useState<any>(null);
  const [cashflowForecast, setCashflowForecast] = useState<any>(null);
  const [retentionOverview, setRetentionOverview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiRes, insRes, recRes, profRes, cfRes, retRes] = await Promise.all([
        getDashboardKPIs().catch(() => null),
        getAIInsights().catch(() => null),
        getAIRecommendations().catch(() => null),
        getProfitForecast().catch(() => null),
        getCashflowForecast().catch(() => null),
        getRetentionOverview().catch(() => null),
      ]);
      setKpis(kpiRes);
      setInsights(insRes);
      setRecommendations(recRes);
      setProfitForecast(profRes);
      setCashflowForecast(cfRes);
      setRetentionOverview(retRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statPills = [
    { label: '30D Revenue', value: kpis ? formatCurrency(kpis.sales_last_30_days) : '...' },
    { label: '30D Purchases', value: kpis ? formatCurrency(kpis.purchases_last_30_days) : '...' },
    { label: 'Predicted Profit', value: profitForecast?.predicted_profit ? formatCurrency(profitForecast.predicted_profit) : '...' },
    { label: 'Predicted Cash', value: cashflowForecast?.predicted_cash ? formatCurrency(cashflowForecast.predicted_cash) : '...' },
  ];

  const bigStats = [
    { icon: Users, value: retentionOverview ? formatNumber(retentionOverview.total_customers) : '50', label: 'Active Customers' },
    { icon: ShoppingCart, value: kpis ? formatNumber(kpis.total_active_products) : '140', label: 'Product SKUs' },
    { icon: Brain, value: insights ? insights.priority : 'NORMAL', label: 'AI Priority' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Header: Greeting + Stat Pills + Big Numbers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: -1, color: t.text }}>
              Good morning, {user?.name.split(' ')[0] || 'Executive'}
            </h1>
            <button
              onClick={fetchDashboardData}
              style={{ background: 'transparent', border: 'none', color: t.textSub, cursor: 'pointer' }}
              title="Refresh Telemetry"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {statPills.map((s) => (
              <div key={s.label} className="group cursor-pointer">
                <div style={{ fontSize: 11.5, color: t.textSub, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: `1px solid ${t.border}`,
                    background: t.card,
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: "'Manrope', sans-serif",
                    color: t.accent,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {bigStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="group cursor-pointer">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: t.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} color={t.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Manrope', sans-serif", lineHeight: 1, color: t.text }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bento 4x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hero AI CFO */}
        <BentoCard
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `linear-gradient(160deg, ${t.heroFrom}, ${t.heroTo})`,
            border: 'none',
            minHeight: 260,
          }}
          className="cursor-pointer"
          onClick={() => navigate('/app/finance')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent }}>AI EXECUTIVE</span>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color={t.accent} />
            </div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
            <Brain size={26} color="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: t.text }}>AI CFO</div>
              <div style={{ fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
                {profitForecast ? `Profit Risk: ${profitForecast.risk_level}` : 'Financial Telemetry'}
              </div>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: 999, background: t.card, fontSize: 12.5, fontWeight: 700, color: t.text }}>
              {profitForecast?.predicted_profit ? formatCurrency(profitForecast.predicted_profit) : '...'}
            </div>
          </div>
        </BentoCard>

        {/* Card 2: 30D Sales Revenue */}
        <BentoCard style={{ minHeight: 260, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>30D Sales Revenue</div>
            <IconBtn ariaLabel="Open" onClick={() => navigate('/app/finance')}>
              <ArrowUpRight size={14} color={t.textSub} />
            </IconBtn>
          </div>
          <div style={{ margin: '16px 0 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
              {kpis ? formatCurrency(kpis.sales_last_30_days) : '...'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginBottom: 16 }}>PostgreSQL Live Register</div>
          <div style={{ marginTop: 'auto', background: t.accentSoft, padding: 10, borderRadius: 14, fontSize: 11.5, color: t.accent }}>
            Purchases 30D: {kpis ? formatCurrency(kpis.purchases_last_30_days) : '...'}
          </div>
        </BentoCard>

        {/* Card 3: Customer Churn Intelligence */}
        <BentoCard style={{ minHeight: 260, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Customer Retention</div>
            <IconBtn ariaLabel="Open" onClick={() => navigate('/app/customers')}>
              <ArrowUpRight size={14} color={t.textSub} />
            </IconBtn>
          </div>
          <div style={{ margin: '16px 0 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: retentionOverview?.high_risk_count > 0 ? '#EF4444' : t.text }}>
              {retentionOverview ? `${retentionOverview.high_risk_count} High Risk` : '...'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginBottom: 16 }}>
            Overall Churn: {retentionOverview ? `${retentionOverview.overall_churn_rate_pct}%` : '...'}
          </div>
          <div style={{ marginTop: 'auto', background: t.accentSoft, padding: 10, borderRadius: 14, fontSize: 11.5, color: t.accent }}>
            {retentionOverview?.high_risk_customers?.[0] ? `Top Risk: ${retentionOverview.high_risk_customers[0].customer_name}` : 'Random Forest Model v1.0 Active'}
          </div>
        </BentoCard>

        {/* Card 4: Cashflow Risk */}
        <BentoCard style={{ minHeight: 260, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Cashflow Forecast</div>
            <IconBtn ariaLabel="Open" onClick={() => navigate('/app/cashflow')}>
              <ArrowUpRight size={14} color={t.textSub} />
            </IconBtn>
          </div>
          <div style={{ margin: '16px 0 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>
              {cashflowForecast?.predicted_cash ? formatCurrency(cashflowForecast.predicted_cash) : '...'}
            </span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginBottom: 16 }}>
            Risk Level: {cashflowForecast?.risk_level || 'Normal'}
          </div>
          <div style={{ marginTop: 'auto', background: t.accentSoft, padding: 10, borderRadius: 14, fontSize: 11.5, color: t.accent }}>
            Safety Threshold: ₹4.0 Cr
          </div>
        </BentoCard>
      </div>

      {/* Prioritized AI Recommendations Section */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent }}>ACTIONABLE INTELLIGENCE</span>
            <h3 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 800, color: t.text }}>Prioritized AI Recommendations</h3>
          </div>
          <button onClick={() => navigate('/app/reports')} style={{ fontSize: 12, fontWeight: 600, color: t.accent, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            View All ({recommendations?.total_count || 0})
          </button>
        </div>

        {recommendations?.recommendations && recommendations.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: rec.priority === 'HIGH' || rec.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : t.accentSoft, color: rec.priority === 'HIGH' || rec.priority === 'CRITICAL' ? '#EF4444' : t.accent }}>
                    {rec.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: 10, color: t.textFaint }}>{rec.source}</span>
                </div>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: t.text, margin: '2px 0' }}>{rec.title}</h4>
                <p style={{ fontSize: 12, color: t.textSub, margin: 0, lineHeight: 1.4 }}>{rec.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 20, textAlign: 'center', color: t.textSub, fontSize: 13 }}>
            No immediate high-priority AI recommendations.
          </div>
        )}
      </div>
    </div>
  );
};
