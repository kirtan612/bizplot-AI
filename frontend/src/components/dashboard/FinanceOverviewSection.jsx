import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

export default function FinanceOverviewSection() {
  const [activeTab, setActiveTab] = useState('revenue-profit');

  // Chart 1: Revenue vs Profit Data
  const revProfitData = [
    { month: 'Apr', revenue: 98, profit: 21 },
    { month: 'May', revenue: 112, profit: 24 },
    { month: 'Jun', revenue: 105, profit: 22 },
    { month: 'Jul', revenue: 128, profit: 26 },
    { month: 'Aug', revenue: 135, profit: 27 },
    { month: 'Sep', revenue: 142.8, profit: 28.5 }
  ];

  // Chart 2: Cash Flow (Inflow vs Outflow)
  const cashFlowData = [
    { month: 'Apr', inflow: 95, outflow: 78, net: 17 },
    { month: 'May', inflow: 110, outflow: 88, net: 22 },
    { month: 'Jun', inflow: 102, outflow: 85, net: 17 },
    { month: 'Jul', inflow: 125, outflow: 96, net: 29 },
    { month: 'Aug', inflow: 132, outflow: 99, net: 33 },
    { month: 'Sep', inflow: 140, outflow: 98, net: 42 }
  ];

  // Chart 3: Receivables vs Payables
  const recPayData = [
    { category: '0-30 Days', receivables: 12.4, payables: 8.2 },
    { category: '31-60 Days', receivables: 4.2, payables: 3.1 },
    { category: '61-90 Days', receivables: 1.2, payables: 1.1 },
    { category: '90+ Days', receivables: 0.45, payables: 0.0 }
  ];

  // Chart 4: Expense Breakdown
  const expenseData = [
    { name: 'Raw Material Steel', value: 58, color: '#3b82f6' },
    { name: 'Logistics & Freight', value: 16, color: '#8b5cf6' },
    { name: 'Plant Payroll', value: 14, color: '#10b981' },
    { name: 'Power & Utilities', value: 7, color: '#f59e0b' },
    { name: 'GST & Compliance', value: 5, color: '#0ea5e9' }
  ];

  // Chart 5: Working Capital Trend
  const wcTrendData = [
    { month: 'Apr', wc: 68 },
    { month: 'May', wc: 72 },
    { month: 'Jun', wc: 75 },
    { month: 'Jul', wc: 79 },
    { month: 'Aug', wc: 82 },
    { month: 'Sep', wc: 85.4 }
  ];

  const formatTooltip = (val) => [`₹${val} Lakhs`, 'Amount'];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#121215]/90 border border-white/[0.08] shadow-xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Financial Overview Engine</h3>
            <p className="text-xs text-zinc-400">Cash Flow, Revenue vs Profit, Working Capital & Payables</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'revenue-profit', label: 'Revenue vs Profit' },
            { id: 'cash-flow', label: 'Cash Flow Inflow' },
            { id: 'rec-pay', label: 'Receivables vs Payables' },
            { id: 'expenses', label: 'Expense Mix' },
            { id: 'working-capital', label: 'Working Capital' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'revenue-profit' ? (
            <AreaChart data={revProfitData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} unit="L" />
              <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: '#1a1a20', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="revenue" name="Revenue (₹ Lakhs)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="profit" name="Gross Profit (₹ Lakhs)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          ) : activeTab === 'cash-flow' ? (
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} unit="L" />
              <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: '#1a1a20', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="inflow" name="Cash Inflow (₹ Lakhs)" stroke="#10b981" strokeWidth={2.5} fill="url(#colorInflow)" />
              <Area type="monotone" dataKey="outflow" name="Cash Outflow (₹ Lakhs)" stroke="#ef4444" strokeWidth={2.5} fill="url(#colorOutflow)" />
            </AreaChart>
          ) : activeTab === 'rec-pay' ? (
            <BarChart data={recPayData}>
              <XAxis dataKey="category" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} unit="L" />
              <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: '#1a1a20', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="receivables" name="Receivables (₹ Lakhs)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="payables" name="Payables (₹ Lakhs)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : activeTab === 'expenses' ? (
            <PieChart>
              <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, 'Expense Share']} contentStyle={{ backgroundColor: '#1a1a20', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          ) : (
            <LineChart data={wcTrendData}>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} unit="L" />
              <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: '#1a1a20', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="wc" name="Working Capital (₹ Lakhs)" stroke="#8b5cf6" strokeWidth={3.5} dot={{ r: 5, fill: '#8b5cf6' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
