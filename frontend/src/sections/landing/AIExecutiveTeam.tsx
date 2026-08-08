import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Activity,
  TrendingUp,
  Shield,
  ShoppingCart,
  Users,
  Truck,
  PieChart,
  Bot,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { ExecutiveNode } from '../../components/ExecutiveNode';
import type { ExecutiveData } from '../../components/ExecutiveNode';
import { fadeInUp } from '../../lib/animations';

const EXECUTIVES: ExecutiveData[] = [
  {
    id: 'cfo',
    role: 'CFO AI',
    title: 'Chief Financial Officer',
    status: 'alert',
    alertTitle: 'Profit Margin Compression Risk',
    metricLabel: 'Projected Q3 Impact',
    metricValue: '-₹38.4 Lakh',
    drivers: ['Raw Material Cost (+12.4%)', 'Distributor Discounting (+2.1%)', 'Low Margin Pipe Orders'],
    recommendation: 'Freeze discretionary discounts on order sizes under 10 MT.',
    icon: DollarSign,
  },
  {
    id: 'coo',
    role: 'COO AI',
    title: 'Chief Operating Officer',
    status: 'warning',
    alertTitle: 'Supplier Lead-Time Delays',
    metricLabel: 'Average Delay',
    metricValue: '+9 Days',
    drivers: ['APL Apollo Mill Maintenance', 'Logistics Bottleneck (GJ-01 Route)'],
    recommendation: 'Reroute secondary purchases to Hi-Tech Pipes till August 15.',
    icon: Activity,
  },
  {
    id: 'sales',
    role: 'SALES AI',
    title: 'Executive VP of Sales',
    status: 'alert',
    alertTitle: 'High-Value Customer Churn Warning',
    metricLabel: 'At Risk Revenue',
    metricValue: '₹1.42 Cr',
    drivers: ['ABC Industries purchase gap > 45 days', 'Metro Components pricing query'],
    recommendation: 'Dispatch Key Account Manager for in-person commercial review.',
    icon: ShoppingCart,
  },
  {
    id: 'cmo',
    role: 'CMO AI',
    title: 'Chief Marketing Officer',
    status: 'active',
    alertTitle: 'High-LTV Industrial Segment Growth',
    metricLabel: 'Conversion Rate',
    metricValue: '+18.6%',
    drivers: ['Infrastructure Builder Campaign', 'Direct Mill Procurement Pitch'],
    recommendation: 'Double allocation to EPC contractor outreach channels.',
    icon: TrendingUp,
  },
  {
    id: 'supplychain',
    role: 'SUPPLY CHAIN AI',
    title: 'Supply Chain Director',
    status: 'warning',
    alertTitle: 'Inventory Stock-out Risk',
    metricLabel: 'GI Pipe Buffer',
    metricValue: '12 Days Left',
    drivers: ['Ahmedabad Hub Demand Spike', 'Delayed Inbound Rake'],
    recommendation: 'Issue purchase order for 120 MT GP Pipes immediately.',
    icon: Truck,
  },
  {
    id: 'cto',
    role: 'CTO AI',
    title: 'Chief Technology Officer',
    status: 'active',
    alertTitle: 'ERP & Bank Telemetry Healthy',
    metricLabel: 'Sync Latency',
    metricValue: '84 ms',
    drivers: ['Tally Sync Engine active', 'GST Portal API linked'],
    recommendation: 'System operating at peak speed with zero data lag.',
    icon: Shield,
  },
  {
    id: 'hr',
    role: 'HR AI',
    title: 'Human Resources Director',
    status: 'active',
    alertTitle: 'Sales Team Capacity High',
    metricLabel: 'Workload Utilization',
    metricValue: '94.2%',
    drivers: ['Q3 Onboarding pending', 'West Zone Territory expansion'],
    recommendation: 'Approve 2 senior industrial sales hires.',
    icon: Users,
  },
  {
    id: 'bi',
    role: 'BI ANALYST AI',
    title: 'Business Intelligence AI',
    status: 'active',
    alertTitle: 'Regional Sales Variance Analysis',
    metricLabel: 'West Zone Lead',
    metricValue: '+24.1% YoY',
    drivers: ['Gujarat Solar Infra Projects', 'Water Grid Pipe Orders'],
    recommendation: 'Maintain allocation shift toward Gujarat territory.',
    icon: PieChart,
  },
];

export const AIExecutiveTeam: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('cfo');
  const selectedExec = EXECUTIVES.find((e) => e.id === selectedId) || EXECUTIVES[0];

  return (
    <section id="ai-executives" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            SYNTHETIC EXECUTIVE COUNCIL
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ONE AI EXECUTIVE TEAM.
            <br />
            <span className="text-gradient">YOUR ENTIRE BUSINESS.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Instead of fragmented dashboards, BizPilot assigns autonomous AI executives to every division of your enterprise. Click an executive to inspect their live telemetry.
          </p>
        </motion.div>

        {/* Executive Network Grid + Inspection Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Executive Nodes Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXECUTIVES.map((exec) => (
              <ExecutiveNode
                key={exec.id}
                executive={exec}
                isActive={selectedId === exec.id}
                onSelect={() => setSelectedId(exec.id)}
              />
            ))}
          </div>

          {/* Live Executive Command Inspector */}
          <div className="lg:col-span-5 sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExec.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-[#0C0C0C] border border-[#262626] shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-white text-black font-bold">
                      <selectedExec.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                        LIVE TELEMETRY INTERFACE
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedExec.role}</h3>
                      <p className="text-xs text-neutral-500">{selectedExec.title}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-full border ${selectedExec.status === 'alert'
                        ? 'bg-rose-950/50 text-rose-400 border-rose-800/40'
                        : selectedExec.status === 'warning'
                          ? 'bg-amber-950/50 text-amber-400 border-amber-800/40'
                          : 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40'
                      }`}
                  >
                    {selectedExec.status.toUpperCase()}
                  </span>
                </div>

                {/* Primary Alert Banner */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#292929] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 font-semibold">{selectedExec.alertTitle}</span>
                    <span className="text-white font-bold">{selectedExec.metricValue}</span>
                  </div>
                </div>

                {/* Key Drivers */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block tracking-wider">
                    PRIMARY DRIVERS DETECTED
                  </span>
                  <div className="space-y-1.5">
                    {selectedExec.drivers.map((driver, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-neutral-300 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended AI Action */}
                <div className="p-4 rounded-xl bg-[#080808] border border-[#222222] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
                    RECOMMENDED AI ACTION
                  </span>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    "{selectedExec.recommendation}"
                  </p>
                </div>

                <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg">
                  <span>Authorize Executive Action</span>
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
