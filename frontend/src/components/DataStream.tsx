import React from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, Zap } from 'lucide-react';

const DATA_NODES = [
  { label: 'Sales Invoices', code: 'INV-2026-894', amount: '₹4.8 L' },
  { label: 'GST Filings', code: 'GSTR-3B', status: 'Verified' },
  { label: 'Customer Orders', code: 'ORD-9921', amount: '₹12.5 L' },
  { label: 'Supplier Ledger', code: 'SUP-APL-01', amount: '₹18.4 L' },
  { label: 'Inventory SKU', code: 'MS-PIPE-100', qty: '45.2 MT' },
  { label: 'Cash Transactions', code: 'PAY-HDFC-99', amount: '₹8.9 L' },
];

export const DataStream: React.FC = () => {
  return (
    <div className="relative w-full py-12 px-6 rounded-2xl bg-[#080808] border border-[#1E1E1E] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Input Nodes */}
        <div className="w-full lg:w-5/12 grid grid-cols-2 gap-3">
          {DATA_NODES.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-lg bg-[#0F0F0F] border border-[#222222] hover:border-[#333333] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-neutral-400 font-semibold">{node.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-500">{node.code}</span>
                <span className="font-mono text-white font-bold">{node.amount || node.qty || node.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Convergence Stream */}
        <div className="w-full lg:w-2/12 flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border border-dashed border-neutral-600 flex items-center justify-center"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-white/20">
                <Zap className="w-6 h-6 fill-black text-black" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-3 font-semibold">
            Neural Processing Engine
          </span>
        </div>

        {/* Right Output Intelligence */}
        <div className="w-full lg:w-5/12 space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#141414] to-[#0A0A0A] border border-[#262626]">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Unified Context Graph</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every invoice, transaction, customer movement, and inventory update is continuously transformed into financial predictions & operational intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
