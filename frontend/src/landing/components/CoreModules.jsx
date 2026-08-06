import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Target,
  Package,
  Users,
  Users2,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function CoreModules({ onGetStarted }) {
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      id: 'finance',
      title: 'Finance Intelligence',
      subtitle: 'Cash runway, liquidity & working capital',
      icon: DollarSign,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      badge: 'LIQUIDITY GUARDRAIL',
      telemetry: '$284,500 Cash Reserve',
      impact: '+18.4% Runway Extension',
      description:
        'Continuous cash flow tracking with forward-looking liquidity stress-testing. Detect payment delays before they create working capital bottlenecks.',
      features: [
        'Automated 90-Day Liquidity Forecast',
        'Receivables Aging & Overdue Risk Scoring',
        'Working Capital Allocation Engine'
      ]
    },
    {
      id: 'profit',
      title: 'Profit Intelligence',
      subtitle: 'Micro-margin analysis per product & channel',
      icon: TrendingUp,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      badge: 'MARGIN PROTECTION',
      telemetry: '28.6% Gross Margin',
      impact: '+$18,400 Recovered / Qtr',
      description:
        'Audit raw material price inflation, freight surcharges, and channel fees down to individual SKUs to stop profit leakage.',
      features: [
        'SKU-Level Unit Economics Audit',
        'Supplier Freight Cost Overrun Flagging',
        'Channel Net Profitability Comparison'
      ]
    },
    {
      id: 'sales',
      title: 'Sales Intelligence',
      subtitle: 'Pipeline velocity & customer LTV optimization',
      icon: Target,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      badge: 'REVENUE VELOCITY',
      telemetry: '$482,910 Annualized',
      impact: '3.4x Deal Conversion Rate',
      description:
        'Scores deals by win probability, flags stalled accounts, and recommends automated follow-up strategies for sales reps.',
      features: [
        'Predictive Account Win Scoring',
        'Deal Stagnation Escalation Alerts',
        'Cross-Sell & Upsell Trigger Recommendations'
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory Intelligence',
      subtitle: 'Stockout prevention & deadstock liquidation',
      icon: Package,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      badge: 'STOCK VELOCITY',
      telemetry: '8.4x Inventory Turn',
      impact: '0% Stockout Incidents',
      description:
        'Dynamic reorder points based on seasonal trend curves. Identifies slow-moving SKUs before capital becomes trapped in deadstock.',
      features: [
        'Dynamic Seasonal Re-Order Points',
        'Deadstock Decay Horizon Warnings',
        'Supplier Lead-Time Variance Tracking'
      ]
    },
    {
      id: 'customer',
      title: 'Customer Intelligence',
      subtitle: 'Churn prediction & retention scoring',
      icon: Users,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      badge: 'RETENTION MATRIX',
      telemetry: '94.2% Account Health',
      impact: '-42% Annual Churn Rate',
      description:
        'Tracks re-order intervals and account activity drops to alert account managers before high-value clients churn.',
      features: [
        'Re-Order Frequency Anomaly Detection',
        'Account Health Indexing (0-100)',
        'Automated Retention Playbook Triggers'
      ]
    },
    {
      id: 'boardroom',
      title: 'AI Board Meeting',
      subtitle: 'Virtual executive C-Suite strategic council',
      icon: Users2,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      badge: 'EXECUTIVE ADVISORY',
      telemetry: '6 AI C-Suite Agents',
      impact: '100% Data-Backed Choices',
      description:
        'Simulate strategic decisions with your AI CEO, CFO, COO, and Sales Director debating scenarios with live company metrics.',
      features: [
        'Multi-Agent Strategic Scenario Simulation',
        'Consensus Growth Playbook Generation',
        'Quarterly KPI Alignment Auditing'
      ]
    },
    {
      id: 'action-center',
      title: 'Action Center',
      subtitle: 'Unified operational execution queue',
      icon: Zap,
      color: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      badge: 'ONE-CLICK EXECUTION',
      telemetry: '1-Click PO & Reminders',
      impact: '10x Execution Speed',
      description:
        'Central command dashboard where AI recommendations transform into executed purchase orders, invoices, and supplier notices.',
      features: [
        'One-Click Reorder & PO Generation',
        'Automated Invoice Payment Escalation',
        'Full Audit Trail & Governance Logs'
      ]
    }
  ];

  const current = modules[selectedModule];
  const IconComponent = current.icon;

  return (
    <section id="modules" className="py-32 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            7 CORE AI INTELLIGENCE MODULES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Specialized Neural Intelligence for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Every Department.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Replace siloed tools with a unified suite of specialized AI modules designed specifically for mid-market business operations.
          </p>
        </div>

        {/* Interactive Grid & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {modules.map((mod, idx) => {
              const ModIcon = mod.icon;
              const isSelected = selectedModule === idx;
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(idx)}
                  className={`p-4 rounded-[20px] border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-blue-500/50 shadow-lg'
                      : 'bg-[#121215]/80 border-white/[0.06] hover:bg-zinc-900/60 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${mod.bg} ${mod.color}`}>
                      <ModIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white font-sans">{mod.title}</h4>
                      <p className="text-xs text-zinc-400 font-normal">{mod.subtitle}</p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-blue-400 translate-x-0.5' : 'text-zinc-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Module Detailed Preview Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="h-full bg-[#121215] border border-white/10 rounded-[20px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${current.bg} border ${current.border}`}>
                        <IconComponent className={`w-6 h-6 ${current.color}`} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-widest">
                          MODULE {selectedModule + 1} OF 7
                        </span>
                        <h3 className="text-2xl font-bold text-white font-sans">{current.title}</h3>
                      </div>
                    </div>
                    <span className="px-3.5 py-1 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {current.badge}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-8">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                      <span className="text-xs text-zinc-500 font-mono">PRIMARY METRIC</span>
                      <div className="text-xl font-bold font-mono text-white mt-1">
                        {current.telemetry}
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
                      <span className="text-xs text-zinc-500 font-mono">ESTIMATED IMPACT</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                        {current.impact}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Key Capabilities:
                    </h5>
                    {current.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5 text-xs text-zinc-300">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">
                    STATUS: READY FOR DEPLOYMENT
                  </span>
                  <button
                    onClick={onGetStarted}
                    className="h-12 px-6 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Launch {current.title}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
