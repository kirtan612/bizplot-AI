import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Users, ShieldCheck, AlertTriangle, RefreshCw, X, ArrowUpRight, Cpu } from 'lucide-react';
import { getRetentionOverview, getRetentionCustomers, getRetentionCustomerDetail } from '../../api/ai';
import type { RetentionOverviewResponse, RetentionPredictionResponse } from '../../types/ai';

export const CustomersPage: React.FC = () => {
  const { tokens: t } = useTheme();
  
  const [overview, setOverview] = useState<RetentionOverviewResponse | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);
  const [custDetail, setCustDetail] = useState<RetentionPredictionResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovData, custsData] = await Promise.all([
        getRetentionOverview(),
        getRetentionCustomers(1, 50)
      ]);
      setOverview(ovData);
      setCustomers(custsData.items || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load customer retention intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (custId: string) => {
    setSelectedCustId(custId);
    setDetailLoading(true);
    setCustDetail(null);
    try {
      const detail = await getRetentionCustomerDetail(custId);
      setCustDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (filterRisk === 'ALL') return true;
    return c.risk_level === filterRisk;
  });

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
              <Users size={16} color={t.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: t.accent, fontFamily: "'Inter', sans-serif" }}>
              CUSTOMER INTELLIGENCE
            </span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: t.text, fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 }}>
            Customer Accounts & Retention
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: t.textSub }}>
            Order gap acceleration, churn probability, and distributor credit telemetry.
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: t.accentSoft, border: `1px solid ${t.border}`, fontSize: 12.5, color: t.ok, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>
            <ShieldCheck size={16} color={t.ok} />
            <span>{overview ? `${overview.total_customers} Active Accounts` : 'Active Accounts'}</span>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>Total Portfolio Accounts</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.text, marginTop: 4 }}>{overview.total_customers}</div>
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>High Churn Risk</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#EF4444', marginTop: 4 }}>{overview.high_risk_count}</div>
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>Medium Churn Risk</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B', marginTop: 4 }}>{overview.medium_risk_count}</div>
          </div>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 20, padding: 18 }}>
            <span style={{ fontSize: 12, color: t.textSub }}>Portfolio Churn Rate</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.accent, marginTop: 4 }}>{overview.overall_churn_rate_pct}%</div>
          </div>
        </div>
      )}

      {/* Customer Health Table Card */}
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 28,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${t.border}` }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
            Account Health Telemetry
          </h3>

          {/* Risk Filter Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  border: `1px solid ${t.border}`,
                  background: filterRisk === risk ? t.accent : 'transparent',
                  color: filterRisk === risk ? '#000' : t.textSub,
                  cursor: 'pointer',
                }}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.textSub }}>
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <span>Running Phase 3 Random Forest inference on PostgreSQL telemetry...</span>
          </div>
        ) : error ? (
          <div style={{ padding: 30, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 16, color: '#991B1B', textAlign: 'center' }}>
            <AlertTriangle className="mx-auto mb-2" size={24} />
            <strong>Retention Telemetry Unavailable</strong>
            <p style={{ margin: '4px 0 12px', fontSize: 12 }}>{error}</p>
            <button
              onClick={fetchData}
              style={{ padding: '6px 16px', background: '#991B1B', color: '#FFF', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              Retry
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: t.textSub }}>
            No accounts match the selected risk filter ({filterRisk}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}`, color: t.textFaint }}>
                  <th className="pb-3 font-semibold">CUSTOMER ACCOUNT</th>
                  <th className="pb-3 font-semibold">CHURN PROBABILITY</th>
                  <th className="pb-3 font-semibold">RISK LEVEL</th>
                  <th className="pb-3 font-semibold">RECENCY (DAYS)</th>
                  <th className="pb-3 font-semibold text-right">INSPECT PREDICTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr key={cust.customer_id} style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td className="py-3.5">
                      <span style={{ fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif", display: 'block' }}>
                        {cust.customer_name}
                      </span>
                      <span style={{ fontSize: 11, color: t.textFaint }}>{cust.customer_code}</span>
                    </td>
                    <td className="py-3.5 font-bold font-mono">
                      {(cust.churn_probability * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5">
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          color: cust.risk_level === 'HIGH' ? '#EF4444' : (cust.risk_level === 'MEDIUM' ? '#F59E0B' : '#10B981'),
                          background: cust.risk_level === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : (cust.risk_level === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                        }}
                      >
                        {cust.risk_level} RISK
                      </span>
                    </td>
                    <td className="py-3.5" style={{ color: t.textSub }}>
                      {cust.days_since_last_purchase} Days
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenDetail(cust.customer_id)}
                        style={{
                          padding: '5px 14px',
                          borderRadius: 999,
                          background: t.accentSoft,
                          color: t.accent,
                          border: `1px solid ${t.border}`,
                          fontSize: 11.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span>Inspect Factors</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 24,
              padding: 24,
              maxWidth: 580,
              width: '100%',
              color: t.text,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
              <div>
                <span style={{ fontSize: 11, color: t.accent, fontWeight: 700 }}>AI PREDICTION DETAIL</span>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{custDetail ? custDetail.customer_name : 'Loading...'}</h2>
              </div>
              <button onClick={() => setSelectedCustId(null)} style={{ background: 'transparent', border: 'none', color: t.textSub, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {detailLoading ? (
              <div style={{ padding: 40, textAlign: 'center', color: t.textSub }}>
                <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                <span>Computing feature importances...</span>
              </div>
            ) : custDetail ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: t.accentSoft, padding: 14, borderRadius: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, color: t.textSub }}>Churn Risk Probability</span>
                    <div style={{ fontSize: 22, fontWeight: 800, color: custDetail.risk_level === 'HIGH' ? '#EF4444' : '#10B981' }}>
                      {(custDetail.churn_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: t.textSub }}>Risk Tier</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>{custDetail.risk_level} RISK</div>
                  </div>
                </div>

                {/* Model Important Factors */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: t.text }}>Model-Important Factors</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {custDetail.top_factors.map((f, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, fontSize: 12 }}>
                        <span style={{ color: t.textSub }}>{f.feature}</span>
                        <span style={{ fontWeight: 700, color: t.text }}>{f.value} (Impact: {(f.importance * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deterministic Recommendations */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: t.text }}>Actionable Recommendations</h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: t.textSub, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {custDetail.recommendation.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Model Metadata */}
                <div style={{ fontSize: 11, color: t.textFaint, textAlign: 'right', borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>
                  Powered by {custDetail.model.name} v{custDetail.model.version} ({custDetail.model.algorithm})
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
