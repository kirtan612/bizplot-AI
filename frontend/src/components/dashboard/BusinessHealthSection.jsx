import React from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function BusinessHealthSection({ overallScore = 91 }) {
  const categories = [
    {
      name: 'Financial Health',
      score: 94,
      reason: 'Strong liquidity buffer & cash reserves (₹42.1L). Working capital ratio at 1.84x.',
      trend: '+2.4%',
      isUp: true
    },
    {
      name: 'Sales Health',
      score: 92,
      reason: 'Q3 target milestone reached 104.2% ahead of schedule with 14.2% YoY growth.',
      trend: '+4.1%',
      isUp: true
    },
    {
      name: 'Inventory Health',
      score: 84,
      reason: '2 SKUs (CR-4042 Steel Coils) require immediate reorder replenishment.',
      trend: '-1.2%',
      isUp: false
    },
    {
      name: 'Customer Health',
      score: 89,
      reason: '88.4% repeat purchase rate; 0.4% default risk across active accounts.',
      trend: '+0.8%',
      isUp: true
    },
    {
      name: 'Operations Health',
      score: 95,
      reason: '99.4% on-time order fulfillment rate across Mumbai & Pune yards.',
      trend: '+3.0%',
      isUp: true
    }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Multi-Dimension Business Health Matrix</h3>
            <p className="text-xs text-zinc-400">Holistic operational assessment across 5 core operational domains</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          GLOBAL INDEX: {overallScore}/100
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Large Circular Score Ring */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Composite Score
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="60" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="transparent" />
              <circle
                cx="72" cy="72" r="60"
                stroke="#10b981" strokeWidth="10" fill="transparent"
                strokeDasharray="377" strokeDashoffset={377 - (377 * overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-white font-mono">{overallScore}</span>
              <span className="text-xs text-zinc-400 font-mono">/100</span>
            </div>
          </div>

          <div className="text-xs font-semibold text-emerald-400">
            OPTIMIZED ENTERPRISE
          </div>
        </div>

        {/* 5 Sub-category score bars */}
        <div className="lg:col-span-8 space-y-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-colors space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span>{cat.name}</span>
                  <span className="text-zinc-400 font-mono">({cat.score}/100)</span>
                </div>
                <div className={`flex items-center gap-1 font-mono text-[11px] ${cat.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {cat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{cat.trend}</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    cat.score >= 90 ? 'bg-emerald-500' : cat.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>

              <p className="text-[11px] text-zinc-400">{cat.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
