import React from 'react';
import { PieChart, Download, FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono font-bold uppercase">
          REPORTS HUB (reports.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Executive Reports & Audit Logs
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Download certified GST GSTR-1/3B audit summaries, P&L statements, and inventory valuation ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-4 font-mono">
          <FileText className="w-8 h-8 text-cyan-400" />
          <h3 className="text-base font-bold text-white">GST GSTR-3B Reconciliation</h3>
          <p className="text-xs text-neutral-400">Monthly tax liability & ITC claim verification log.</p>
          <button className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#262626] text-xs text-cyan-400 font-bold flex items-center space-x-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-4 font-mono">
          <PieChart className="w-8 h-8 text-purple-400" />
          <h3 className="text-base font-bold text-white">Executive Profit & Loss Statement</h3>
          <p className="text-xs text-neutral-400">Quarterly SKU level margin contribution report.</p>
          <button className="px-3 py-1.5 rounded-lg bg-[#141414] border border-[#262626] text-xs text-purple-400 font-bold flex items-center space-x-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
