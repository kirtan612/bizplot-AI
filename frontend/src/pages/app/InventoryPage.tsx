import React from 'react';
import { Box } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-bold uppercase">
          INVENTORY TELEMETRY (inventory.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Inventory SKUs & Stock Valuation
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Realtime warehouse tonnage, slow-moving SKUs, and dead capital analysis.
        </p>
      </div>

      <BusinessChart
        title="Current Yard Tonnage Stock Valuation (MT)"
        data={[
          { label: 'GI Pipes 2"', value: 420 },
          { label: 'GI Pipes 4"', value: 310 },
          { label: 'MS Tubes 1.5"', value: 280 },
          { label: 'GP Sections 80x40', value: 190 },
        ]}
        type="bar"
        colorTheme="emerald"
        suffix=" MT"
      />
    </div>
  );
};
