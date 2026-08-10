import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { InteractiveCashflowDiagram } from '../../components/InteractiveCashflowDiagram';
import { AnimatedNumber } from '../../components/AnimatedNumber';
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
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
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

        {/* Money Movement Interactive Pipeline */}
        <InteractiveCashflowDiagram />

        {/* Forecast Summary & Recommendation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#242424] space-y-3">
            <span className="text-[10px] text-neutral-400 font-mono block uppercase">CURRENT TREASURY CASH</span>
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
              <AnimatedNumber value={1.86} prefix="₹" suffix=" Cr" decimals={2} />
            </div>
            <p className="text-xs text-neutral-400 font-mono">HDFC Current + ICICI Escrow Accounts</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#242424] space-y-3">
            <span className="text-[10px] text-amber-400 font-mono block uppercase font-bold">PROJECTED CASHGAP (30 DAYS)</span>
            <div className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
              <AnimatedNumber value={19.0} prefix="₹" suffix=" Lakh" decimals={1} />
            </div>
            <p className="text-xs text-neutral-400 font-mono">Expected Outflows (-₹91 L) exceed Inflows (+₹72 L)</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#242424] space-y-3">
            <span className="text-[10px] text-emerald-400 font-mono block uppercase font-bold">RECOMMENDED LIQUIDITY BUFFER</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              <AnimatedNumber value={25.0} prefix="₹" suffix=" Lakh" decimals={1} />
            </div>
            <p className="text-xs text-neutral-400 font-mono">Reserve required before August 25 procurement</p>
          </div>
        </div>
      </div>
    </section>
  );
};

