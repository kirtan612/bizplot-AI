import React, { useState } from 'react';
import LandingPage from './landing/LandingPage';
import AuthPage from './auth/AuthPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CommandPalette from './components/ui/CommandPalette';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import StockRegisters from './components/registers/StockRegisters';
import InventoryMonitoring from './components/inventory/InventoryMonitoring';
import CashFlowModule from './components/cashflow/CashFlowModule';
import AITerminal from './components/ai/AITerminal';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'auth' | 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeBranch, setActiveBranch] = useState('Main Yard (Mumbai Port)');
  const [isAdmin, setIsAdmin] = useState(true);
  const [aiTrained, setAiTrained] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Landing Page Mode
  if (viewMode === 'landing') {
    return <LandingPage onNavigateToApp={() => setViewMode('auth')} />;
  }

  // Enterprise Auth & Onboarding Mode
  if (viewMode === 'auth') {
    return (
      <AuthPage
        initialView="login"
        onNavigateHome={() => setViewMode('landing')}
        onAuthComplete={() => setViewMode('app')}
      />
    );
  }

  // Internal Business Operating System Command Center
  return (
    <div className="app-container">
      {/* Top Banner to switch back to Landing Page */}
      <div className="bg-blue-900/40 border-b border-blue-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-blue-300 shrink-0">
        <span className="font-mono text-[11px]">BIZPILOT AI OS // AUTONOMOUS EXECUTIVE COMMAND CENTER</span>
        <button
          onClick={() => setViewMode('landing')}
          className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
        >
          ← Exit to Landing Page
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isAdmin={isAdmin}
        />

        {/* Main Right Terminal Area */}
        <div className="main-content">
          <Header
            activeBranch={activeBranch}
            setActiveBranch={setActiveBranch}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            aiTrained={aiTrained}
            setAiTrained={setAiTrained}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Dynamic Body Content */}
          <main className="content-body">
            {activeTab === 'dashboard' && (
              <ExecutiveDashboard
                aiTrained={aiTrained}
                setAiTrained={setAiTrained}
                onNavigate={setActiveTab}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              />
            )}

            {activeTab === 'registers' && <StockRegisters />}

            {activeTab === 'inventory' && (
              <InventoryMonitoring
                aiTrained={aiTrained}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'cashflow' && (
              <CashFlowModule
                isAdmin={isAdmin}
                aiTrained={aiTrained}
              />
            )}

            {activeTab === 'ai-terminal' && (
              <AITerminal
                aiTrained={aiTrained}
                setAiTrained={setAiTrained}
              />
            )}
          </main>
        </div>
      </div>

      {/* Ctrl+K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
