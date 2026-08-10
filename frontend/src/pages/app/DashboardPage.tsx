import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, DollarSign, Wallet, Users, AlertTriangle } from 'lucide-react';
import { MetricGroup } from '../../components/MetricGroup';
import { BusinessChart } from '../../components/BusinessChart';
import { useAuth } from '../../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, organization, role, hasPermission } = useAuth();

  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F0D18] via-[#0A0A0A] to-[#0D121B] border border-[#252033] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono font-bold uppercase">
              ACTIVE WORKSPACE
            </span>
            <span className="text-xs font-mono text-neutral-400">{organization?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Authenticated with <span className="text-cyan-400 font-bold">{role?.name}</span> permissions. Multi-tenant telemetry synced with live ledgers.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#121212] border border-[#242424] text-xs font-mono text-cyan-400 font-bold shrink-0">
          FY 2025-26 Live Cycle
        </div>
      </div>

      {/* KPI Metrics */}
      <MetricGroup
        columns={4}
        metrics={[
          { label: 'Total Revenue', value: 24.8, suffix: ' Cr', change: 8.4, status: 'healthy', statusText: 'RECORD HIGH' },
          { label: 'Gross Margin', value: 3.42, suffix: ' Cr', change: 5.8, status: 'healthy', statusText: 'STABLE' },
          { label: 'Treasury Cashflow', value: 1.86, suffix: ' Cr', change: -2.1, status: 'warning', statusText: 'BUFFER NEEDED' },
          { label: 'Customer Retention', value: 87.4, prefix: '', suffix: '%', change: 1.2, status: 'healthy', statusText: 'EXCELLENT' },
        ]}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BusinessChart
            title="Revenue Acceleration Trajectory (H1 FY26)"
            subtitle="Actual vs AI Projections (Values in ₹ Crore)"
            data={[
              { label: 'Jan', value: 18.2, change: 4.2 },
              { label: 'Feb', value: 19.8, change: 8.7 },
              { label: 'Mar', value: 21.4, change: 8.0 },
              { label: 'Apr', value: 22.1, change: 3.2 },
              { label: 'May', value: 23.5, change: 6.3 },
              { label: 'Jun', value: 24.8, change: 8.4 },
            ]}
            type="area"
            colorTheme="purple"
            height={220}
          />
        </div>

        {/* AI Insight Box */}
        <div className="p-5 rounded-xl bg-[#0D0B14] border border-[#252033] flex flex-col justify-between space-y-4">
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>AI EXECUTIVE ALERT</span>
              </span>
              <span className="text-[9px] text-neutral-500">REALTIME</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug">Profit margin pressure detected.</h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Raw material costs (GI Pipe Sheets) increased <span className="text-white font-bold">12.4%</span> over the last purchasing cycle while average customer discount rose by 1.8%.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#141221] border border-[#2D263B] space-y-1">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              CFO RECOMMENDATION
            </span>
            <p className="text-xs font-semibold text-white">
              Re-index pricing tiers for Tier-2 distributors before Q3 orders lock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
