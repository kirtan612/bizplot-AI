import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  LineChart,
  Sparkles,
  Lightbulb,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function SolutionWorkflow({ onGetStarted }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'monitor',
      num: '01',
      title: 'Continuous Monitor',
      subtitle: 'Real-time multi-channel data ingestion',
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      description:
        'Connects seamlessly to PostgreSQL databases, CSV register uploads, POS terminals, and ERP systems for instant stream ingestion.',
      simulatedOutput: {
        status: 'INGESTING LIVE STREAM',
        metrics: 'Sync Status: 100% Consistent',
        codeSnippet: `[STREAM] CSV Ingress -> Validator Engine -> PostgreSQL\n[STATUS] Parsed 4,892 Ledger Records in 184ms\n[INTEGRITY] Zero Null FK Violations`
      }
    },
    {
      id: 'analyze',
      num: '02',
      title: 'Deep Statistical Analysis',
      subtitle: 'Anomaly detection & margin audit',
      icon: LineChart,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      description:
        'Scans historical P&L, SKU velocity, vendor pricelists, and overhead costs to spot hidden margin leaks instantly.',
      simulatedOutput: {
        status: 'MARGIN LEAK DIAGNOSED',
        metrics: 'Potential Recovery: $18,400 / quarter',
        codeSnippet: `[ANALYTIC_ENGINE] Auditing Supplier SKU-809\n[ALERT] Freight cost overrun of +$3.40/unit vs contract\n[ACTIONABLE] Flagged for renegotiation`
      }
    },
    {
      id: 'predict',
      num: '03',
      title: 'Predictive Modeling',
      subtitle: 'Cash runway & demand forecasting',
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      description:
        'Simulates 90-day forward cash flow scenarios, inventory stockout risks, and seasonal demand surges with high accuracy.',
      simulatedOutput: {
        status: 'FORECAST MODEL READY',
        metrics: '90-Day Liquidity Buffer: $284.5k',
        codeSnippet: `[FORECAST_MONTE_CARLO] 10,000 Sim Runs Completed\n[PROBABILITY] 96.2% confidence of positive cashflow\n[DEADSTOCK_ALERT] 480 units of SKU-102 entering decay window`
      }
    },
    {
      id: 'recommend',
      num: '04',
      title: 'AI Strategic Recommendations',
      subtitle: 'High-ROI executive playbooks',
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      description:
        'AI C-Suite generates prioritized, data-backed step-by-step action plans tailored specifically for your business goals.',
      simulatedOutput: {
        status: 'RECOMMENDATION GENERATED',
        metrics: 'Est. Net ROI: +$32,000',
        codeSnippet: `[AI_CFO_PLAYBOOK] Strategy #409: Supplier Re-Order\n[RECOMMENDATION] Shift 15% procurement to Vendor B\n[EFFECT] Saves $32,000 & improves lead time by 4 days`
      }
    },
    {
      id: 'automate',
      num: '05',
      title: 'Workflow Automation',
      subtitle: 'Autonomous trigger execution',
      icon: Cpu,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      description:
        'Automates re-order triggers, payment reminders, stock re-allocation, and customer re-engagement without manual effort.',
      simulatedOutput: {
        status: 'AUTONOMOUS TRIGGER ACTIVE',
        metrics: 'PO #8842 auto-drafted',
        codeSnippet: `[AUTONOMOUS_TRIGGER] Threshold Trigger: Reorder Point Met\n[GENERATED] Purchase Order #8842 sent to vendor\n[LOG] Human approval queue notified`
      }
    },
    {
      id: 'execute',
      num: '06',
      title: 'One-Click Execution',
      subtitle: 'Human-in-the-loop validation',
      icon: CheckCircle2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      description:
        'Approve AI recommendations with a single click while maintaining full executive governance and audit logs.',
      simulatedOutput: {
        status: 'EXECUTION COMPLETE',
        metrics: 'Audit Trail: Verified by Executive',
        codeSnippet: `[COMMITTED] Action #9042 executed successfully\n[LEDGER_UPDATE] PostgreSQL state synced\n[REAL-TIME] Dashboard KPI updated instantly`
      }
    }
  ];

  return (
    <section id="solutions" className="py-32 bg-[#0c0c0f] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
            <Zap className="w-3.5 h-3.5" />
            THE BIZPILOT INTELLIGENCE LOOP
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            From Raw Data to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Autonomous Execution.
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-base leading-relaxed">
            BizPilot AI operates as a continuous 6-step loop, transforming raw spreadsheets into high-ROI business decisions in real time.
          </p>
        </div>

        {/* Step Selector Grid & Console Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Step Selector Buttons */}
          <div className="lg:col-span-6 space-y-3.5">
            {steps.map((st, idx) => {
              const IconComp = st.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={st.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-[20px] border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-zinc-900 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                      : 'bg-[#121215]/60 border-white/[0.06] hover:bg-zinc-900/50 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-zinc-500 w-6">{st.num}</span>
                    <div className={`p-2.5 rounded-xl ${st.bg} ${st.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white font-sans">{st.title}</h4>
                      <p className="text-xs text-zinc-400 font-normal">{st.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-blue-400 translate-x-1' : 'text-zinc-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Console Preview Display */}
          <div className="lg:col-span-6">
            <div className="bg-[#09090b] border border-white/10 rounded-[20px] p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                    STEP {steps[activeStep].num} // {steps[activeStep].title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-md">
                  LATENCY: 12ms
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {steps[activeStep].description}
                  </p>

                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">STATE:</span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {steps[activeStep].simulatedOutput.status}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">LIVE METRIC:</span>
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      {steps[activeStep].simulatedOutput.metrics}
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-[#050507] border border-white/10 font-mono text-xs text-zinc-300 whitespace-pre-line leading-relaxed shadow-inner">
                    {steps[activeStep].simulatedOutput.codeSnippet}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={onGetStarted}
                  className="h-12 px-6 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                >
                  Try Intelligence Engine
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
