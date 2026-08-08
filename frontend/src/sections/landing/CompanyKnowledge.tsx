import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Database, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fadeInUp } from '../../lib/animations';

const SOURCES = [
  { name: 'Tally / ERP', desc: 'Accounting & Vouchers' },
  { name: 'Excel / CSV', desc: 'Custom Price Lists & MT Logs' },
  { name: 'PDF Invoices', desc: 'Supplier Bills & E-way Bills' },
  { name: 'GST Portal', desc: 'GSTR-1, 3B & ITC Reconciliation' },
  { name: 'CRM & Email', desc: 'Customer Quotations & Queries' },
  { name: 'Bank Feeds', desc: 'HDFC & ICICI Bank Statements' },
];

export const CompanyKnowledge: React.FC = () => {
  return (
    <section id="company-knowledge" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            PRIVATE ENTERPRISE CONTEXT ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            YOUR DATA.
            <br />
            <span className="text-gradient">YOUR CONTEXT. YOUR AI.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            BizPilot connects directly into your existing Indian accounting tools and files to build a private knowledge graph isolated to your company.
          </p>
        </motion.div>

        {/* Data Architecture Pipeline Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Step 1: Sources */}
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#202020] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">STAGE 1</span>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">RAW DATA SOURCES</h4>
            <div className="space-y-2">
              {SOURCES.map((s, idx) => (
                <div key={idx} className="p-2 rounded bg-[#141414] border border-[#222222] text-[11px]">
                  <span className="font-mono font-bold text-white block">{s.name}</span>
                  <span className="text-neutral-500 text-[10px] block">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Vector Ingestion */}
          <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-[#242424] space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#333333] flex items-center justify-center text-white">
                <Database className="w-6 h-6" />
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold block">STAGE 2</span>
            <h4 className="text-sm font-bold text-white font-mono">COMPANY KNOWLEDGE</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Vectorized indexing & multi-tenant isolation ensures zero cross-company data leakage.
            </p>
          </div>

          {/* Step 3: BizPilot AI Core */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181818] to-[#0D0D0D] border border-white/20 space-y-4 text-center shadow-2xl">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-xl">
                <Zap className="w-6 h-6 fill-black" />
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-white font-semibold block tracking-wider">STAGE 3</span>
            <h4 className="text-base font-extrabold text-white">BIZPILOT AI CORE</h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-mono">
              Autonomous Agent Execution Engine
            </p>
          </div>

          {/* Step 4: Outputs */}
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#202020] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">STAGE 4</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">INTELLIGENCE OUTPUTS</h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded bg-[#141414] border border-[#222222] text-neutral-300">
                ⚡ Instant Financial Answers
              </div>
              <div className="p-2.5 rounded bg-[#141414] border border-[#222222] text-neutral-300">
                📊 Profit Variance Insights
              </div>
              <div className="p-2.5 rounded bg-[#141414] border border-[#222222] text-neutral-300">
                🔮 Predictive Cashflow Alerts
              </div>
              <div className="p-2.5 rounded bg-[#141414] border border-[#222222] text-neutral-300">
                🎯 Executive Action Plans
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
