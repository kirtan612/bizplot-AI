import React from 'react';
import { CreditCard } from 'lucide-react';
import { BusinessChart } from '../../components/BusinessChart';

export const ExpensesPage: React.FC = () => {
  return (
    <div className="space-y-8 text-white font-sans max-w-7xl mx-auto">
      <div className="pb-6 border-b border-[#1E1E1E]">
        <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/40 text-[10px] font-mono font-bold uppercase">
          EXPENSE CONTROL (expenses.view)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Operational Expense Control
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Freight logistics, warehouse overhead, sales commissions, and administrative OPEX.
        </p>
      </div>

      <BusinessChart
        title="Monthly OPEX Breakdown (₹ Lakh)"
        data={[
          { label: 'Freight Logistics', value: 14.8 },
          { label: 'Warehouse Power', value: 4.2 },
          { label: 'Sales Incentives', value: 6.5 },
          { label: 'Admin Overhead', value: 3.1 },
        ]}
        type="bar"
        colorTheme="rose"
        prefix="₹"
        suffix=" L"
      />
    </div>
  );
};
