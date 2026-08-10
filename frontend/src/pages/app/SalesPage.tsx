import React from 'react';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const SalesPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono font-bold uppercase">
          SALES MODULE (sales.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Sales Acceleration & Orders
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Realtime order velocity, customer tier margins, and revenue per SKU category.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessChart
          title="Sales Velocity (₹ Lakh per Week)"
          data={[
            { label: 'Wk 1', value: 42.1 },
            { label: 'Wk 2', value: 48.6 },
            { label: 'Wk 3', value: 52.4 },
            { label: 'Wk 4', value: 61.8 },
          ]}
          type="area"
          colorTheme="cyan"
          prefix="₹"
          suffix=" L"
        />
        <BusinessChart
          title="Category Sales Mix"
          data={[
            { label: 'GI Pipes', value: 14.2 },
            { label: 'MS Tubes', value: 6.8 },
            { label: 'GP Sections', value: 3.8 },
          ]}
          type="bar"
          colorTheme="purple"
          prefix="₹"
          suffix=" Cr"
        />
      </div>
    </div>
  );
};
