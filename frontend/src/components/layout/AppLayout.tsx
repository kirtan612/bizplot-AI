import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, UserCheck, Search, Bell } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, organization, role, switchDemoRole } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex selection:bg-white selection:text-black">
      {/* Dynamic Sidebar */}
      <AppSidebar />

      {/* Main Canvas Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#080808] border-b border-[#1C1C1C] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-neutral-400">
              TENANT: <span className="text-white font-bold">{organization?.name}</span> ({organization?.inviteCode})
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Interactive Persona / Role Switcher for Testing */}
            <div className="flex items-center space-x-2 bg-[#121212] px-3 py-1.5 rounded-xl border border-[#262626] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-neutral-400 font-semibold text-[10px] uppercase">TEST PERSONA:</span>
              <select
                value={role?.name || 'OWNER'}
                onChange={(e) => switchDemoRole(e.target.value as any)}
                className="bg-transparent text-cyan-400 font-bold border-none focus:ring-0 cursor-pointer text-xs"
              >
                <option value="OWNER">👑 OWNER (Full Org Access)</option>
                <option value="MANAGER">🏢 MANAGER (Ops & Sales)</option>
                <option value="ACCOUNTANT">📊 ACCOUNTANT (Finance & Tax)</option>
                <option value="EMPLOYEE">👤 EMPLOYEE (Tasks & Orders)</option>
              </select>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2.5 bg-[#121212] px-3 py-1.5 rounded-xl border border-[#262626]">
              <div className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[10px] font-bold font-mono flex items-center justify-center">
                {user?.name.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-none">{user?.name}</span>
                <span className="text-[9px] font-mono text-neutral-400 leading-none mt-0.5">{role?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 sm:p-8 bg-[#050505] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
