import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Package,
  Activity,
  Bot,
  Terminal,
  ArrowUpRight,
  Zap
} from 'lucide-react';

export default function DashboardPreview({ onGetStarted }) {
  const [activeTab, setActiveTab] = useState('executive');
  const [timeRange, setTimeRange] = useState('30D');

  const liveKpis = [
    { label: 'Total Net Revenue', value: '$482,910.00', change: '+18.4%' },
    { label: 'Operating Margin', value: '28.6%', change: '+4.2%' },
    { label: 'Available Runway', value: '4.8 Months', change: '+1.2Mo' },
    { label: 'Active Inventory Turnover', value: '8.4x', change: '+2.1x' },
  ];

  const consoleLogs = [
    '[09:42:15] AI CFO: Cashflow stress-test passed. 90-day buffer optimal.',
    '[09:40:02] AI COO: Inventory stockout risk eliminated for SKU-809.',
    '[09:38:44] SYSTEM: PostgreSQL ledger sync verified (14,890 records).',
    '[09:35:10] AI SALES: Account #408 volume incentive playbook queued.'
  ];

  return (
    <section id="dashboard-preview" className="py-32 bg-[#0c0c0f] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
            <Zap className="w-3.5 h-3.5" />
            LIVE INTERACTIVE PREVIEW
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Experience the BizPilot AI{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Command Center.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Test drive our production-grade interactive React interface below. Every metric, chart, and alert is updated live in real time.
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="bg-[#121215] border border-white/10 rounded-[20px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)] max-w-6xl mx-auto">
          {/* Top Bar Header */}
          <div className="bg-[#0d0d0f] border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                VIEW:
              </span>
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                {[
                  { id: 'executive', label: 'Executive Overview' },
                  { id: 'financial', label: 'Financial Health' },
                  { id: 'inventory', label: 'Inventory Velocity' },
                  { id: 'console', label: 'AI Console' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-500">RANGE:</span>
              {['7D', '30D', '90D', 'YTD'].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-md cursor-pointer ${
                    timeRange === r
                      ? 'bg-zinc-800 text-blue-400 border border-blue-500/30'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Body Content */}
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveKpis.map((kpi) => (
                <div key={kpi.label} className="p-5 rounded-xl bg-zinc-900/60 border border-white/[0.08]">
                  <span className="text-xs text-zinc-400">{kpi.label}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white">{kpi.value}</span>
                    <span className="text-xs font-mono text-emerald-400 font-medium flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'executive' && (
                <motion.div
                  key="executive"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  <div className="lg:col-span-8 p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white font-sans">
                          Gross Revenue vs Operating Expenses ({timeRange})
                        </h4>
                        <p className="text-xs text-zinc-400">Streamed from PostgreSQL Enterprise persistence engine</p>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                        AUTO-UPDATED 1S AGO
                      </span>
                    </div>

                    <div className="h-48 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130">
                        <defs>
                          <linearGradient id="dashExecGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" />
                        <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(255,255,255,0.05)" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" />

                        <path
                          d="M 0 110 C 60 80, 120 40, 180 60 C 240 80, 300 20, 360 40 C 420 60, 460 15, 500 20 L 500 130 L 0 130 Z"
                          fill="url(#dashExecGrad)"
                        />
                        <path
                          d="M 0 110 C 60 80, 120 40, 180 60 C 240 80, 300 20, 360 40 C 420 60, 460 15, 500 20"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                        />
                        <path
                          d="M 0 120 C 60 100, 120 70, 180 90 C 240 100, 300 50, 360 70 C 420 80, 460 45, 500 50"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </svg>

                      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2">
                        <span>WK 1</span>
                        <span>WK 2</span>
                        <span>WK 3</span>
                        <span>WK 4</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-6 rounded-xl bg-[#08080a] border border-white/[0.08] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 mb-4">
                        <Terminal className="w-4 h-4" />
                        AI EXECUTIVE TELEMETRY
                      </div>

                      <div className="space-y-3 font-mono text-[11px]">
                        {consoleLogs.map((log, idx) => (
                          <div key={idx} className="text-zinc-400 border-l border-blue-500/30 pl-2.5 py-0.5">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={onGetStarted}
                      className="mt-6 w-full h-10 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Open Live Dashboard
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div
                  key="financial"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-4"
                >
                  <h4 className="text-sm font-semibold text-white">90-Day Forward Cashflow Stress Simulation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="p-4 bg-zinc-900 rounded-xl">
                      <span className="text-xs text-zinc-500">OPTIMISTIC SCENARIO</span>
                      <div className="text-lg text-emerald-400 font-bold">$342,000</div>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-xl">
                      <span className="text-xs text-zinc-500">BASE CASE</span>
                      <div className="text-lg text-blue-400 font-bold">$284,500</div>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-xl">
                      <span className="text-xs text-zinc-500">CONSERVATIVE CASE</span>
                      <div className="text-lg text-amber-400 font-bold">$210,000</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-4"
                >
                  <h4 className="text-sm font-semibold text-white">Top Inventory Velocity & Stock Status</h4>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
                      <span className="text-white">SKU-809 High-Grade Polymer</span>
                      <span className="text-emerald-400 font-bold">1,240 Units (In Stock)</span>
                    </div>
                    <div className="p-4 bg-zinc-900 rounded-xl flex items-center justify-between">
                      <span className="text-white">SKU-402 Industrial Steel Sheets</span>
                      <span className="text-amber-400 font-bold">45 Units (Re-Order Triggered)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'console' && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-xl bg-[#040406] border border-white/10 font-mono text-xs text-blue-300 space-y-2"
                >
                  <div>bizpilot-ai-engine v2.4.0 (x86_64-pc-windows-msvc)</div>
                  <div className="text-zinc-500">Type 'help' or select an AI executive to run natural language SQL commands...</div>
                  <div className="text-emerald-400">&gt; Query: SHOW TOP PROFIT SKUs FOR Q2</div>
                  <div className="text-zinc-300">SKU-809: 44.2% Net Margin | Revenue: $184,200 | Velocity: 9.2x</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
