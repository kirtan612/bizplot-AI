import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Wallet,
  Truck,
  Bot,
  Shield,
  FileText,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { MetricGroup } from '../../components/MetricGroup';
import { BusinessChart } from '../../components/BusinessChart';
import { fadeInUp } from '../../lib/animations';

export const ProductShowcase: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isLight = theme === 'light';

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Customers', icon: Users },
    { name: 'Profit', icon: DollarSign },
    { name: 'Cashflow', icon: Wallet },
    { name: 'Suppliers', icon: Truck },
    { name: 'AI Analyst', icon: Bot },
    { name: 'AI Executives', icon: Shield },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <section id="product-showcase" className="py-24 bg-[#080808] border-t border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            FULL PLATFORM DEMO
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            PRODUCTION-GRADE PLATFORM.
            <br />
            <span className="text-gradient">DESIGNED FOR ENTERPRISE SCALE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Experience the complete BizPilot operating environment. Click through the workspace tabs and test the section-specific Light / Dark theme toggle below.
          </p>
        </motion.div>

        {/* Software Window Interface with Light/Dark Theme Support */}
        <div
          className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
            isLight
              ? 'bg-slate-50 border-slate-300 shadow-[0_30px_90px_rgba(0,0,0,0.15)] text-slate-900'
              : 'bg-[#080808] border-[#262626] shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-white'
          }`}
        >
          {/* Top Window Bar */}
          <div
            className={`px-6 py-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0E0E0E] border-[#1E1E1E]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className={`text-xs font-mono font-bold ml-2 flex items-center space-x-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>BizPilot AI OS — Enterprise Workspace</span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                  isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40'
                }`}>
                  DEMO DATA
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={() => setTheme(isLight ? 'dark' : 'light')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 shadow-sm'
                    : 'bg-[#141414] border-[#2A2A2A] text-neutral-300 hover:text-white'
                }`}
              >
                {isLight ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>

              <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#141414] border-[#262626] text-neutral-400'
              }`}>
                <Search className="w-3.5 h-3.5 text-cyan-500" />
                <span>Search telemetry, SKUs, invoices...</span>
              </div>
              <Bell className={`w-4 h-4 cursor-pointer ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'}`} />
            </div>
          </div>

          {/* Main App Layout: Sidebar + Canvas */}
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div
              className={`w-full lg:w-64 border-r p-4 space-y-1 shrink-0 transition-colors duration-300 ${
                isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#0A0A0A] border-[#1C1C1C]'
              }`}
            >
              <span className={`text-[10px] font-mono uppercase font-semibold px-3 mb-2 block ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                MAIN MENU
              </span>
              {navItems.map((item) => {
                const isSelected = activeNav === item.name;
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-slate-900 text-white font-bold shadow-md'
                          : 'bg-white text-black font-bold shadow-md'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Canvas Container */}
            <div className={`flex-1 p-6 sm:p-8 space-y-6 transition-colors duration-300 ${isLight ? 'bg-slate-50' : 'bg-[#060606]'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeNav}-${theme}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#1A1A1A]'}`}>
                    <div>
                      <h3 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeNav} Workspace</h3>
                      <p className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Realtime financial telemetry for GI/MS Steel Pipe Distribution
                      </p>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                      isLight ? 'text-cyan-700 bg-cyan-50 border-cyan-200 font-semibold' : 'text-cyan-400 bg-[#121212] border-[#242424]'
                    }`}>
                      FY 2025-26 Active Cycle
                    </span>
                  </div>

                  {/* Active Nav Tab Contents */}
                  {activeNav === 'Overview' && (
                    <div className="space-y-6">
                      <MetricGroup
                        columns={4}
                        metrics={[
                          { label: 'Revenue', value: 24.8, suffix: ' Cr', change: 8.4, status: 'healthy', statusText: 'RECORD' },
                          { label: 'Gross Profit', value: 3.42, suffix: ' Cr', change: 5.8, status: 'healthy', statusText: 'STABLE' },
                          { label: 'Cashflow', value: 1.86, suffix: ' Cr', change: -2.1, status: 'warning', statusText: 'BUFFER NEEDED' },
                          { label: 'Retention', value: 87.4, prefix: '', suffix: '%', change: 1.2, status: 'healthy', statusText: 'EXCELLENT' },
                        ]}
                      />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BusinessChart
                          title="Revenue Acceleration Trajectory"
                          subtitle="Cyan Hydro Flow"
                          data={[
                            { label: 'Jan', value: 18.2 },
                            { label: 'Feb', value: 19.8 },
                            { label: 'Mar', value: 21.4 },
                            { label: 'Apr', value: 22.1 },
                            { label: 'May', value: 23.5 },
                            { label: 'Jun', value: 24.8 },
                          ]}
                          type="area"
                          colorTheme="cyan"
                          className={isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#0D0D0D] border-[#202020]'}
                        />
                        <BusinessChart
                          title="Gross Margin Distribution"
                          subtitle="Purple Prism SKU Breakdown"
                          data={[
                            { label: 'GI Pipes', value: 14.2 },
                            { label: 'MS Tubes', value: 6.8 },
                            { label: 'GP Sections', value: 3.8 },
                          ]}
                          type="bar"
                          colorTheme="purple"
                          className={isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#0D0D0D] border-[#202020]'}
                        />
                      </div>
                    </div>
                  )}

                  {activeNav === 'Customers' && (
                    <div className={`p-6 rounded-xl border space-y-4 font-mono text-xs ${
                      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#0D0D0D] border-[#202020] text-white'
                    }`}>
                      <div className={`flex justify-between font-bold border-b pb-2 ${isLight ? 'border-slate-200 text-slate-900' : 'border-[#1C1C1C] text-white'}`}>
                        <span>CUSTOMER ACCOUNT</span>
                        <span>STATUS</span>
                        <span>CLV</span>
                        <span>ACTION</span>
                      </div>
                      <div className={`flex justify-between py-2 border-b ${isLight ? 'border-slate-100 text-slate-700' : 'border-[#141414] text-neutral-300'}`}>
                        <span>ABC Industries Ltd.</span>
                        <span className="text-rose-500 font-bold">At Risk (42 days)</span>
                        <span>₹1.84 Cr</span>
                        <span className="text-cyan-600 font-bold underline cursor-pointer">Review Pricing</span>
                      </div>
                      <div className={`flex justify-between py-2 border-b ${isLight ? 'border-slate-100 text-slate-700' : 'border-[#141414] text-neutral-300'}`}>
                        <span>Shree Engineering</span>
                        <span className="text-emerald-500 font-bold">Healthy</span>
                        <span>₹94.2 L</span>
                        <span className="text-cyan-600 font-bold underline cursor-pointer">Annual Contract</span>
                      </div>
                    </div>
                  )}

                  {activeNav === 'Profit' && (
                    <div className="space-y-6">
                      <BusinessChart
                        title="Quarterly Profit Contribution Breakdown"
                        data={[
                          { label: 'Raw Material', value: 18.4 },
                          { label: 'Discounts', value: 7.2 },
                          { label: 'Logistics', value: 4.8 },
                          { label: 'Low Margin', value: 3.1 },
                        ]}
                        type="bar"
                        colorTheme="rose"
                        height={200}
                        prefix="₹"
                        suffix=" L"
                        className={isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#0D0D0D] border-[#202020]'}
                      />
                    </div>
                  )}

                  {activeNav === 'Cashflow' && (
                    <div className="space-y-6">
                      <BusinessChart
                        title="Treasury Liquidity & Buffer Projection"
                        data={[
                          { label: 'Week 1', value: 1.86 },
                          { label: 'Week 2', value: 1.72 },
                          { label: 'Week 3', value: 1.67 },
                          { label: 'Week 4', value: 1.62 },
                        ]}
                        type="line"
                        colorTheme="emerald"
                        height={200}
                        className={isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#0D0D0D] border-[#202020]'}
                      />
                    </div>
                  )}

                  {activeNav === 'Suppliers' && (
                    <div className={`p-6 rounded-xl border space-y-4 font-mono text-xs ${
                      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#0D0D0D] border-[#202020] text-white'
                    }`}>
                      <div className={`flex justify-between font-bold border-b pb-2 ${isLight ? 'border-slate-200 text-slate-900' : 'border-[#1C1C1C] text-white'}`}>
                        <span>SUPPLIER MILL</span>
                        <span>PRICE SURGE</span>
                        <span>BASE RATE</span>
                        <span>STATUS</span>
                      </div>
                      <div className={`flex justify-between py-2 border-b ${isLight ? 'border-slate-100 text-slate-700' : 'border-[#141414] text-neutral-300'}`}>
                        <span>APL Apollo Mills</span>
                        <span className="text-rose-500 font-bold">+9.2%</span>
                        <span>₹64,200 / MT</span>
                        <span className="text-amber-500 font-bold">Review Terms</span>
                      </div>
                      <div className={`flex justify-between py-2 border-b ${isLight ? 'border-slate-100 text-slate-700' : 'border-[#141414] text-neutral-300'}`}>
                        <span>Hi-Tech Steel Tubes</span>
                        <span className="text-emerald-500 font-bold">-4.1%</span>
                        <span>₹61,500 / MT</span>
                        <span className="text-emerald-500 font-bold">Preferred</span>
                      </div>
                    </div>
                  )}

                  {activeNav !== 'Overview' && activeNav !== 'Customers' && activeNav !== 'Profit' && activeNav !== 'Cashflow' && activeNav !== 'Suppliers' && (
                    <div className={`p-12 rounded-xl border text-center space-y-3 ${
                      isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'bg-[#0A0A0A] border-[#202020] text-white'
                    }`}>
                      <Sparkles className="w-8 h-8 text-cyan-500 mx-auto" />
                      <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeNav} Deep Telemetry Active</h4>
                      <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        BizPilot is continuously evaluating {activeNav.toLowerCase()} data models against your live Tally and GST ledgers.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
