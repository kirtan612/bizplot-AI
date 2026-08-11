import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  UsersRound,
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
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/auth';

interface NavMenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  permission: Permission;
}

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile }) => {
  const { hasPermission, role, organization, signOut } = useAuth();
  const location = useLocation();

  const aiMenuItems: NavMenuItem[] = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard, permission: 'dashboard.view' },
    { name: 'AI Executives', path: '/app/executives', icon: Brain, permission: 'ai.executive_center.view' },
    { name: 'Executive Room', path: '/app/executive-room', icon: UsersRound, permission: 'ai.executive_room.view' },
  ];

  const businessMenuItems: NavMenuItem[] = [
    { name: 'Sales Orders', path: '/app/sales', icon: TrendingUp, permission: 'sales.view' },
    { name: 'Customers', path: '/app/customers', icon: Users, permission: 'customers.view' },
    { name: 'Inventory & SKUs', path: '/app/inventory', icon: Box, permission: 'inventory.view' },
    { name: 'Purchases & Suppliers', path: '/app/purchases', icon: ShoppingBag, permission: 'purchases.view' },
    { name: 'Invoices & Billing', path: '/app/invoices', icon: FileText, permission: 'invoices.view' },
    { name: 'Expense Control', path: '/app/expenses', icon: CreditCard, permission: 'expenses.view' },
    { name: 'Finance Telemetry', path: '/app/finance', icon: DollarSign, permission: 'finance.view' },
    { name: 'Cash Flow', path: '/app/cashflow', icon: Wallet, permission: 'cashflow.view' },
    { name: 'Reports', path: '/app/reports', icon: PieChart, permission: 'reports.view' },
  ];

  const adminMenuItems: NavMenuItem[] = [
    { name: 'Team', path: '/team', icon: UserCheck, permission: 'users.view' },
    { name: 'Roles & Permissions', path: '/settings/roles', icon: Shield, permission: 'roles.view' },
  ];

  const visibleAIMenu = aiMenuItems.filter((item) => hasPermission(item.permission));
  const visibleBusinessMenu = businessMenuItems.filter((item) => hasPermission(item.permission));
  const visibleAdminMenu = adminMenuItems.filter((item) => hasPermission(item.permission));

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const linkClasses = (path: string) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${isActive(path)
      ? 'bg-blue-600 text-white'
      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
    }`;

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-60 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col justify-between h-screen select-none transition-colors duration-200">
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                B
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">BizPilot AI</span>
            </div>
            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{organization?.name || 'Organization'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* AI Command Center */}
          {visibleAIMenu.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-zinc-600 px-3 mb-1.5 block tracking-wider">
                Command Center
              </span>
              {visibleAIMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} end={item.path === '/app'} className={linkClasses(item.path)} onClick={handleNavClick}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Business Modules */}
          {visibleBusinessMenu.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-zinc-600 px-3 mb-1.5 block tracking-wider">
                Business ({visibleBusinessMenu.length})
              </span>
              {visibleBusinessMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={linkClasses(item.path)} onClick={handleNavClick}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Administration */}
          {visibleAdminMenu.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-zinc-600 px-3 mb-1.5 block tracking-wider">
                Settings
              </span>
              {visibleAdminMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path} className={linkClasses(item.path)} onClick={handleNavClick}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 dark:text-zinc-500">Active role</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{role?.name || 'EMPLOYEE'}</span>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
