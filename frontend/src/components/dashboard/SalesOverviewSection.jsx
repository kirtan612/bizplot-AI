import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Users, Package, MapPin, Award } from 'lucide-react';

export default function SalesOverviewSection() {
  const topCustomers = [
    { name: 'Metro Infrastructure Solutions', revenue: '₹42,50,000', orders: 14, status: 'VIP Tier' },
    { name: 'Apex Industrial Solutions', revenue: '₹28,40,000', orders: 9, status: 'Healthy' },
    { name: 'Bharat Heavy Engineering', revenue: '₹24,10,000', orders: 7, status: 'Active' },
    { name: 'Gujarat Pipe Distributors', revenue: '₹18,90,000', orders: 6, status: 'Active' }
  ];

  const topProducts = [
    { name: 'Cold-Rolled Steel Coils (CR-4042)', units: '142 Tons', revenue: '₹68,40,000', share: '48%' },
    { name: 'Hot-Rolled Sheet Stock (HR-200)', units: '98 Tons', revenue: '₹34,20,000', share: '24%' },
    { name: 'Industrial Hydraulic Valve H-99', units: '320 Units', revenue: '₹27,20,000', share: '19%' },
    { name: 'Precision Brass Fasteners M8', units: '45,000 Units', revenue: '₹13,05,000', share: '9%' }
  ];

  const regionalSales = [
    { region: 'Western Region (MH/GJ)', share: '42%', value: '₹60.0L', growth: '+18.2%' },
    { region: 'Northern Region (DL/HR)', share: '31%', value: '₹44.2L', growth: '+12.4%' },
    { region: 'Southern Region (KA/TN)', share: '27%', value: '₹38.6L', growth: '+8.9%' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Customers Leaderboard */}
      <div className="p-6 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Top Customer Accounts
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Revenue Ranking</span>
        </div>

        <div className="space-y-2.5">
          {topCustomers.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30">
                  #{i + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{c.name}</div>
                  <div className="text-[11px] text-zinc-400">{c.orders} Orders placed</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400 font-mono">{c.revenue}</div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products Velocity & Regional Breakdown */}
      <div className="p-6 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Top Product Velocity & Regions
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Volume Share</span>
        </div>

        <div className="space-y-2.5">
          {topProducts.slice(0, 2).map((p, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{p.name}</span>
                <span className="font-mono text-purple-400 font-bold">{p.revenue}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Volume: {p.units}</span>
                <span>Revenue Share: {p.share}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: p.share }} />
              </div>
            </div>
          ))}

          {/* Regional Sales summary */}
          <div className="pt-2 grid grid-cols-3 gap-2">
            {regionalSales.map((r, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
                <div className="text-[10px] text-zinc-400 font-semibold truncate">{r.region.split(' ')[0]}</div>
                <div className="text-xs font-bold text-white font-mono">{r.value}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{r.growth}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
