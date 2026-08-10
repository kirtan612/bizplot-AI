import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const PurchasesPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/40 text-[10px] font-mono font-bold uppercase">
          PURCHASES & SUPPLIERS (purchases.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Supplier Procurement Telemetry
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Mill prices, raw material price surges, and supplier contract terms.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-4 font-mono text-xs shadow-xl">
        <div className="flex justify-between font-bold text-neutral-400 border-b border-[#1C1C1C] pb-2 text-[11px]">
          <span>SUPPLIER MILL</span>
          <span>PRICE SURGE</span>
          <span>CURRENT BASE RATE</span>
          <span>STATUS</span>
        </div>
        <div className="flex justify-between items-center text-neutral-300 py-2 border-b border-[#141414]">
          <span className="font-bold text-white">APL Apollo Mills</span>
          <span className="text-rose-400 font-bold">+9.2%</span>
          <span>₹64,200 / MT</span>
          <span className="text-amber-400 font-bold">Review Contract</span>
        </div>
        <div className="flex justify-between items-center text-neutral-300 py-2 border-b border-[#141414]">
          <span className="font-bold text-white">Hi-Tech Steel Tubes</span>
          <span className="text-emerald-400 font-bold">-4.1%</span>
          <span>₹61,500 / MT</span>
          <span className="text-emerald-400 font-bold">Preferred Vendor</span>
        </div>
      </div>
    </div>
  );
};
