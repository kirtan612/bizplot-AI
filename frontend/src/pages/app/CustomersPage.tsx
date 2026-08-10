import React from 'react';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold uppercase">
          CUSTOMER INTELLIGENCE (customers.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Customer Accounts & Retention
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Order gap acceleration, churn probability, and distributor credit telemetry.
        </p>
      </div>

      <div className="rounded-2xl bg-[#0A0A0A] border border-[#222222] p-6 space-y-4 font-mono text-xs shadow-xl">
        <div className="flex justify-between font-bold text-neutral-400 border-b border-[#1C1C1C] pb-2 text-[11px]">
          <span>CUSTOMER ACCOUNT</span>
          <span>HEALTH STATUS</span>
          <span>LAST ORDER GAP</span>
          <span>CLV</span>
          <span>ACTION RECOMMENDATION</span>
        </div>

        <div className="flex justify-between items-center text-neutral-300 py-2 border-b border-[#141414]">
          <span className="font-bold text-white">ABC Industries Ltd. (Surat)</span>
          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/40 font-bold">At Risk (88%)</span>
          <span>42 Days (+28d gap)</span>
          <span>₹1.84 Cr</span>
          <span className="text-cyan-400 underline cursor-pointer">Dispatch Tier Discount Offer</span>
        </div>

        <div className="flex justify-between items-center text-neutral-300 py-2 border-b border-[#141414]">
          <span className="font-bold text-white">Shree Engineering (Ahmedabad)</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">Healthy (96%)</span>
          <span>6 Days Ago</span>
          <span>₹94.2 L</span>
          <span className="text-neutral-400">Standard Annual Renewal</span>
        </div>
      </div>
    </div>
  );
};
