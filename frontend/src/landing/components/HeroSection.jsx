import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Play,
  Zap,
  Activity,
  ShieldAlert,
  Bot,
  DollarSign,
  Package,
  ArrowRight
} from 'lucide-react';

export default function HeroSection({ onGetStarted, onWatchDemo }) {
  const floatingKpis = [
    {
      title: 'Monthly Cash Reserve',
      value: '$284,500',
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Inventory Turnover',
      value: '8.4x',
      change: '+2.1x vs Q2',
      isPositive: true,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Net Profit Margin',
      value: '28.6%',
      change: '+4.8%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
  ];

  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-[#09090b]">
      {/* Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-medium text-blue-400 tracking-wide font-mono">
              BIZPILOT AI ENGINE v2.4 IS LIVE
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-xs text-zinc-300 flex items-center gap-1">
              Autonomous MSME Business OS <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
            </span>
          </div>
        </motion.div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 font-sans leading-[1.1]"
          >
            The AI Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Modern Businesses.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Monitor cash flows, optimize working capital, eliminate deadstock, and run autonomous executive board meetings with specialized AI agents tailored for MSMEs.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto h-12 px-8 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer border border-blue-400/40"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onWatchDemo}
              className="w-full sm:w-auto h-12 px-7 text-sm font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group hover:border-zinc-700"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Play className="w-3 h-3 text-zinc-200 fill-zinc-200 group-hover:text-blue-400 group-hover:fill-blue-400 transition-colors ml-0.5" />
              </div>
              <span>Watch Interactive Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Interactive Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-[24px] p-1 bg-gradient-to-b from-white/15 via-white/[0.05] to-transparent shadow-[0_20px_80px_rgba(0,0,0,0.85)]"
        >
          <div className="bg-[#121215] border border-white/10 rounded-[20px] overflow-hidden shadow-2xl">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-[#0d0d0f] border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-zinc-500 font-mono">bizpilot-os // executive-console</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI HEALTH: 94/100 (OPTIMAL)
                </div>
                <div className="text-[11px] font-mono text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-md">
                  MAIN YARD (MUMBAI PORT)
                </div>
              </div>
            </div>

            {/* Dashboard View */}
            <div className="p-8 space-y-8 bg-[#121215]">
              {/* Floating KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {floatingKpis.map((kpi, idx) => {
                  const IconComp = kpi.icon;
                  return (
                    <div
                      key={kpi.title}
                      className="p-6 rounded-[20px] bg-zinc-900/60 border border-white/[0.08] relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400 font-medium">{kpi.title}</span>
                        <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.border} border`}>
                          <IconComp className={`w-4 h-4 ${kpi.color}`} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">{kpi.value}</span>
                        <span className="text-xs font-mono text-emerald-400 flex items-center font-medium">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                          {kpi.change}
                        </span>
                      </div>
                      <div className="mt-3 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${75 + idx * 8}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central SVG Stream & AI CFO Insight */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG Revenue Sparkline Graph */}
                <div className="lg:col-span-2 p-6 rounded-[20px] bg-zinc-900/40 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-zinc-400 font-medium">Revenue vs Expenses (Real-Time Stream)</div>
                      <div className="text-xl font-bold font-mono text-zinc-100 mt-1">$482,910.00 YTD</div>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      LIVE API INGESTION
                    </span>
                  </div>

                  <div className="h-44 w-full relative pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                      <path
                        d="M 0 100 Q 80 40, 160 70 T 320 30 T 500 15 L 500 120 L 0 120 Z"
                        fill="url(#heroChartGrad)"
                      />
                      <path
                        d="M 0 100 Q 80 40, 160 70 T 320 30 T 500 15"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                      <path
                        d="M 0 110 Q 80 70, 160 90 T 320 60 T 500 45"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <circle cx="500" cy="15" r="4" fill="#60a5fa" className="animate-ping" />
                      <circle cx="500" cy="15" r="4" fill="#3b82f6" />
                    </svg>

                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2">
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>
                </div>

                {/* AI CFO Recommendation Card */}
                <div className="p-6 rounded-[20px] bg-purple-950/20 border border-purple-500/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-3">
                      <Bot className="w-4 h-4 text-purple-400" />
                      AI CFO ACTIVE INSIGHT
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-purple-500/20 text-xs text-zinc-300 font-sans leading-relaxed space-y-2">
                      <p>
                        <span className="font-semibold text-purple-400">Analysis:</span> Receivables turnover improved by <span className="text-emerald-400 font-mono">+12.4%</span> this week.
                      </p>
                      <p>
                        <span className="font-semibold text-amber-400">Recommendation:</span> Reallocate <span className="font-mono text-white">$45,000</span> excess liquidity to high-margin SKU-809.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400">Confidence: 98.4%</span>
                    <button
                      onClick={onGetStarted}
                      className="px-3 py-1.5 text-[11px] font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Execute Action
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
