import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Sparkles, ArrowRight, AlertOctagon } from 'lucide-react';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { BusinessChart } from '../../components/BusinessChart';
import { fadeInUp } from '../../lib/animations';

interface VarianceItem {
  driver: string;
  amount: string;
  percentage: number;
  impactValue: number;
  category: string;
}

const PROFIT_VARIANCE: VarianceItem[] = [
  { driver: 'Raw Material Cost Increase (GI Sheet)', amount: '+₹18.4 Lakh', percentage: 55, impactValue: 18.4, category: 'APL Apollo Sheet Escalation' },
  { driver: 'Excess Commercial Discounting', amount: '+₹7.2 Lakh', percentage: 22, impactValue: 7.2, category: 'Tier-2 Distributor Discounts' },
  { driver: 'Inter-state Logistics Freight Surge', amount: '+₹4.8 Lakh', percentage: 14, impactValue: 4.8, category: 'Gujarat-Maharashtra Highway Freight' },
  { driver: 'Low-Margin High-Volume Sub-Orders', amount: '+₹3.1 Lakh', percentage: 9, impactValue: 3.1, category: 'Metro Components Sub-Orders' },
];

export const ProfitIntelligence: React.FC = () => {
  const [hoveredDriver, setHoveredDriver] = useState<VarianceItem | null>(PROFIT_VARIANCE[0]);

  const chartData = PROFIT_VARIANCE.map((item) => ({
    label: item.driver.split(' ')[0],
    value: item.impactValue,
    change: item.percentage,
  }));

  return (
    <section id="profit-intelligence" className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            MARGINEER & PROFIT DRILLDOWN
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            PROFIT DOWN?
            <br />
            <span className="text-gradient">KNOW EXACTLY WHY.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot breaks down top-line margin variance into exact cost drivers: raw material price shifts, distributor discounts, freight surges, and sub-optimal order mix.
          </p>
        </motion.div>

        {/* Profit Waterfall & Drivers Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Step Change Graphic */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-6 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-semibold block">
              GROSS PROFIT DRIFT ANALYSIS
            </span>

            <div className="flex items-center justify-between py-4 border-b border-[#1A1A1A]">
              <div>
                <span className="text-xs text-neutral-400 block mb-1 font-mono">Previous Gross Profit</span>
                <span className="text-2xl font-bold font-mono text-neutral-300">
                  <AnimatedNumber value={3.80} prefix="₹" suffix=" Cr" decimals={2} />
                </span>
              </div>
              <div className="p-3 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400">
                <TrendingDown className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block mb-1 font-mono">Current Gross Profit</span>
                <span className="text-2xl font-bold font-mono text-white">
                  <AnimatedNumber value={3.42} prefix="₹" suffix=" Cr" decimals={2} />
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-semibold">Net Margin Compression</span>
              <span className="text-rose-400 font-extrabold text-base">-₹33.5 Lakh (-9.9%)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                AI ANALYSIS SUMMARY
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                The primary pressure came from <strong className="text-white">higher raw-material costs (+₹18.4 L)</strong> combined with lower-margin orders (+₹3.1 L).
              </p>
            </div>
          </div>

          {/* Right: Variance Breakdown Bars + Action Plan */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white uppercase font-mono tracking-wide">
                  CONTRIBUTION WATERFALL (COST IMPACT BARS)
                </h3>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  4 DRIVERS DETECTED
                </span>
              </div>

              {/* Colourful Contribution Waterfall Bar Chart */}
              <BusinessChart
                title="Profit Impact Breakdown (₹ Lakh)"
                subtitle="Hover each bar to see exact contribution percentage & driver impact"
                data={chartData}
                type="bar"
                colorTheme="rose"
                height={170}
                prefix="₹"
                suffix=" L"
              />

              <div className="space-y-3">
                {PROFIT_VARIANCE.map((item, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredDriver(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      hoveredDriver?.driver === item.driver
                        ? 'bg-[#181818] border-rose-500/50 shadow-lg'
                        : 'bg-[#101010] border-[#1C1C1C]'
                    }`}
                  >
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-white font-medium">{item.driver}</span>
                      <span className="text-rose-400 font-bold">{item.amount} (+{item.percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#141414] to-[#0A0A0A] border border-[#282828] space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-semibold">
                    RECOMMENDED AI EXECUTIVE ACTION
                  </span>
                </div>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  "Review low-margin orders immediately and renegotiate high-cost suppliers (APL Apollo tier) before next procurement cycle."
                </p>
                <button className="px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center space-x-2 cursor-pointer">
                  <span>Generate Margin Recovery Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

