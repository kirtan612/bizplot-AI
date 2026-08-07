import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Shield, Settings, Sliders, Command, 
  HelpCircle, LogOut, Check, ExternalLink, Sparkles, Key 
} from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function ProfileMenu() {
  const { 
    profileMenuOpen, 
    setProfileMenuOpen, 
    currentCompany, 
    currentWorkspace, 
    setActiveTab,
    setShortcutsModalOpen 
  } = useShell();

  const toast = useToast();
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen, setProfileMenuOpen]);

  if (!profileMenuOpen) return null;

  const handleLogout = () => {
    setProfileMenuOpen(false);
    toast.info('Session Ended', 'You have been safely signed out of BizPilot AI OS.');
  };

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-full mt-2 w-72 z-50">
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#121215]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden text-zinc-200"
        >
          {/* User & Company Header Card */}
          <div className="p-4 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  KR
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121215]" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">Kirtan R.</h4>
                <p className="text-[11px] text-zinc-400 truncate">Managing Director / CFO</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-semibold border border-blue-500/30 uppercase">
                    Enterprise Pro
                  </span>
                </div>
              </div>
            </div>

            {/* Active Workspace / Company Pill */}
            <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate text-zinc-300 font-medium">{currentCompany.name}</span>
              </div>
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2 space-y-0.5 border-b border-white/10 text-xs">
            <button
              onClick={() => {
                setProfileMenuOpen(false);
                setActiveTab('profile');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-zinc-400" />
              <span>User Profile & Account</span>
            </button>

            <button
              onClick={() => {
                setProfileMenuOpen(false);
                setActiveTab('settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-zinc-400" />
              <span>System Settings</span>
            </button>

            <button
              onClick={() => {
                setProfileMenuOpen(false);
                setActiveTab('settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-zinc-400" />
              <span>AI Preferences & Thresholds</span>
            </button>

            <button
              onClick={() => {
                setProfileMenuOpen(false);
                setShortcutsModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Command className="w-4 h-4 text-zinc-400" />
                <span>Keyboard Shortcuts</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-white/10 px-1.5 py-0.5 rounded">⌘ /</span>
            </button>
          </div>

          <div className="p-2 space-y-0.5 border-b border-white/10 text-xs">
            <button
              onClick={() => {
                setProfileMenuOpen(false);
                setActiveTab('help');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>Documentation & Support</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer font-medium text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of BizPilot</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
