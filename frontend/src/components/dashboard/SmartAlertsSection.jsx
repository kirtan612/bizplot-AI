import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function SmartAlertsSection() {
  const { setActiveTab } = useShell();
  const toast = useToast();
  const [filter, setFilter] = useState('All');

  const alerts = [
    {
      id: 'al-1',
      title: 'Customer Payment Overdue',
      description: 'Apex Industrial Solutions Invoice #INV-2026-890 (₹4,85,000) is 4 days overdue.',
      priority: 'High Priority',
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      tabTarget: 'finance'
    },
    {
      id: 'al-2',
      title: 'Inventory Threshold Below Safety Buffer',
      description: 'Cold-Rolled Steel Coils (CR-4042) dropped to 4.2 Tons (Minimum 5.0 Tons required).',
      priority: 'High Priority',
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      tabTarget: 'inventory'
    },
    {
      id: 'al-3',
      title: 'Profit Margin Declining in Western Region',
      description: 'Gross margin decreased 4.8% on Tier-2 contracts due to logistics price variance.',
      priority: 'Medium Priority',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      tabTarget: 'profit'
    },
    {
      id: 'al-4',
      title: 'Logistics Expense Increased 12%',
      description: 'Freight expenditure for Pune-Mumbai corridor exceeded standard monthly allocation.',
      priority: 'Medium Priority',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      tabTarget: 'finance'
    },
    {
      id: 'al-5',
      title: 'Working Capital Surplus Warning',
      description: 'Working capital ratio at 1.84x; recommend investing ₹3.5L in raw material stock.',
      priority: 'Low Priority',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      tabTarget: 'finance'
    }
  ];

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'High') return a.priority === 'High Priority';
    if (filter === 'Medium') return a.priority === 'Medium Priority';
    if (filter === 'Low') return a.priority === 'Low Priority';
    return true;
  });

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Smart Alert Radar</h3>
            <p className="text-xs text-zinc-400">Automated multi-variable risk detection</p>
          </div>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-1.5">
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === p
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((a) => (
          <div
            key={a.id}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/5 shrink-0 mt-0.5">
                {a.priority.includes('High') ? <ShieldAlert className="w-4 h-4 text-rose-400" /> :
                 a.priority.includes('Medium') ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                 <Info className="w-4 h-4 text-blue-400" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">{a.title}</h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${a.badgeClass}`}>
                    {a.priority}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">{a.description}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab(a.tabTarget);
                toast.info('Alert Action', `Navigating to ${a.tabTarget} to resolve alert.`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <span>Investigate Alert</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
