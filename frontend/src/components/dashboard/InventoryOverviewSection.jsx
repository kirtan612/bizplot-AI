import React from 'react';
import { Package, AlertTriangle, RefreshCw, Warehouse, Flame, Archive } from 'lucide-react';

export default function InventoryOverviewSection() {
  const stockAlerts = [
    { sku: 'CR-4042', name: 'Cold-Rolled Steel Coils', stock: '4.2 Tons', reorder: '5.0 Tons', status: 'CRITICAL LOW' },
    { sku: 'BF-M8', name: 'Precision Brass Fasteners M8', stock: '12,000 Pcs', reorder: '15,000 Pcs', status: 'REORDER REQD' }
  ];

  const fastMoving = [
    { sku: 'HR-200', name: 'Hot-Rolled Sheet Stock', velocity: '18.4 Tons/wk', turnover: '4.2 Days' },
    { sku: 'HV-99', name: 'Hydraulic Valve H-99', velocity: '45 Units/wk', turnover: '6.1 Days' }
  ];

  const warehouses = [
    { name: 'Main Yard (Mumbai Port)', capacity: '65% Utilized', stockValue: '₹34.5L', status: 'Optimal' },
    { name: 'Pune Manufacturing Plant', capacity: '48% Utilized', stockValue: '₹20.1L', status: 'Optimal' }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Inventory Intelligence Matrix</h3>
            <p className="text-xs text-zinc-400">Total Valuation: ₹54,60,000 | 48 Active SKUs Across 2 Warehouses</p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-mono">
          2 Stock Reorder Triggers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stock Alerts Card */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Reorder Alerts</span>
          </div>

          <div className="space-y-2">
            {stockAlerts.map((item, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Stock: {item.stock}</span>
                  <span>Min: {item.reorder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fast Moving SKUs */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Fast Moving Products</span>
          </div>

          <div className="space-y-2">
            {fastMoving.map((item, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs space-y-1">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Velocity: {item.velocity}</span>
                  <span className="text-emerald-400">Turnover: {item.turnover}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Capacity Summary */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Warehouse className="w-4 h-4" />
            <span>Warehouse Summary</span>
          </div>

          <div className="space-y-2">
            {warehouses.map((w, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span className="truncate">{w.name}</span>
                  <span className="text-[10px] text-blue-400 font-mono">{w.stockValue}</span>
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>{w.capacity}</span>
                  <span className="text-emerald-400">{w.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
