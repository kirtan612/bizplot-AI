import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Users, ArrowDownRight, ArrowUpRight, Building2, CreditCard, Sparkles } from 'lucide-react';

interface FlowNode {
  id: string;
  name: string;
  category: string;
  amount: string;
  date: string;
  status: 'inflow' | 'buffer' | 'outflow';
  icon: React.ElementType;
  detail: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'cust',
    name: 'Customer Collections',
    category: 'INFLOW SOURCE',
    amount: '+₹72.0 Lakh',
    date: 'Expected Aug 14 - Aug 28',
    status: 'inflow',
    icon: Users,
    detail: 'Patel Industrial (₹42 L) + Shree Engineering (₹30 L) clearing via RTGS.',
  },
  {
    id: 'treasury',
    name: 'Treasury Cash Buffer',
    category: 'CURRENT LIQUIDITY',
    amount: '₹1.86 Cr',
    date: 'Live Account Balance',
    status: 'buffer',
    icon: Wallet,
    detail: 'HDFC Current Account (₹1.24 Cr) + ICICI Escrow (₹62 L).',
  },
  {
    id: 'suppliers',
    name: 'Supplier Credit Payables',
    category: 'OUTFLOW TARGET',
    amount: '-₹42.0 Lakh',
    date: 'Due Aug 18, 2026',
    status: 'outflow',
    icon: Building2,
    detail: 'APL Apollo Mills GI Sheet shipment settlement (Invoice #APL-8842).',
  },
  {
    id: 'expenses',
    name: 'OpEx & Loan Obligations',
    category: 'RECURRING OUTFLOW',
    amount: '-₹49.0 Lakh',
    date: 'Due Aug 31, 2026',
    status: 'outflow',
    icon: CreditCard,
    detail: 'Logistics freight charges + GST tax liability + MSME vendor credit.',
  },
];

export const InteractiveCashflowDiagram: React.FC = () => {
  const [activeNode, setActiveNode] = useState<FlowNode>(FLOW_NODES[1]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0B0B] border border-[#222222] shadow-2xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE MONEY PIPELINE (NEXT 30 DAYS)</span>
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Hover or Click Any Flow Node to Inspect Detailed Allocation
          </h3>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
            NET BUFFER: ₹1.86 Cr
          </span>
        </div>
      </div>

      {/* Visual Pipeline Flow Graph */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {FLOW_NODES.map((node) => {
          const isSelected = activeNode.id === node.id;
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              onClick={() => setActiveNode(node)}
              onMouseEnter={() => setActiveNode(node)}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? node.status === 'inflow'
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                    : node.status === 'outflow'
                    ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                    : 'bg-purple-950/30 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                  : 'bg-[#101010] border-[#222222] hover:border-[#333333]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    node.status === 'inflow'
                      ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                      : node.status === 'outflow'
                      ? 'bg-rose-950 border-rose-800 text-rose-400'
                      : 'bg-purple-950 border-purple-800 text-purple-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  {node.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight">{node.name}</h4>
              <span
                className={`text-lg font-extrabold font-mono block mt-1 ${
                  node.status === 'inflow'
                    ? 'text-emerald-400'
                    : node.status === 'outflow'
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {node.amount}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono block mt-2">{node.date}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <motion.div
        key={activeNode.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-[#141414] border border-[#282828] space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase text-white">{activeNode.name}</span>
            <span className="text-[10px] font-mono text-neutral-400">({activeNode.category})</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-white">{activeNode.amount}</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed font-mono">{activeNode.detail}</p>
      </motion.div>
    </div>
  );
};
