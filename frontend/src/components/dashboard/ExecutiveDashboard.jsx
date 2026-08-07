import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExecutiveHeader from './ExecutiveHeader';
import PrimaryKpiRow from './PrimaryKpiRow';
import AiInsightPanel from './AiInsightPanel';
import ActionCenterSection from './ActionCenterSection';
import FinanceOverviewSection from './FinanceOverviewSection';
import SalesOverviewSection from './SalesOverviewSection';
import InventoryOverviewSection from './InventoryOverviewSection';
import CustomerOverviewSection from './CustomerOverviewSection';
import BusinessTimelineSection from './BusinessTimelineSection';
import BusinessHealthSection from './BusinessHealthSection';
import AiBoardSummarySection from './AiBoardSummarySection';
import SmartAlertsSection from './SmartAlertsSection';
import { PageSkeleton } from '../../layouts/GlobalLoader/GlobalLoader';
import { fetchDashboardKPIs, fetchRecentActivity } from '../../services/dashboardApiService';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ExecutiveDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [activity, setActivity] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiRes, activityRes] = await Promise.all([
        fetchDashboardKPIs(),
        fetchRecentActivity(15)
      ]);
      setKpis(kpiRes);
      setActivity(activityRes);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error loading dashboard telemetry:', err);
      setError('Unable to fetch live backend telemetry. Reconnecting...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Telemetry Engine Connection Warning</h3>
        <p className="text-xs text-zinc-300">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-12"
    >
      {/* 1. Top Executive Control Section */}
      <ExecutiveHeader
        lastSyncTime={lastSyncTime}
        onRefresh={loadDashboardData}
        healthScore={kpis?.health_score || 91}
      />

      {/* 2. Heart of the Dashboard: AI Insight Panel */}
      <AiInsightPanel healthScore={kpis?.health_score || 91} />

      {/* 3. Primary Executive KPI Row (8 Metrics) */}
      <PrimaryKpiRow kpis={kpis} />

      {/* 4. Action Center Matrix (6 High-Impact Cards) */}
      <ActionCenterSection />

      {/* 5. Financial Overview Engine (Recharts Graphs) */}
      <FinanceOverviewSection />

      {/* 6. Multi-Dimension Business Health Scores */}
      <BusinessHealthSection overallScore={kpis?.health_score || 91} />

      {/* 7. AI Board Room Executive Briefing */}
      <AiBoardSummarySection />

      {/* 8. Sales & Customer Intelligence Overview */}
      <SalesOverviewSection />

      {/* 9. Inventory Intelligence Matrix */}
      <InventoryOverviewSection />

      {/* 10. Customer Intelligence & Credit Index */}
      <CustomerOverviewSection />

      {/* 11. Smart Alert Radar */}
      <SmartAlertsSection />

      {/* 12. Business Activity Chronological Timeline */}
      <BusinessTimelineSection activityFeed={activity} />
    </motion.div>
  );
}
