import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { fadeInUp } from '../../lib/animations';

export const PredictiveIntelligence: React.FC = () => {
  const forecastData = [
    { label: 'Jun (Actual)', value: 3.42, change: 5.8, isForecast: false },
    { label: 'Jul (Actual)', value: 3.38, change: -1.1, isForecast: false },
    { label: 'Aug (Forecast)', value: 3.31, change: -2.0, isForecast: true },
    { label: 'Sep (Forecast)', value: 3.20, change: -3.3, isForecast: true },
    { label: 'Oct (Forecast)', value: 3.12, change: -2.5, isForecast: true },
    { label: 'Nov (Forecast)', value: 3.08, change: -1.2, isForecast: true },
  ];

  return (
    <section id="predictive-intelligence" className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            PREDICTIVE FORWARD MODELING
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            DON'T JUST ANALYZE WHAT HAPPENED.
            <br />
            <span className="text-gradient">PREDICT WHAT HAPPENS NEXT.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot shifts your perspective from reactive post-mortems to predictive foresight, forecasting financial performance 120 days into the future.
          </p>
        </motion.div>

        {/* Predictive Forecast Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Chart Forecast Canvas */}
          <div className="lg:col-span-7">
            <BusinessChart
              title="120-Day Forward Profit Trajectory Forecast"
              subtitle="Solid line = Historical | Dashed line = AI Forward Prediction (Dashed Indigo)"
              data={forecastData}
              type="forecast"
              colorTheme="forecast"
              height={260}
              prefix="₹"
              suffix=" Cr"
            />
          </div>

          {/* Forecast Analysis Box */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D0D0D] border border-[#242424] space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white font-mono uppercase">PREDICTED RISK PANEL</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 font-bold">
                PROFIT PRESSURE -9.9%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#070707] border border-[#1C1C1C] font-mono">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">CURRENT PROFIT</span>
                <span className="text-lg font-bold text-white">
                  <AnimatedNumber value={3.42} prefix="₹" suffix=" Cr" decimals={2} />
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">PROJECTED (NOV)</span>
                <span className="text-lg font-bold text-rose-400">
                  <AnimatedNumber value={3.08} prefix="₹" suffix=" Cr" decimals={2} />
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
                MAIN RISK DRIVERS DETECTED
              </span>
              <ul className="space-y-2 text-xs font-mono text-neutral-300">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Raw material purchasing costs escalating ↑</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Distributor order margins compressing ↓</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Customer mix shifting to lower-tier SKUs</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">
                PREVENTIVE RECOMMENDATION
              </span>
              <p className="text-xs text-white font-medium leading-relaxed">
                "Take corrective pricing & supplier negotiation actions before the upcoming purchasing cycle locks on September 1."
              </p>
            </div>

            <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg">
              <span>Execute Preventive Scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

