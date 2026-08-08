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
} from 'lucide-react';
import { MetricGroup } from '../../components/MetricGroup';
import { BusinessChart } from '../../components/BusinessChart';
import { fadeInUp } from '../../lib/animations';

export const ProductShowcase: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Overview');

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
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
            FULL PLATFORM DEMO
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            PRODUCTION-GRADE PLATFORM.
            <br />
            <span className="text-gradient">DESIGNED FOR ENTERPRISE SCALE.</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Click through the full BizPilot operating environment below. Experience the complete software architecture built for Indian business leadership.
          </p>
        </motion.div>

        {/* Massive Full Software Window Interface */}
        <div className="rounded-2xl bg-[#080808] border border-[#262626] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
          {/* Top Window Bar */}
          <div className="px-6 py-4 bg-[#0E0E0E] border-b border-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
              <div className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
              <div className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
              <span className="text-xs font-mono font-bold text-white ml-2 flex items-center space-x-2">
                <span>BizPilot AI OS — Enterprise Workspace</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px]">
                  LIVE DEMO DATA
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-[#141414] px-3 py-1.5 rounded-lg border border-[#262626] text-xs font-mono text-neutral-400">
                <Search className="w-3.5 h-3.5" />
                <span>Search telemetry, SKUs, invoices...</span>
              </div>
              <Bell className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Main App Layout: Sidebar + Canvas */}
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-[#0A0A0A] border-r border-[#1C1C1C] p-4 space-y-1 shrink-0">
              <span className="text-[10px] font-mono uppercase text-neutral-500 font-semibold px-3 mb-2 block">
                MAIN MENU
              </span>
              {navItems.map((item) => {
                const isSelected = activeNav === item.name;
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveNav(item.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black font-bold shadow-md'
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
            <div className="flex-1 p-6 sm:p-8 bg-[#060606] space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNav}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{activeNav} Workspace</h3>
                      <p className="text-xs text-neutral-500 font-mono">
                        Realtime financial telemetry for GI/MS Steel Pipe Distribution
                      </p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400 bg-[#121212] px-3 py-1.5 rounded-lg border border-[#242424]">
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
                          data={[
                            { label: 'Jan', value: 18.2 },
                            { label: 'Feb', value: 19.8 },
                            { label: 'Mar', value: 21.4 },
                            { label: 'Apr', value: 22.1 },
                            { label: 'May', value: 23.5 },
                            { label: 'Jun', value: 24.8 },
                          ]}
                          type="area"
                        />
                        <BusinessChart
                          title="Gross Margin Distribution"
                          data={[
                            { label: 'GI Pipes', value: 14.2 },
                            { label: 'MS Tubes', value: 6.8 },
                            { label: 'GP Sections', value: 3.8 },
                          ]}
                          type="bar"
                        />
                      </div>
                    </div>
                  )}

                  {activeNav === 'Customers' && (
                    <div className="p-6 rounded-xl bg-[#0D0D0D] border border-[#202020] space-y-4 font-mono text-xs">
                      <div className="flex justify-between font-bold text-white border-b border-[#1C1C1C] pb-2">
                        <span>CUSTOMER ACCOUNT</span>
                        <span>STATUS</span>
                        <span>CLV</span>
                        <span>ACTION</span>
                      </div>
                      <div className="flex justify-between text-neutral-300 py-2 border-b border-[#141414]">
                        <span>ABC Industries Ltd.</span>
                        <span className="text-rose-400">At Risk (42 days)</span>
                        <span>₹1.84 Cr</span>
                        <span className="text-white underline cursor-pointer">Review Pricing</span>
                      </div>
                      <div className="flex justify-between text-neutral-300 py-2 border-b border-[#141414]">
                        <span>Shree Engineering</span>
                        <span className="text-emerald-400">Healthy</span>
                        <span>₹94.2 L</span>
                        <span className="text-white underline cursor-pointer">Annual Contract</span>
                      </div>
                    </div>
                  )}

                  {activeNav !== 'Overview' && activeNav !== 'Customers' && (
                    <div className="p-12 rounded-xl bg-[#0A0A0A] border border-[#202020] text-center space-y-3">
                      <Sparkles className="w-8 h-8 text-white mx-auto" />
                      <h4 className="text-base font-bold text-white">{activeNav} Deep Telemetry Active</h4>
                      <p className="text-xs text-neutral-400 max-w-md mx-auto">
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
