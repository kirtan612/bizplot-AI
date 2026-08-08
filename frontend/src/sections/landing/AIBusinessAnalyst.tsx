import React from 'react';
import { motion } from 'framer-motion';
import { AIMessage } from '../../components/AIMessage';
import { fadeInUp } from '../../lib/animations';

export const AIBusinessAnalyst: React.FC = () => {
  return (
    <section id="ai-analyst" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            NATURAL LANGUAGE QUERY ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ASK YOUR BUSINESS.
            <br />
            <span className="text-gradient">GET INSTANT ANSWERS.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            No SQL queries, no static reports. Ask complex financial and operational questions in plain English or Hinglish.
          </p>
        </motion.div>

        {/* Conversational Product Window Demo */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0A0A] border border-[#222222] shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-6">
            <AIMessage
              query="Why did our gross profit fall this month?"
              steps={[
                'Analyzing monthly sales invoices (2,846 records)...',
                'Checking raw material supplier price history...',
                'Reviewing customer discount ledgers...',
                'Comparing line-item order margins against Q1 baseline...',
              ]}
              responseContent={`I analyzed all 2,846 sales transactions and purchase registers for this billing cycle.

I found three primary drivers:
1. Raw material procurement costs increased by ₹18.4 Lakh across GI Pipe sheets.
2. Distributor commercial discounting expanded by 2.1% (₹7.2 Lakh impact).
3. Three large bulk orders for Metro Components yielded sub-optimal 8.4% gross margin.`}
              impactBars={[
                { label: 'Raw Material Sheet Cost Increase', percentage: 55, color: 'bg-rose-500' },
                { label: 'Excess Commercial Discounting', percentage: 22, color: 'bg-amber-400' },
                { label: 'Low-Margin Order Mix', percentage: 15, color: 'bg-neutral-400' },
              ]}
              recommendedAction="Review high-volume low-margin orders for Metro Components and adjust MOQ thresholds."
            />
          </div>
        </div>
      </div>
    </section>
  );
};
