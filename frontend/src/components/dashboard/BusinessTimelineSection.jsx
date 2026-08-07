import React from 'react';
import { Clock, ShoppingBag, AlertTriangle, DollarSign, FilePlus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BusinessTimelineSection() {
  const events = [
    {
      title: 'High-Value Purchase Order Received',
      detail: 'Metro Infra Solutions placed order for 18 Tons Cold-Rolled Steel Coils (Invoice #INV-2026-889).',
      time: '10 mins ago',
      category: 'Sales',
      icon: ShoppingBag,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Inventory Threshold Triggered',
      detail: 'Cold-Rolled Steel Coils (CR-4042) dropped to 4.2 Tons (Below 5.0 Tons threshold).',
      time: '30 mins ago',
      category: 'Inventory',
      icon: AlertTriangle,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Overdue Payment Settlement Received',
      detail: 'Apex Industrial Solutions settled ₹4,85,000 via NEFT against Invoice #INV-2026-872.',
      time: '2 hours ago',
      category: 'Finance',
      icon: DollarSign,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Purchase Order #PO-2026-104 Auto-Created',
      detail: 'Auto-generated PO to JSW Steel Processing Yard for 15 Tons Hot-Rolled Sheet Stock.',
      time: '4 hours ago',
      category: 'Supplier',
      icon: FilePlus,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'AI Recommendation Accepted',
      detail: 'Adjusted Tier-2 distributor freight pricing margin threshold (+₹1.4L annual EBITDA effect).',
      time: 'Yesterday 4:30 PM',
      category: 'AI Strategy',
      icon: Sparkles,
      iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Business Activity Timeline</h3>
            <p className="text-xs text-zinc-400">Chronological telemetry stream across all company branches</p>
          </div>
        </div>

        <span className="text-xs text-zinc-500 font-mono">Live Stream</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {events.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={idx} className="relative flex items-start gap-4 group">
              {/* Timeline Dot Icon */}
              <div className={`absolute -left-6 top-0.5 p-1.5 rounded-full border shrink-0 ${evt.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{evt.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-mono">
                      {evt.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">{evt.time}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{evt.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
