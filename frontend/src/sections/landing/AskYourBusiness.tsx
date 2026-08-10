import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';
import { fadeInUp } from '../../lib/animations';

interface PromptPreset {
  id: string;
  question: string;
  category: string;
  answer: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  chartTheme?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'forecast';
  chartData?: { label: string; value: number }[];
  tableData?: { label: string; detail: string; value: string }[];
  recommendation: string;
}

const PRESETS: PromptPreset[] = [
  {
    id: 'risk-customers',
    question: 'Which customers are at risk?',
    category: 'CUSTOMER INTELLIGENCE',
    answer: '4 accounts show declining purchase frequencies. ABC Industries is at highest risk due to a 42-day gap.',
    keyMetricLabel: 'AT RISK REVENUE',
    keyMetricValue: '₹1.84 Cr',
    chartTheme: 'rose',
    chartData: [
      { label: 'ABC Ind', value: 1.84 },
      { label: 'Metro', value: 0.68 },
      { label: 'Others', value: 0.42 },
    ],
    tableData: [
      { label: 'ABC Industries', detail: 'Order gap expanded to 42 days', value: 'High Risk' },
      { label: 'Metro Components', detail: 'Volume dropped 35% in last order', value: 'Medium Risk' },
    ],
    recommendation: 'Dispatch Key Account Manager for price review before Q3 procurement.',
  },
  {
    id: 'profit-fall',
    question: 'Why did profit fall?',
    category: 'PROFIT INTELLIGENCE',
    answer: 'Gross profit fell by ₹33.5 Lakh due to a 12.4% surge in raw material sheets and excess distributor discounts.',
    keyMetricLabel: 'MARGIN SURGE COST',
    keyMetricValue: '+₹18.4 Lakh',
    chartTheme: 'amber',
    chartData: [
      { label: 'Raw Mat', value: 18.4 },
      { label: 'Discount', value: 7.2 },
      { label: 'Freight', value: 4.8 },
      { label: 'Low Marg', value: 3.1 },
    ],
    tableData: [
      { label: 'Raw Material Sheet Rise', detail: 'APL Apollo Mill price bump', value: '+₹18.4 L' },
      { label: 'Distributor Discounting', detail: 'Uncapped commercial discount', value: '+₹7.2 L' },
    ],
    recommendation: 'Freeze discretionary discounts on orders below 10 MT.',
  },
  {
    id: 'high-margin',
    question: 'Which products have the highest margin?',
    category: 'PRODUCT ANALYTICS',
    answer: 'GI Heavy Duty Pipes (100mm) carry the highest gross margin at 24.2%, followed by GP Square Tubes at 19.8%.',
    keyMetricLabel: 'TOP MARGIN SKU',
    keyMetricValue: '24.2% Margin',
    chartTheme: 'emerald',
    chartData: [
      { label: '100mm GI', value: 24.2 },
      { label: 'GP 50x50', value: 19.8 },
      { label: 'MS Tube', value: 16.4 },
    ],
    tableData: [
      { label: 'GI Heavy Duty 100mm Pipe', detail: 'IS 1239 Grade A', value: '24.2%' },
      { label: 'GP Square Tube 50x50', detail: 'Hi-Tech Tier', value: '19.8%' },
    ],
    recommendation: 'Prioritize sales commission incentives toward 100mm GI Pipe inventory.',
  },
  {
    id: 'cash-requirement',
    question: 'How much cash will we need?',
    category: 'CASHFLOW FORECAST',
    answer: 'Projected net working capital requirement over the next 30 days is ₹19 Lakh. Recommended buffer: ₹25 Lakh.',
    keyMetricLabel: 'CASH BUFFER NEED',
    keyMetricValue: '₹25.0 Lakh',
    chartTheme: 'cyan',
    chartData: [
      { label: 'Current', value: 1.86 },
      { label: 'Inflows', value: 0.72 },
      { label: 'Outflows', value: 0.91 },
      { label: 'Buffer', value: 0.25 },
    ],
    tableData: [
      { label: 'Expected Inflows', detail: 'Customer Collections', value: '+₹72 L' },
      { label: 'Expected Outflows', detail: 'Supplier + OpEx + Loans', value: '-₹91 L' },
    ],
    recommendation: 'Expedite HDFC collection clearing for Patel Industrial invoice.',
  },
  {
    id: 'expensive-suppliers',
    question: 'Which suppliers became expensive?',
    category: 'SUPPLY CHAIN ANALYTICS',
    answer: 'APL Apollo Mill pricing increased 9.2% over last 60 days. Hi-Tech Pipes remains 4.1% more competitive.',
    keyMetricLabel: 'SUPPLIER PRICE SURGE',
    keyMetricValue: '+9.2%',
    chartTheme: 'purple',
    chartData: [
      { label: 'APL Apollo', value: 64.2 },
      { label: 'Hi-Tech', value: 61.5 },
      { label: 'Surya', value: 62.8 },
    ],
    tableData: [
      { label: 'APL Apollo Mills', detail: 'GI Sheet Base Price', value: '₹64,200 / MT' },
      { label: 'Hi-Tech Steel Tubes', detail: 'Equivalent Specification', value: '₹61,500 / MT' },
    ],
    recommendation: 'Shift 30% allocation to Hi-Tech Steel Tubes for Ahmedabad warehouse.',
  },
  {
    id: 'weekly-focus',
    question: 'What should I focus on this week?',
    category: 'EXECUTIVE AGENDA',
    answer: 'Three high-priority items require executive sign-off: ABC Industries renewal, Hi-Tech supply PO, and cash buffer.',
    keyMetricLabel: 'PRIORITY COUNT',
    keyMetricValue: '3 Actions',
    chartTheme: 'forecast',
    tableData: [
      { label: 'ABC Industries Retention', detail: 'Commercial contract review', value: 'Urgent' },
      { label: 'GI Pipe Reorder (120 MT)', detail: 'Prevent stock-out in Rajkot', value: 'High' },
    ],
    recommendation: 'Approve the Q3 distributor pricing guidelines in BizPilot Command.',
  },
];

export const AskYourBusiness: React.FC = () => {
  const [activePreset, setActivePreset] = useState<PromptPreset>(PRESETS[0]);

  return (
    <section className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            INSTANT INTELLIGENCE COMMAND
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            YOUR BUSINESS.
            <br />
            <span className="text-gradient">JUST ASK.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Click any question to experience how BizPilot instantly converts complex multi-table business queries into clear numbers, charts, and recommendations.
          </p>
        </motion.div>

        {/* Interactive Query Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preset Questions List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold tracking-wider block px-1">
              SUGGESTED EXECUTIVE QUESTIONS
            </span>
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#181818] border-cyan-400/60 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0D0D0D] border-[#1F1F1F] text-neutral-400 hover:border-[#333333] hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                    <span className="text-xs sm:text-sm font-semibold">{preset.question}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-cyan-400' : 'opacity-0 group-hover:opacity-100 text-neutral-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Output Window */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreset.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-2xl bg-[#0D0D0D] border border-[#262626] shadow-2xl space-y-6"
              >
                {/* Query Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-semibold">
                      {activePreset.category}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                      "{activePreset.question}"
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">{activePreset.keyMetricLabel}</span>
                    <span className="text-base font-extrabold font-mono text-cyan-400">
                      {activePreset.keyMetricValue}
                    </span>
                  </div>
                </div>

                {/* AI Text Response */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-white font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>BizPilot AI Analysis</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {activePreset.answer}
                  </p>
                </div>

                {/* Optional Chart Preview */}
                {activePreset.chartData && (
                  <BusinessChart
                    title={`${activePreset.category} Visual Breakdown`}
                    data={activePreset.chartData}
                    type="bar"
                    colorTheme={activePreset.chartTheme || 'cyan'}
                    height={150}
                    prefix=""
                    suffix=""
                  />
                )}

                {/* Table Data Preview */}
                {activePreset.tableData && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold tracking-wider block">
                      SUPPORTING TELEMETRY BREAKDOWN
                    </span>
                    <div className="divide-y divide-[#1A1A1A] rounded-xl bg-[#060606] border border-[#1A1A1A] p-3">
                      {activePreset.tableData.map((row, i) => (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-white font-bold block">{row.label}</span>
                            <span className="text-[10px] text-neutral-500 block">{row.detail}</span>
                          </div>
                          <span className="text-white font-extrabold">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-4 rounded-xl bg-[#080808] border border-[#202020] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
                    DIRECTIVE RECOMMENDATION
                  </span>
                  <p className="text-xs text-white font-medium">
                    "{activePreset.recommendation}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

