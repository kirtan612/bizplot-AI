import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X, Keyboard } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';

export default function KeyboardShortcutsModal() {
  const { shortcutsModalOpen, setShortcutsModalOpen } = useShell();

  if (!shortcutsModalOpen) return null;

  const shortcutsList = [
    { key: 'Ctrl + K', description: 'Open Global Search / Command Palette' },
    { key: 'Ctrl + B', description: 'Toggle Sidebar Expand / Collapse' },
    { key: 'Ctrl + /', description: 'Open Keyboard Shortcuts Guide' },
    { key: 'Esc', description: 'Close Active Overlays & Modals' },
    { key: 'Alt + N', description: 'Quick Action: Create New Invoice' },
    { key: 'Alt + P', description: 'Quick Action: Create Purchase Order' },
    { key: 'Alt + A', description: 'Quick Action: Run AI Audit' },
    { key: '↑ / ↓', description: 'Navigate Command Palette Items' },
    { key: 'Enter', description: 'Execute Selected Command' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <div className="absolute inset-0" onClick={() => setShortcutsModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-lg bg-[#0f0f13] border border-white/15 rounded-2xl shadow-2xl p-6 text-white z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Keyboard Shortcuts</h3>
                <p className="text-xs text-zinc-400">Power user shortcuts for rapid navigation</p>
              </div>
            </div>
            <button
              onClick={() => setShortcutsModalOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {shortcutsList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-xs text-zinc-300 font-medium">{item.description}</span>
                <kbd className="px-2.5 py-1 bg-white/10 rounded-md font-mono text-[11px] text-blue-300 border border-white/10 shrink-0">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={() => setShortcutsModalOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Got it, Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
