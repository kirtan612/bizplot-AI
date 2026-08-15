import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, ShieldCheck, RefreshCw, AlertTriangle, Cpu, Wallet } from 'lucide-react';
import { getCashflowForecast, getCashflowRisk } from '../../api/ai';
import { formatCurrency, formatPct } from '../../lib/formatters';
import type { CashflowForecastResponse, CashflowRiskResponse } from '../../types/ai';

export const CashflowPage: React.FC = () => {
  const { tokens: t } = useTheme();

  const [forecast, setForecast] = useState<CashflowForecastResponse | null>(null);
  const [risk, setRisk] = useState<CashflowRiskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fcData, rData] = await Promise.all([
        getCashflowForecast(),
        getCashflowRisk()
      ]);
      setForecast(fcData);
      setRisk(rData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load cashflow liquidity forecast.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', fontFamily: "'Inter', sans-serif" }}>
      {/* Header Banner */}
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
              <TrendingUp size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              CASH FLOW & LIQUIDITY TELEMETRY
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Cash Flow Forecasting & Liquidity Buffer
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Predictive liquidity models, incoming receivables pacing, and bank buffer deficit limits.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={fetchData}
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

          {forecast && forecast.status === 'SUCCESS' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: forecast.risk_level === 'CRITICAL' || forecast.risk_level === 'HIGH' ? '#EF4444' : t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
              <ShieldCheck size={16} color={forecast.risk_level === 'CRITICAL' || forecast.risk_level === 'HIGH' ? '#EF4444' : t.ok} />
              <span>Liquidity Status: {forecast.risk_level} RISK</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 40, textAlign: 'center', color: t.textSub }}>
          <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
          <span>Executing Phase 3 Cashflow Risk Regressor on PostgreSQL cashbook...</span>
        </div>
      ) : error ? (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 24, padding: 30, color: '#991B1B', textAlign: 'center' }}>
          <AlertTriangle className="mx-auto mb-2" size={24} />
          <strong>Cashflow Forecast Unavailable</strong>
          <p style={{ margin: '4px 0 12px', fontSize: 12 }}>{error}</p>
          <button onClick={fetchData} style={{ padding: '6px 16px', background: '#991B1B', color: '#FFF', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            Retry
          </button>
        </div>
      ) : forecast && forecast.status === 'INSUFFICIENT_DATA' ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 28, padding: 40, textAlign: 'center', color: t.textSub }}>
          <Cpu size={32} className="mx-auto mb-2" color={t.accent} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: '8px 0 4px' }}>Insufficient Cashbook History</h3>
          <p style={{ fontSize: 13, maxWidth: 500, margin: '0 auto' }}>
            Not enough historical cashbook voucher transactions to generate a reliable liquidity forecast. Please record voucher payments and receipts in PostgreSQL.
          </p>
        </div>
      ) : forecast ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Cashflow Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <span style={{ fontSize: 12, color: t.textSub }}>Current Net Cash Position</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginTop: 4 }}>{formatCurrency(forecast.current_cash)}</div>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <span style={{ fontSize: 12, color: t.textSub }}>Predicted Future Cash</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.accent, marginTop: 4 }}>{formatCurrency(forecast.predicted_cash)}</div>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <span style={{ fontSize: 12, color: t.textSub }}>Projected Safety Deficit</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: risk && risk.projected_deficit > 0 ? '#EF4444' : '#10B981', marginTop: 4 }}>
                {risk ? formatCurrency(risk.projected_deficit) : '₹0'}
              </div>
            </div>

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20 }}>
              <span style={{ fontSize: 12, color: t.textSub }}>Configured Minimum Safety Buffer</span>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginTop: 6 }}>{formatCurrency(forecast.min_cash_threshold)}</div>
            </div>
          </div>

          {/* Drivers & Working Capital Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drivers */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 24, padding: 22 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14 }}>Model-Important Liquidity Drivers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {forecast.top_drivers.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: t.text }}>{d.feature}</span>
                    <span style={{ color: t.accent, fontWeight: 700 }}>Weight: {(d.importance * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 24, padding: 22 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14 }}>Actionable Working Capital Measures</h3>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: t.textSub, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {forecast.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Footer */}
          <div style={{ fontSize: 11.5, color: t.textFaint, textAlign: 'right' }}>
            Forecast powered by {forecast.model.name} v{forecast.model.version} ({forecast.model.algorithm})
          </div>
        </div>
      ) : null}
    </div>
  );
};
