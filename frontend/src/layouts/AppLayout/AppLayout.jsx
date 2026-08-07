import React from 'react';
import { ShellProvider, useShell } from '../../contexts/ShellContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import Sidebar from '../Sidebar/Sidebar';
import TopNavigation from '../TopNavigation/TopNavigation';
import CommandPalette from '../CommandPalette/CommandPalette';
import NotificationCenter from '../NotificationCenter/NotificationCenter';
import FloatingAIButton from '../FloatingAI/FloatingAIButton';
import KeyboardShortcutsModal from '../ProfileMenu/KeyboardShortcutsModal';
import { TopProgressBar } from '../GlobalLoader/GlobalLoader';

function AppLayoutInner({ children }) {
  // Activate global keyboard listeners (Ctrl+K, Ctrl+B, Ctrl+/, Esc)
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans select-none">
      {/* Linear Top Progress Bar for Page Transitions */}
      <TopProgressBar />

      {/* Floating Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Sticky 80px Glass Top Navigation */}
        <TopNavigation />

        {/* Dynamic Scrollable Page Body Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Overlays & Modals */}
      <FloatingAIButton />
      <CommandPalette />
      <NotificationCenter />
      <KeyboardShortcutsModal />
    </div>
  );
}

export default function AppLayout({ children }) {
  return (
    <ShellProvider>
      <ToastProvider>
        <AppLayoutInner>{children}</AppLayoutInner>
      </ToastProvider>
    </ShellProvider>
  );
}
