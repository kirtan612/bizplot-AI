import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function AiInsightPanel({ healthScore = 91 }) {
  const { setActiveTab } = useShell();
  const toast = useToast();

  const summaryBullets = [
    { text: 'Revenue is increasing steadily (+12.4% MoM across Western distribution channels).', type: 'positive' },
    { text: 'Cash Flow is healthy with ₹42.1L liquid reserves available for 62 days operating expenses.', type: 'positive' },
    { text: 'Two customers (Apex Industrial & Metro Infra) have overdue payments totaling ₹4.85L.', type: 'warning' },
    { text: 'Inventory for Cold-Rolled Steel Coils (CR-4042) should be replenished within 1 week.', type: 'warning' },
    { text: 'Three recommended strategic actions available for immediate execution.', type: 'action' }
  ];

  const handleExecuteBestAction = () => {
    setActiveTab('profit');
    toast.action(
      'AI Recommendation Triggered',
      'Executing EBITDA Margin Leakage Optimization on Tier-2 contracts.',
      'View EBITDA Matrix',
      () => setActiveTab('profit')
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-[#161226] via-[#121218] to-[#0d0d12] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden space-y-6"
    >
      {/* Ambient glowing orb */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Panel Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                AI Executive Intelligence Summary
              </h2>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                GPT-4o OS
              </span>
            </div>
            <p className="text-xs text-zinc-400">Autonomous cross-module business health synthesis</p>
          </div>
        </div>

        {/* Confidence & Priority Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>96% AI Confidence</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase font-mono">
            High Priority
          </div>
        </div>
      </div>

      {/* Main Body: Score + Bullet Points */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Score Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
            Overall Business Health
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
              <circle
                cx="56" cy="56" r="48"
                stroke="#10b981" strokeWidth="8" fill="transparent"
                strokeDasharray="301" strokeDashoffset={301 - (301 * healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-white font-mono">{healthScore}</span>
              <span className="text-xs text-zinc-400 font-mono">/100</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            STRONGLY OPTIMIZED
          </div>
        </div>

        {/* Executive Summary Bullet Points */}
        <div className="lg:col-span-8 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Executive Telemetry Digest
          </h4>

          <div className="space-y-2.5">
            {summaryBullets.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
                {b.type === 'positive' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> :
                 b.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> :
                 <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
                <span className="text-xs text-zinc-200 leading-relaxed">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Next Best Action Row */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Next Best Action: EBITDA Margin Optimization</span>
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            Estimated Business Impact: <strong className="text-emerald-400 font-mono">+₹3,20,000 EBITDA Gain</strong>
          </p>
        </div>

        <button
          onClick={handleExecuteBestAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Execute Recommended Action</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
