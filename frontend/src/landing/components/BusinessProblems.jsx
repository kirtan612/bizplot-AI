import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  AlertTriangle,
  PackageX,
  UserX,
  FileSpreadsheet,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function BusinessProblems() {
  const problems = [
    {
      icon: TrendingDown,
      title: 'Cash Flow Volatility',
      stat: '82%',
      statLabel: 'of MSME failures tied to poor cash visibility',
      description:
        'Unforeseen liquidity drops, delayed receivables, and untracked vendor terms destroy working capital before owners realize it.',
      tag: 'FINANCIAL RISK',
      color: 'from-rose-500/20 to-red-500/5',
      border: 'hover:border-rose-500/40',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      icon: AlertTriangle,
      title: 'Silent Margin Leakage',
      stat: '14.8%',
      statLabel: 'average profit margin lost in hidden costs',
      description:
        'Fluctuating raw material rates, logistics surcharges, and unindexed unit costs erode margins quietly every single quarter.',
      tag: 'PROFIT EROSION',
      color: 'from-amber-500/20 to-orange-500/5',
      border: 'hover:border-amber-500/40',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: PackageX,
      title: 'Inventory & Stock Out Imbalance',
      stat: '$140k+',
      statLabel: 'working capital trapped in deadstock',
      description:
        'Capital remains locked in slow-moving inventory while high-demand fast-movers suffer sudden out-of-stock losses.',
      tag: 'CAPITAL TRAP',
      color: 'from-purple-500/20 to-indigo-500/5',
      border: 'hover:border-purple-500/40',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: UserX,
      title: 'Undetected Customer Churn',
      stat: '3.2x',
      statLabel: 'higher acquisition cost than retention',
      description:
        'Silent drop-offs in re-order velocity go unnoticed until key accounts migrate to competitors without warning.',
      tag: 'RETENTION FAILURE',
      color: 'from-blue-500/20 to-cyan-500/5',
      border: 'hover:border-blue-500/40',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: FileSpreadsheet,
      title: 'Fragmented Excel Dependency',
      stat: '25+ Hrs',
      statLabel: 'wasted per week on manual reporting',
      description:
        'Teams drown in disconnected spreadsheets, conflicting formula calculations, and error-prone copy-paste data assembly.',
      tag: 'OPERATIONAL DRAG',
      color: 'from-emerald-500/20 to-teal-500/5',
      border: 'hover:border-emerald-500/40',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Clock,
      title: 'Month-End Decision Paralysis',
      stat: '30 Days',
      statLabel: 'lag time before financial clarity',
      description:
        'Leaders react to past performance rather than executing proactive adjustments based on forward-looking predictions.',
      tag: 'STRATEGIC LAG',
      color: 'from-zinc-500/20 to-slate-500/5',
      border: 'hover:border-zinc-400/40',
      badgeColor: 'text-zinc-300 bg-zinc-700/30 border-zinc-600/30'
    }
  ];

  return (
    <section id="features" className="py-32 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-400 mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            THE MSME OPERATIONAL CRISIS
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Why Traditional Businesses{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400">
              Stall & Bleed Profits.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            Mid-market enterprises face systemic blindspots that static accounting software and bloated ERPs fail to diagnose until it's too late.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((prob, idx) => {
            const IconComp = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`p-8 rounded-[20px] bg-[#121215] border border-white/[0.08] transition-all duration-200 relative group ${prob.border} shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between`}
              >
                {/* Subtle Hover Glow */}
                <div
                  className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${prob.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 group-hover:scale-105 transition-transform">
                      <IconComp className="w-5 h-5 text-zinc-200 group-hover:text-white" />
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-mono font-semibold rounded-full border ${prob.badgeColor}`}>
                      {prob.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-sans">{prob.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                    {prob.description}
                  </p>
                </div>

                {/* Telemetry Stat Pill */}
                <div className="pt-6 border-t border-white/[0.06] flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-mono text-white tracking-tight">{prob.stat}</span>
                  <span className="text-xs font-mono text-zinc-500 max-w-[170px] text-right">
                    {prob.statLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
