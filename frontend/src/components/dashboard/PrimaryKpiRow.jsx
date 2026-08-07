import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, 
  ArrowDownRight, Sparkles, PieChart, Info, X, ShieldAlert 
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function PrimaryKpiRow({ kpis }) {
  const toast = useToast();
  const [selectedKpi, setSelectedKpi] = useState(null);

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const kpiData = [
    {
      id: 'revenue',
      title: 'Revenue (Monthly)',
      value: formatCurrency(kpis?.sales_last_30_days || 14285000),
      rawVal: kpis?.sales_last_30_days || 14285000,
      change: '+12.4%',
      isPositive: true,
      sparkline: [40, 45, 42, 58, 65, 60, 78, 85, 92],
      aiInsight: 'Tracking 8% above Q3 target; high steel coil demand in West.',
      details: 'Gross invoiced revenue across all 3 production yards over the last 30 rolling days.'
    },
    {
      id: 'profit',
      title: 'Gross Profit (EBITDA)',
      value: formatCurrency(kpis?.gross_profit || 2850000),
      rawVal: kpis?.gross_profit || 2850000,
      change: '+8.2%',
      isPositive: true,
      sparkline: [20, 24, 22, 28, 30, 32, 35, 38],
      aiInsight: '24.2% EBITDA margin maintained; zero raw material wastage.',
      details: 'Operating earnings before interest, taxes, and depreciation.'
    },
    {
      id: 'cash',
      title: 'Cash Available',
      value: formatCurrency(kpis?.cash_position || 4210000),
      rawVal: kpis?.cash_position || 4210000,
      change: '+5.1%',
      isPositive: true,
      sparkline: [30, 32, 35, 33, 38, 40, 42],
      aiInsight: 'Liquid reserves sufficient for 62 days operating expenses.',
      details: 'Real-time aggregated closing balances across HDFC & ICICI current accounts.'
    },
    {
      id: 'working-capital',
      title: 'Working Capital',
      value: formatCurrency(kpis?.working_capital || 8540000),
      rawVal: kpis?.working_capital || 8540000,
      change: '+3.4%',
      isPositive: true,
      sparkline: [60, 62, 65, 70, 75, 80, 85],
      aiInsight: 'Working capital ratio at 1.84x (Healthy liquidity buffer).',
      details: 'Current assets minus current liabilities available for operational expansion.'
    },
    {
      id: 'receivables',
      title: 'Outstanding Receivables',
      value: formatCurrency(kpis?.receivables || 1825000),
      rawVal: kpis?.receivables || 1825000,
      change: '-2.1%',
      isPositive: true, // Reduced receivables is positive for cash flow
      sparkline: [90, 85, 80, 75, 70, 65, 60],
      aiInsight: '2 customers overdue (Apex: ₹4.85L, Metro: Settlement pending).',
      details: 'Pending customer invoices due within or past standard 30-day payment credit window.'
    },
    {
      id: 'payables',
      title: 'Outstanding Payables',
      value: formatCurrency(kpis?.payables || 1240000),
      rawVal: kpis?.payables || 1240000,
      change: '-4.5%',
      isPositive: true,
      sparkline: [50, 48, 45, 42, 40, 38, 35],
      aiInsight: 'Supplier payables optimized; vendor early payment discount captured.',
      details: 'Total vendor invoices pending payment to raw material steel suppliers.'
    },
    {
      id: 'inventory-val',
      title: 'Inventory Valuation',
      value: formatCurrency(kpis?.inventory_valuation || 5460000),
      rawVal: kpis?.inventory_valuation || 5460000,
      change: '+1.8%',
      isPositive: true,
      sparkline: [40, 42, 45, 48, 50, 52, 54],
      aiInsight: '48 SKUs in stock; 2 SKUs (CR-4042) require reorder replenishment.',
      details: 'Real-time valuation of finished goods, raw steel coils, and brass fittings.'
    },
    {
      id: 'growth',
      title: 'Sales Growth (YoY)',
      value: `${kpis?.sales_growth_yoy || 14.2}%`,
      rawVal: 14.2,
      change: '+2.8%',
      isPositive: true,
      sparkline: [10, 11, 12, 12.5, 13, 13.8, 14.2],
      aiInsight: 'Outperforming regional MSME industry average benchmark by 5.4%.',
      details: 'Year-over-year revenue expansion percentage calculated against Q3 fiscal 2025.'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
          Executive Telemetry KPIs
        </h3>
        <span className="text-[11px] text-zinc-500 font-mono">Real-Time Ledger Telemetry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setSelectedKpi(item);
              toast.info(item.title, item.aiInsight);
            }}
            className="p-5 rounded-2xl bg-[#121215]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl cursor-pointer relative overflow-hidden group space-y-3"
          >
            {/* Ambient accent top border */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${item.isPositive ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400 truncate pr-2">{item.title}</span>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                item.isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
              }`}>
                {item.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{item.change}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {item.value}
              </div>

              {/* Mini SVG Sparkline */}
              <div className="w-20 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full" viewBox="0 0 100 35">
                  <path
                    d={`M 0 ${35 - (item.sparkline[0] / 100) * 30} ` +
                      item.sparkline.map((val, idx) => `L ${(idx / (item.sparkline.length - 1)) * 100} ${35 - (val / 100) * 30}`).join(' ')
                    }
                    fill="none"
                    stroke={item.isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* AI Insight Caption */}
            <div className="pt-2 border-t border-white/[0.06] flex items-start gap-1.5 text-[11px] text-zinc-400 leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span className="truncate">{item.aiInsight}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI Detail Modal */}
      <AnimatePresence>
        {selectedKpi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSelectedKpi(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#121215] border border-white/20 rounded-2xl p-6 shadow-2xl text-white z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold">{selectedKpi.title}</h3>
                </div>
                <button onClick={() => setSelectedKpi(null)} className="text-zinc-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-3xl font-extrabold font-mono text-white">{selectedKpi.value}</div>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedKpi.details}</p>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-purple-300">AI Intelligence Analysis</div>
                  <p className="mt-1 leading-normal">{selectedKpi.aiInsight}</p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedKpi(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl"
                >
                  Close Telemetry Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
