import React, { useState } from 'react';
import { 
  Search, Bell, Menu, Plus, Command, Sparkles, Building2, 
  ChevronDown, Sun, Moon, Check, FilePlus, ShoppingBag, Zap, Laptop 
} from 'lucide-react';
import { useShell, WORKSPACES, COMPANIES } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import ProfileMenu from '../ProfileMenu/ProfileMenu';

export default function TopNavigation() {
  const { 
    setMobileDrawerOpen, 
    setCommandPaletteOpen, 
    setNotificationDrawerOpen, 
    unreadCount,
    currentCompany,
    setCurrentCompany,
    currentWorkspace,
    setCurrentWorkspace,
    profileMenuOpen,
    setProfileMenuOpen,
    setActiveTab
  } = useShell();

  const toast = useToast();
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [companySelectOpen, setCompanySelectOpen] = useState(false);

  return (
    <header className="h-20 px-4 sm:px-6 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
      {/* Left Section: Mobile Menu Toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors md:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumb />
      </div>

      {/* Center Section: Global Search Trigger Input (Ctrl + K) */}
      <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-6">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-400 text-xs transition-all duration-200 cursor-pointer shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            <span>Search anything... (Invoices, Customers, AI Insights)</span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 border border-white/10">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Section: Actions, Notifications, Company Switcher, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
          title="Search (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickActionOpen(!quickActionOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Action</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#16161c] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 text-xs text-zinc-200">
              <div className="px-2.5 py-1 text-[10px] text-zinc-500 font-semibold uppercase">Quick Create</div>
              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  setActiveTab('finance');
                  toast.action('Create Invoice', 'Invoice generator standard form ready.', 'Go to Finance', () => setActiveTab('finance'));
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FilePlus className="w-4 h-4 text-blue-400" />
                <span>Create New Invoice</span>
              </button>

              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  setActiveTab('supplier');
                  toast.success('Purchase Order', 'Supplier purchase order wizard opened.');
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Create Purchase Order</span>
              </button>

              <button
                onClick={() => {
                  setQuickActionOpen(false);
                  setActiveTab('profit');
                  toast.action('AI Audit Triggered', 'Autonomous EBITDA audit complete.', 'View Report', () => setActiveTab('profit'));
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Run AI Financial Audit</span>
              </button>
            </div>
          )}
        </div>

        {/* Company Switcher Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCompanySelectOpen(!companySelectOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[130px] truncate font-medium">{currentCompany.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {companySelectOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#16161c] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 text-xs">
              <div className="px-2.5 py-1 text-[10px] text-zinc-500 font-semibold uppercase">Select Registered Entity</div>
              {COMPANIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentCompany(c);
                    setCompanySelectOpen(false);
                    toast.info('Company Selected', `Switched active company to ${c.name}`);
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors ${
                    currentCompany.id === c.id ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate text-xs">{c.name}</div>
                    <div className="text-[10px] text-zinc-500">{c.gstin}</div>
                  </div>
                  {currentCompany.id === c.id && <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell Button */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer"
          title="Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-[#09090b] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Autonomous Engine Active Beacon */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>AI ACTIVE</span>
        </div>

        {/* User Profile Avatar (Triggers ProfileMenu) */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer"
          >
            KR
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
