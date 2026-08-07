import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Search, Bell, Calendar, ShieldCheck, Building2 } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';

export default function ExecutiveHeader({ lastSyncTime, onRefresh, healthScore = 91 }) {
  const { currentCompany, currentWorkspace, setCommandPaletteOpen, setNotificationDrawerOpen, unreadCount } = useShell();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-[#121215]/90 border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-xl">
      {/* Radial ambient background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Greeting & Context */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[11px] font-semibold border border-blue-500/30 uppercase tracking-wider font-mono">
              Autonomous Command Center
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good Evening, <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Kirtan</span>
          </h1>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 font-medium text-zinc-300">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>{currentCompany.name}</span>
            </div>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">{currentWorkspace.name}</span>
          </div>
        </div>

        {/* Right Section: Health Score Pill & Actions */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Health Score Pill */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="transparent" />
                <circle
                  cx="20" cy="20" r="16"
                  stroke="#10b981" strokeWidth="3" fill="transparent"
                  strokeDasharray="100" strokeDashoffset={100 - healthScore}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-emerald-400">{healthScore}</span>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Business Health</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EXCELLENT ({healthScore}/100)</span>
              </div>
            </div>
          </div>

          {/* Sync status & manual refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer group"
              title="Refresh Business Telemetry"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              Synced {lastSyncTime || '1 min ago'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
