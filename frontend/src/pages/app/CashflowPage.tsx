import React from 'react';
import { Wallet } from 'lucide-react';
import { InteractiveCashflowDiagram } from '../../components/InteractiveCashflowDiagram';

export const CashflowPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-bold uppercase">
          CASHFLOW TELEMETRY (cashflow.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Working Capital & Cash Pipeline
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Realtime treasury telemetry tracing collections, supplier disbursements, and liquidity buffers.
        </p>
      </div>

      <InteractiveCashflowDiagram />
    </div>
  );
};
