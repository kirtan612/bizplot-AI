import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';

export const CashflowIntelligence: React.FC = () => {
  return (
    <section id="cashflow-intelligence" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            WORKING CAPITAL TELEMETRY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            KNOW YOUR CASH.
            <br />
            <span className="text-gradient">BEFORE YOU NEED IT.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot forecasts 30, 60, and 90-day working capital pressure by matching upcoming customer collections against supplier credit terms and loan obligations.
          </p>
        </motion.div>

        {/* Money Flow Diagram + Cash Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Money Flow Path Box */}
          <div className="lg:col-span-6 p-8 rounded-2xl bg-[#0B0B0B] border border-[#202020] space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                MONEY MOVEMENT PIPELINE (NEXT 30 DAYS)
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>LIVE SYNC</span>
              </span>
            </div>

            {/* Inflows Block */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-mono">EXPECTED INFLOWS</span>
                  <span className="text-sm font-bold text-white">Customer Collections</span>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400">+₹72.0 Lakh</span>
            </div>

            {/* Center Cash Buffer Box */}
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#2D2D2D] text-center space-y-2 shadow-inner">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                CURRENT TREASURY CASH POSITION
              </span>
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">₹1.86 Cr</span>
              <span className="text-xs text-neutral-500 block">HDFC Bank + ICICI Business Accounts</span>
            </div>

            {/* Outflows Block */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-rose-950 border border-rose-800 text-rose-400">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-mono">EXPECTED OUTFLOWS</span>
                  <span className="text-sm font-bold text-white">Suppliers + OpEx + Loans</span>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-rose-400">-₹91.0 Lakh</span>
            </div>
          </div>

          {/* Forecast Summary & Recommendation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#242424] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                  PROJECTED CASHGAP & BUFFER
                </h3>
                <span className="text-xs font-mono text-neutral-400">CYCLE: 30 DAYS</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                  <span className="text-[10px] text-neutral-500 font-mono block uppercase">NET RECURRING DEFICIT</span>
                  <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">₹19.0 Lakh</span>
                  <span className="text-[11px] text-neutral-400 block mt-1">Outflows exceed Inflows</span>
                </div>
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222]">
                  <span className="text-[10px] text-neutral-500 font-mono block uppercase font-semibold">RECOMMENDED BUFFER</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">₹25.0 Lakh</span>
                  <span className="text-[11px] text-neutral-400 block mt-1">Working Capital Reserve</span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-5 rounded-xl bg-[#050505] border border-[#202020] space-y-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                    CFO CASHFLOW DIRECTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                  "Maintain approximately <strong className="text-white font-mono">₹25 Lakh</strong> working-capital buffer by drawing down early payments on Patel Industrial ledgers before August 25."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
