import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';

interface Customer {
  id: string;
  name: string;
  location: string;
  status: 'At Risk' | 'Healthy' | 'Declining' | 'Growing';
  clv: string;
  orderFreq: string;
  lastOrder: string;
  purchaseGap: string;
  retentionProb: number;
  insight: string;
  recommendation: string;
}

const CUSTOMERS: Customer[] = [
  {
    id: 'abc',
    name: 'ABC Industries Ltd.',
    location: 'Surat, Gujarat',
    status: 'At Risk',
    clv: '₹1.84 Cr',
    orderFreq: 'Every 14 days',
    lastOrder: '42 days ago',
    purchaseGap: '+28 days overdue',
    retentionProb: 34,
    insight: "ABC Industries' purchase frequency has declined for three consecutive cycles. Order gap expanded from 14 to 42 days.",
    recommendation: 'Review pricing on high-volume GI pipes (80mm) before their upcoming procurement window.',
  },
  {
    id: 'shree',
    name: 'Shree Engineering Works',
    location: 'Ahmedabad, Gujarat',
    status: 'Healthy',
    clv: '₹94.2 L',
    orderFreq: 'Every 21 days',
    lastOrder: '6 days ago',
    purchaseGap: 'On schedule',
    retentionProb: 94,
    insight: 'Shree Engineering purchase pattern remains exceptionally stable with steady 15 MT monthly reorders.',
    recommendation: 'Propose annual bulk supply contract with 2.5% rebate structure.',
  },
  {
    id: 'metro',
    name: 'Metro Components Corp',
    location: 'Vadodara, Gujarat',
    status: 'Declining',
    clv: '₹68.5 L',
    orderFreq: 'Every 30 days',
    lastOrder: '38 days ago',
    purchaseGap: '+8 days gap',
    retentionProb: 58,
    insight: 'Metro Components reduced order volume by 35% in the last order cycle, shifting partial purchases to competitor.',
    recommendation: 'Offer flexible 45-day payment terms on next MS Pipe shipment.',
  },
  {
    id: 'patel',
    name: 'Patel Industrial Supplies',
    location: 'Rajkot, Gujarat',
    status: 'Growing',
    clv: '₹2.12 Cr',
    orderFreq: 'Every 10 days',
    lastOrder: '2 days ago',
    purchaseGap: 'Accelerating',
    retentionProb: 98,
    insight: 'Order frequency increased by 40% due to new infrastructure sub-contracts in Saurashtra region.',
    recommendation: 'Reserve 60 MT GP Pipe inventory in Rajkot warehouse.',
  },
];

export const CustomerIntelligence: React.FC = () => {
  const [selectedCust, setSelectedCust] = useState<Customer>(CUSTOMERS[0]);

  return (
    <section id="customer-intelligence" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            CUSTOMER RETENTION INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            KNOW YOUR CUSTOMERS.
            <br />
            <span className="text-gradient">BEFORE THEY LEAVE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot tracks order frequencies, purchasing gaps, and line-item mix shifts to detect customer churn signals weeks before revenue impact.
          </p>
        </motion.div>

        {/* Interface: Customer Table + AI Investigation Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Table List */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase font-mono">ACCOUNT TELEMETRY LIST</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">4 ACCOUNTS MONITORED</span>
            </div>

            <div className="space-y-2">
              {CUSTOMERS.map((cust) => {
                const isSelected = selectedCust.id === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCust(cust)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#181818] border-white/40 shadow-lg'
                        : 'bg-[#0E0E0E] border-[#1A1A1A] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{cust.name}</h4>
                        <span className="text-[11px] text-neutral-500 font-mono">{cust.location}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          cust.status === 'At Risk'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                            : cust.status === 'Declining'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                        }`}
                      >
                        {cust.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1C1C1C] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">CLV</span>
                        <span className="text-white font-bold">{cust.clv}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">PURCHASE GAP</span>
                        <span className={cust.status === 'At Risk' ? 'text-rose-400 font-bold' : 'text-neutral-300'}>
                          {cust.purchaseGap}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">RETENTION</span>
                        <span className="text-white font-bold">{cust.retentionProb}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Investigation Panel */}
          <div className="lg:col-span-5 sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCust.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#262626] shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                      AI BEHAVIORAL INVESTIGATION
                    </span>
                    <h3 className="text-xl font-bold text-white">{selectedCust.name}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] text-white">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                {/* Behavioral Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#060606] border border-[#1A1A1A] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">ORDER FREQUENCY</span>
                    <span className="text-white font-bold">{selectedCust.orderFreq}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">LAST ORDER</span>
                    <span className="text-white font-bold">{selectedCust.lastOrder}</span>
                  </div>
                </div>

                {/* AI Investigation Log */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Neural Investigation Complete</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                    {selectedCust.insight}
                  </p>
                </div>

                {/* Actionable Recommendation */}
                <div className="p-4 rounded-xl bg-[#080808] border border-[#202020] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                    RECOMMENDED PREVENTIVE ACTION
                  </span>
                  <p className="text-xs text-white font-semibold leading-relaxed">
                    {selectedCust.recommendation}
                  </p>
                </div>

                <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg">
                  <span>Trigger Preventative Offer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
