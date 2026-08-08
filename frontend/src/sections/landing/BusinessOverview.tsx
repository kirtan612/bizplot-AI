import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { MetricGroup } from '../../components/MetricGroup';
import { BusinessChart } from '../../components/BusinessChart';
import { ProductWindow } from '../../components/ProductWindow';
import { fadeInUp } from '../../lib/animations';

export const BusinessOverview: React.FC = () => {
  const revenueTrend = [
    { label: 'Q1 25', value: 18.4 },
    { label: 'Q2 25', value: 20.1 },
    { label: 'Q3 25', value: 21.8 },
    { label: 'Q4 25', value: 23.2 },
    { label: 'Q1 26', value: 24.8 },
  ];

  const profitTrend = [
    { label: 'Q1 25', value: 2.85 },
    { label: 'Q2 25', value: 3.10 },
    { label: 'Q3 25', value: 3.25 },
    { label: 'Q4 25', value: 3.38 },
    { label: 'Q1 26', value: 3.42 },
  ];

  const recentActivity = [
    { type: 'Sales Invoice', title: 'APL Apollo Pipes (65 MT)', amount: '₹38.4 L', status: 'Completed', time: '12m ago' },
    { type: 'Payment In', title: 'Patel Industrial Corp', amount: '₹14.2 L', status: 'Cleared', time: '42m ago' },
    { type: 'Purchase Order', title: 'Hi-Tech Steel Tubes', amount: '₹52.0 L', status: 'In Transit', time: '2h ago' },
    { type: 'GST Return', title: 'GSTR-1 Recalculated', amount: '₹6.8 L Tax', status: 'Filed', time: '5h ago' },
  ];

  return (
    <section id="business-overview" className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            EXECUTIVE CONTROL CENTER
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            SEE YOUR BUSINESS.
            <br />
            <span className="text-gradient">IN ONE PLACE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            A unified financial and operational command center replacing disconnected spreadsheets with real-time Indian accounting metrics.
          </p>
        </motion.div>

        {/* Dashboard Showcase Window */}
        <ProductWindow title="BizPilot AI — Enterprise Overview (Realtime Master)">
          <div className="space-y-6">
            {/* KPI Strip */}
            <MetricGroup
              columns={4}
              metrics={[
                { label: 'Revenue', value: 24.8, suffix: ' Cr', change: 8.4, changeLabel: 'YoY Growth', status: 'healthy', statusText: 'STABLE' },
                { label: 'Gross Profit', value: 3.42, suffix: ' Cr', change: 5.8, changeLabel: 'YoY Growth', status: 'healthy', statusText: 'STABLE' },
                { label: 'Operating Cost', value: 1.86, suffix: ' Cr', change: 3.2, changeLabel: 'YoY Growth', status: 'neutral', statusText: 'CONTROLLED' },
                { label: 'Cash Position', value: 4.72, suffix: ' Cr', change: 11.4, changeLabel: 'Buffer', status: 'healthy', statusText: 'HEALTHY' },
              ]}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BusinessChart
                title="Revenue Acceleration (₹ Cr)"
                subtitle="Quarterly trajectory over 5 billing cycles"
                data={revenueTrend}
                type="area"
                height={200}
              />
              <BusinessChart
                title="Gross Profit Margin Development (₹ Cr)"
                subtitle="Net gross margin before operational overheads"
                data={profitTrend}
                type="bar"
                height={200}
              />
            </div>

            {/* Bottom Row: Activity Feed + AI Synthesis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-neutral-400" />
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      LIVE ENTERPRISE TRANSACTION FEED
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">AUTO SYNC ON</span>
                </div>

                <div className="divide-y divide-[#1A1A1A]">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-500 font-mono text-[10px] uppercase block">{act.type}</span>
                        <span className="text-white font-semibold">{act.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-mono font-bold block">{act.amount}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-5 rounded-xl bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-[#282828] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                      AI CORE SYNTHESIS
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Revenue is growing faster than gross profit.
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Primary operational concern: <strong className="text-white">Margin Compression</strong>. Volume has expanded by 14%, but raw material cost escalation has eaten 2.6% of gross margin.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#222222]">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                    AI STRATEGY
                  </span>
                  <span className="text-xs text-white font-semibold block">
                    Adjust minimum order quantity (MOQ) pricing structure for Q3.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ProductWindow>
      </div>
    </section>
  );
};
