import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserCheck, DollarSign, ShoppingBag, Package, BarChart3 } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function AiBoardSummarySection() {
  const { setActiveTab } = useShell();
  const toast = useToast();

  const boardPersonas = [
    {
      role: 'CEO AI Persona',
      name: 'Strategic Vision',
      avatar: 'CEO',
      color: 'bg-purple-600/20 text-purple-300 border-purple-500/40',
      icon: UserCheck,
      summary: 'Growth trajectory remains robust. Recommend allocating capital to Northern region distribution hubs.'
    },
    {
      role: 'CFO AI Persona',
      name: 'Financial Control',
      avatar: 'CFO',
      color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
      icon: DollarSign,
      summary: 'Working capital cycle reduced to 28 days. Cash reserves healthy; GST reconciliation auto-matched.'
    },
    {
      role: 'Sales Director AI',
      name: 'Revenue Acceleration',
      avatar: 'CSO',
      color: 'bg-blue-600/20 text-blue-300 border-blue-500/40',
      icon: ShoppingBag,
      summary: 'Cold-Rolled steel coil demand up 18% in West. Pipeline conversion velocity at 64%.'
    },
    {
      role: 'COO AI Persona',
      name: 'Operations & Yard',
      avatar: 'COO',
      color: 'bg-amber-600/20 text-amber-300 border-amber-500/40',
      icon: Package,
      summary: 'Plant utilization at 82%. Supplier JSW Steel on-time delivery maintained at 98%.'
    },
    {
      role: 'Business Analyst AI',
      name: 'Market Intelligence',
      avatar: 'BI',
      color: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40',
      icon: BarChart3,
      summary: 'EBITDA margin steady at 24.2%. Competitive pricing advantage retained in Tier-2 markets.'
    }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#151226] via-[#121218] to-[#0a0a0f] border border-purple-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>AI Board Room Executive Briefing</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                5 C-Suite Personas
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Autonomous executive strategy session preview</p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('ai-board');
            toast.info('AI Board Meeting', 'Entering simulated C-Suite executive board room.');
          }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Open Full AI Board Meeting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5 C-Suite Persona Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
        {boardPersonas.map((persona, idx) => {
          const Icon = persona.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.06] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${persona.color}`}>
                    {persona.avatar}
                  </span>
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{persona.role}</h4>
                  <div className="text-[10px] text-zinc-400">{persona.name}</div>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                  "{persona.summary}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
