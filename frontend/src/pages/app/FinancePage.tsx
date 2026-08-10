import React from 'react';
import { DollarSign } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const FinancePage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/40 text-[10px] font-mono font-bold uppercase">
          FINANCE & LEDGERS (finance.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Financial Telemetry & Balance Sheet
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Tally & GST synchronized ledgers, gross margin contribution, and net working capital.
        </p>
      </div>

      <BusinessChart
        title="Gross Profit Margin Contribution Drift (₹ Cr)"
        data={[
          { label: 'Q1 FY26', value: 3.80 },
          { label: 'Q2 FY26', value: 3.65 },
          { label: 'Q3 FY26 (Est)', value: 3.42 },
        ]}
        type="area"
        colorTheme="purple"
        prefix="₹"
        suffix=" Cr"
      />
    </div>
  );
};
