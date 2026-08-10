import React from 'react';
import { FileText } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const InvoicesPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-mono font-bold uppercase">
          INVOICES & BILLING (invoices.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          GST Invoicing & Aging Collections
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          E-Way bill generation, pending collections aging, and tax reconciliation.
        </p>
      </div>

      <BusinessChart
        title="Accounts Receivable Collections Aging (₹ Cr)"
        data={[
          { label: '0-15 Days', value: 4.82 },
          { label: '16-30 Days', value: 2.45 },
          { label: '31-60 Days', value: 1.12 },
          { label: '60+ Days', value: 0.84 },
        ]}
        type="bar"
        colorTheme="cyan"
        prefix="₹"
        suffix=" Cr"
      />
    </div>
  );
};
