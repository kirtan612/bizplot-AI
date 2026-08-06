import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  BarChart3,
  Bot,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export default function AITeam({ onGetStarted }) {
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  const team = [
    {
      id: 'ceo',
      title: 'AI CEO',
      role: 'Chief Executive Officer',
      focus: 'Portfolio Strategy & Expansion Playbooks',
      icon: Crown,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      status: 'ONLINE // STRATEGIC ADVISORY ACTIVE',
      quote:
        '“Based on Q2 unit economics, expanding into Tier-2 distribution hubs increases net revenue by 24% while keeping fixed overhead under 8%.”',
      capabilities: [
        'Quarterly Goal & Target Alignment',
        'Cross-Department Resource Optimization',
        'Competitor & Market Expansion Playbooks'
      ]
    },
    {
      id: 'cfo',
      title: 'AI CFO',
      role: 'Chief Financial Officer',
      focus: 'Cash Runway & Working Capital Optimization',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      status: 'ONLINE // FINANCIAL GUARDRAIL ACTIVE',
      quote:
        '“Receivables aging hit 42 days. I have automated early-payment discount notices to 12 top debtors to pull forward $64,000 in cash this week.”',
      capabilities: [
        'Dynamic 90-Day Cash Flow Modeling',
        'Receivables & Payables Automation',
        'Tax & Margin Leakage Defense'
      ]
    },
    {
      id: 'coo',
      title: 'AI COO',
      role: 'Chief Operating Officer',
      focus: 'Supply Chain & Inventory Velocity',
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      status: 'ONLINE // OPERATIONS MONITOR ACTIVE',
      quote:
        '“Warehouse throughput stalled by 8.2% at Main Yard. Shifting 300 units of SKU-104 to West Hub eliminates lead-time bottlenecks.”',
      capabilities: [
        'Warehouse Inventory Rebalancing',
        'Deadstock Decay Prevention',
        'Supplier Lead-Time SLA Monitoring'
      ]
    },
    {
      id: 'sales',
      title: 'AI Sales Director',
      role: 'Head of Commercial Growth',
      focus: 'Pipeline Scoring & Churn Prevention',
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      status: 'ONLINE // REVENUE VELOCITY ACTIVE',
      quote:
        '“Account #408 has not reordered in 35 days. Recommending a 5% volume rebate trigger to lock in their quarterly contract renewal.”',
      capabilities: [
        'Predictive Account Churn Detection',
        'Deal Stagnation Escalation Prompts',
        'Automated Re-order Volume Incentives'
      ]
    },
    {
      id: 'procurement',
      title: 'AI Procurement Manager',
      role: 'Vendor & Sourcing Specialist',
      focus: 'Raw Material Cost & PO Automation',
      icon: ShoppingBag,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      status: 'ONLINE // SOURCING AUDIT ACTIVE',
      quote:
        '“Vendor B increased raw steel quotes by $4.20/kg. Shifting 40% volume to Vendor C saves $18,200 on Purchase Order #8920.”',
      capabilities: [
        'Supplier Pricelist Cost Overrun Audits',
        'Bulk Quantity Discount Triggers',
        'One-Click Purchase Order Generation'
      ]
    },
    {
      id: 'analyst',
      title: 'AI Business Analyst',
      role: 'Data Science & Query Engine',
      focus: 'Custom Analytics & SQL Telemetry',
      icon: BarChart3,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      status: 'ONLINE // ANALYTICS QUERY ACTIVE',
      quote:
        '“Querying 14,890 sales records. SKU-809 yields a 44% gross margin in South Region versus 28% in North. Reallocating marketing spends.”',
      capabilities: [
        'Natural Language SQL Querying',
        'Custom P&L & Balance Sheet Reports',
        'Statistical Monte Carlo Simulations'
      ]
    }
  ];

  return (
    <section id="ai-team" className="py-32 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400 mb-4">
            <Bot className="w-3.5 h-3.5" />
            YOUR 24/7 AUTONOMOUS C-SUITE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Meet Your AI Executive{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-300">
              Leadership Team.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Gain the strategic firepower of a Fortune 500 executive team at a fraction of the cost, working around the clock for your business.
          </p>
        </div>

        {/* Executive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((exec) => {
            const IconComp = exec.icon;
            return (
              <div
                key={exec.id}
                className="p-8 rounded-[20px] bg-[#121215] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between shadow-xl group cursor-pointer"
                onClick={() => setSelectedExecutive(exec)}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-xl ${exec.bg} border ${exec.border} group-hover:scale-105 transition-transform`}>
                      <IconComp className={`w-6 h-6 ${exec.color}`} />
                    </div>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                    {exec.role}
                  </div>
                  <h3 className="text-xl font-bold text-white font-sans mb-2">{exec.title}</h3>
                  <p className="text-xs text-zinc-400 mb-6 font-normal">{exec.focus}</p>

                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] text-xs text-zinc-300 font-sans italic leading-relaxed mb-6">
                    {exec.quote}
                  </div>

                  <div className="space-y-2">
                    {exec.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-zinc-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400">{exec.status}</span>
                  <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                    Consult <MessageSquare className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedExecutive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121215] border border-white/20 rounded-[20px] p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedExecutive(null)}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3.5 rounded-xl ${selectedExecutive.bg} border ${selectedExecutive.border}`}>
                  {React.createElement(selectedExecutive.icon, {
                    className: `w-6 h-6 ${selectedExecutive.color}`
                  })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedExecutive.title}</h3>
                  <p className="text-xs text-zinc-400">{selectedExecutive.role}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 leading-relaxed mb-6 font-mono">
                {selectedExecutive.quote}
              </div>

              <div className="space-y-3 mb-8">
                <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Active Advisory Protocols:
                </h5>
                {selectedExecutive.capabilities.map((c) => (
                  <div key={c} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedExecutive(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedExecutive(null);
                    onGetStarted();
                  }}
                  className="h-12 px-6 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Deploy {selectedExecutive.title}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
