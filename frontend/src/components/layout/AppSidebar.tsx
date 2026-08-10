import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Users,
  Box,
  ShoppingBag,
  FileText,
  CreditCard,
  DollarSign,
  Wallet,
  PieChart,
  UserCheck,
  Shield,
  LogOut,
  Building2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/auth';

interface NavMenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  permission: Permission;
}

export const AppSidebar: React.FC = () => {
  const { hasPermission, role, organization, signOut } = useAuth();
  const location = useLocation();

  const navMenuItems: NavMenuItem[] = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard, permission: 'dashboard.view' },
    { name: 'AI Insights', path: '/app/ai-insights', icon: Sparkles, permission: 'ai.insights.view' },
    { name: 'Sales Orders', path: '/app/sales', icon: TrendingUp, permission: 'sales.view' },
    { name: 'Customers', path: '/app/customers', icon: Users, permission: 'customers.view' },
    { name: 'Inventory & SKUs', path: '/app/inventory', icon: Box, permission: 'inventory.view' },
    { name: 'Purchases & Suppliers', path: '/app/purchases', icon: ShoppingBag, permission: 'purchases.view' },
    { name: 'Invoices & Billing', path: '/app/invoices', icon: FileText, permission: 'invoices.view' },
    { name: 'Expense Control', path: '/app/expenses', icon: CreditCard, permission: 'expenses.view' },
    { name: 'Finance Telemetry', path: '/app/finance', icon: DollarSign, permission: 'finance.view' },
    { name: 'Cash Flow Projection', path: '/app/cashflow', icon: Wallet, permission: 'cashflow.view' },
    { name: 'Reports Hub', path: '/app/reports', icon: PieChart, permission: 'reports.view' },
  ];

  const adminMenuItems: NavMenuItem[] = [
    { name: 'Team Members', path: '/team', icon: UserCheck, permission: 'users.view' },
    { name: 'Roles & Security', path: '/settings/roles', icon: Shield, permission: 'roles.view' },
  ];

  // Filter items dynamically based on permission evaluation
  const visibleNavItems = navMenuItems.filter((item) => hasPermission(item.permission));
  const visibleAdminItems = adminMenuItems.filter((item) => hasPermission(item.permission));

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#1C1C1C] flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div className="p-4 space-y-6">
        {/* Brand & Organization Header */}
        <div className="px-3 py-2 rounded-xl bg-[#121212] border border-[#222222] space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 fill-black" />
            </div>
            <span className="font-extrabold text-sm tracking-wider text-white">BIZPILOT AI</span>
          </div>

          <div className="pt-2 border-t border-[#1C1C1C] flex items-center space-x-2 text-[11px] font-mono text-neutral-400">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate text-white font-semibold">{organization?.name || 'Organization'}</span>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {/* Main Operational Modules */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold px-3 mb-2 block">
              OPERATIONAL MODULES ({visibleNavItems.length})
            </span>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Administration & Governance Section */}
          {visibleAdminItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#181818]">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold px-3 mb-2 block">
                ADMINISTRATION & RBAC
              </span>

              {visibleAdminItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-400 text-black font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Role & Sign Out Footer */}
      <div className="p-4 border-t border-[#1C1C1C] bg-[#080808] space-y-3">
        <div className="px-3 py-2 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400 text-[10px]">ACTIVE ROLE:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/40 text-[10px]">
            {role?.name || 'EMPLOYEE'}
          </span>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-[#121212] hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 border border-[#222222] hover:border-rose-800/50 text-xs font-mono transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
