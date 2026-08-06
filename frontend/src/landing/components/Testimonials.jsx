import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Rajesh Sharma',
      role: 'Managing Director',
      company: 'Apex Industrial Solutions',
      location: 'Mumbai, India',
      metric: '+34% Gross Profit',
      metricSub: 'in 90 days after deployment',
      quote:
        '“BizPilot AI identified $45,000 in supplier freight overruns that our accounting software missed for two years. Having the AI CFO run weekly cash audits transformed our balance sheet.”',
      avatar: 'RS',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      name: 'Ananya Verma',
      role: 'Head of Operations & Supply Chain',
      company: 'CraftVibe Retail Networks',
      location: 'Bengaluru, India',
      metric: '$120,000 Liquidated',
      metricSub: 'deadstock converted to cash',
      quote:
        '“The Inventory Intelligence module predicted a seasonal demand slump 60 days before it hit. We cleared slow-moving stock before capital was trapped.”',
      avatar: 'AV',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Founder & CEO',
      company: 'SteelGrid Manufacturing',
      location: 'Pune, India',
      metric: '4.8 Months Runway',
      metricSub: 'up from 1.4 months previous lag',
      quote:
        '“Running an MSME means you don’t have budget for a full Fortune 500 C-Suite. BizPilot AI gives us an AI CEO, CFO, and COO for less than a single junior salary.”',
      avatar: 'VM',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <section className="py-32 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            VERIFIED MSME CASE STUDIES
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Trusted by Business Leaders{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
              Driving Real Growth.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            See how mid-market founders and executive leaders use BizPilot AI to eliminate operational friction and scale profitability.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={rev.name}
              className="p-8 rounded-[20px] bg-[#121215] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between shadow-xl relative group"
            >
              <div>
                <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/[0.08] mb-6">
                  <span className="text-2xl font-bold font-mono text-white flex items-center gap-1">
                    {rev.metric}
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{rev.metricSub}</span>
                </div>

                <Quote className="w-8 h-8 text-blue-500/20 mb-3" />

                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-6 italic">
                  {rev.quote}
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${rev.bg} border border-white/10 flex items-center justify-center font-mono font-bold text-xs ${rev.color}`}>
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans">{rev.name}</h4>
                  <p className="text-[11px] text-zinc-400">{rev.role}, <span className="text-zinc-300">{rev.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
