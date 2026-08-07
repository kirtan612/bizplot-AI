import React from 'react';
import { Users, UserCheck, ShieldAlert, CreditCard, Award } from 'lucide-react';

export default function CustomerOverviewSection() {
  const stats = [
    { title: 'Active Accounts', value: '42', subtitle: '+4 New this quarter', icon: Users, color: 'text-blue-400' },
    { title: 'Repeat Customers', value: '88.4%', subtitle: 'High retention rate', icon: UserCheck, color: 'text-emerald-400' },
    { title: 'Churn Risk Accounts', value: '2', subtitle: 'Requires credit review', icon: ShieldAlert, color: 'text-rose-400' },
    { title: 'Credit Utilization', value: '64.2%', subtitle: '₹34.8L / ₹54.0L Credit Limit', icon: CreditCard, color: 'text-purple-400' }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Intelligence & Credit Index</h3>
            <p className="text-xs text-zinc-400">42 Active Accounts | 0.4% Default Rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">{item.title}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{item.value}</div>
              <p className="text-[11px] text-zinc-400">{item.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
