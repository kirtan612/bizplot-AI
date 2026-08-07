import React from 'react';
import { useShell } from '../../contexts/ShellContext';
import PageContainer from '../PageContainer/PageContainer';
import { PageSkeleton } from '../GlobalLoader/GlobalLoader';
import ExecutiveDashboard from '../../components/dashboard/ExecutiveDashboard';
import { Plus, Download, Filter, RefreshCw, Sparkles, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const MODULE_META = {
  'command-center': {
    title: 'Business Command Center',
    badge: 'LIVE TELEMETRY',
    description: 'Executive overview of multi-branch revenue streams, working capital, and autonomous AI recommendations.'
  },
  'finance': {
    title: 'Finance Intelligence',
    badge: 'GST AUTOMATED',
    description: 'Real-time GST filing, cash flow forecasts, accounts receivable, and autonomous invoice reconciliation.'
  },
  'profit': {
    title: 'Profit Intelligence',
    badge: 'EBITDA OPTIMIZER',
    description: 'AI-driven margin leakage detection, cost variance analysis, and customer profitability scoring.'
  },
  'sales': {
    title: 'Sales Intelligence',
    badge: 'PIPELINE AI',
    description: 'Sales pipeline forecasting, regional quote conversion metrics, and distributor credit limits.'
  },
  'inventory': {
    title: 'Inventory Intelligence',
    badge: 'SAFETY BUFFER',
    description: 'ABC inventory classification, stock turnover velocity, and predictive low-stock reorder triggers.'
  },
  'customer': {
    title: 'Customer Intelligence',
    badge: 'CREDIT SCORE',
    description: 'Customer credit behavior, payment history index, and automated collection workflows.'
  },
  'supplier': {
    title: 'Supplier Intelligence',
    badge: 'SCORECARD',
    description: 'Vendor delivery reliability metrics, price volatility alerts, and purchase order tracking.'
  },
  'analytics': {
    title: 'Operational Analytics',
    badge: 'CROSS-FUNCTIONAL',
    description: 'Multi-variable operational performance indicators and custom executive widget builders.'
  },
  'reports': {
    title: 'Compliance & Reports',
    badge: 'AUDIT READY',
    description: 'Exportable Profit & Loss statements, Balance Sheets, GSTR-1/3B drafts, and audit trails.'
  },
  'ai-advisor': {
    title: 'AI Business Advisor',
    badge: 'AUTONOMOUS',
    description: 'Direct conversational interface to your MSME virtual strategist and scenario simulator.'
  },
  'ai-board': {
    title: 'AI Board Meeting',
    badge: 'C-SUITE SIMULATOR',
    description: 'Simulated C-suite strategy session with CFO, COO, and CMO AI personas analyzing your business.'
  },
  'action-center': {
    title: 'Action Center',
    badge: '3 PENDING',
    description: 'Consolidated approval queue, high-priority risk alerts, and pending document sign-offs.'
  },
  'settings': {
    title: 'System Settings',
    badge: 'WORKSPACE CONFIG',
    description: 'Manage company profiles, user access roles, API integrations, and tax configuration.'
  },
  'profile': {
    title: 'User Profile & Preferences',
    badge: 'ENTERPRISE PRO',
    description: 'Personal profile details, active workspace credentials, and theme customization.'
  },
  'help': {
    title: 'Help & Knowledge Base',
    badge: 'SUPPORT 24/7',
    description: 'Documentation, system architecture guides, keyboard shortcuts cheatsheet, and support tickets.'
  }
};

export default function ShellContent({ onExitToLanding }) {
  const { activeTab, isGlobalLoading } = useShell();
  const toast = useToast();

  const meta = MODULE_META[activeTab] || {
    title: activeTab.toUpperCase(),
    badge: 'MODULE',
    description: 'BizPilot AI Operating System Module Shell Container'
  };

  if (isGlobalLoading) {
    return <PageSkeleton />;
  }

  // Render the full Business Command Center Dashboard when activeTab is command-center
  if (activeTab === 'command-center') {
    return (
      <div className="py-4 px-2 sm:px-4">
        <ExecutiveDashboard />
      </div>
    );
  }

  const defaultActions = (
    <>
      <button
        onClick={() => toast.info('Export Initiated', 'Exporting module data to XLSX...')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export</span>
      </button>

      <button
        onClick={() => toast.info('Filters Applied', 'Showing active fiscal period data.')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Filter</span>
      </button>

      {onExitToLanding && (
        <button
          onClick={onExitToLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors cursor-pointer ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>
      )}
    </>
  );

  return (
    <PageContainer
      title={meta.title}
      badge={meta.badge}
      description={meta.description}
      actions={defaultActions}
    >
      <div className="w-full rounded-2xl bg-[#121215]/90 border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400">
              SHELL CONTAINER READY // MODULE ID: <span className="text-blue-400 font-semibold">{activeTab}</span>
            </span>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            BizPilot OS Kernel v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-white/20 transition-colors">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Module Status</div>
            <div className="text-2xl font-bold text-white font-mono">Active & Synced</div>
            <p className="text-xs text-zinc-400">Connected to primary PostgreSQL database engine.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-white/20 transition-colors">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">AI Intelligence Stream</div>
            <div className="text-2xl font-bold text-white font-mono">99.4% Accuracy</div>
            <p className="text-xs text-zinc-400">Autonomous recommendation engine listening.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 hover:border-white/20 transition-colors">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Security & Audit</div>
            <div className="text-2xl font-bold text-white font-mono">Encrypted</div>
            <p className="text-xs text-zinc-400">Role-based access control (RBAC) enforced.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
