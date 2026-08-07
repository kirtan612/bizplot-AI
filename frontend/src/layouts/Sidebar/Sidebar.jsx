import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, DollarSign, TrendingUp, ShoppingBag, Package, 
  Users, Building2, BarChart3, FileText, Sparkles, Shield, 
  CheckSquare, Settings, User, HelpCircle, ChevronRight, ChevronLeft, 
  Pin, LogOut, Command, Bot, Zap, X, ChevronDown
} from 'lucide-react';
import { useShell, WORKSPACES, COMPANIES } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

// Sidebar Sections Array matching prompt specification
const SIDEBAR_SECTIONS = [
  {
    title: 'Core Operations',
    items: [
      { id: 'command-center', label: 'Business Command Center', icon: LayoutDashboard, badge: 'Live' }
    ]
  },
  {
    title: 'Intelligence Modules',
    items: [
      { id: 'finance', label: 'Finance Intelligence', icon: DollarSign, badge: 'GST' },
      { id: 'profit', label: 'Profit Intelligence', icon: TrendingUp, badge: 'AI' },
      { id: 'sales', label: 'Sales Intelligence', icon: ShoppingBag },
      { id: 'inventory', label: 'Inventory Intelligence', icon: Package, badge: '2 Low' },
      { id: 'customer', label: 'Customer Intelligence', icon: Users },
      { id: 'supplier', label: 'Supplier Intelligence', icon: Building2 }
    ]
  },
  {
    title: 'Analytics & Reporting',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText }
    ]
  },
  {
    title: 'Autonomous AI',
    items: [
      { id: 'ai-advisor', label: 'AI Business Advisor', icon: Bot, isAi: true, badge: 'Advisor' },
      { id: 'ai-board', label: 'AI Board Meeting', icon: Sparkles, isAi: true, badge: 'NEW' },
      { id: 'action-center', label: 'Action Center', icon: CheckSquare, badge: '3' }
    ]
  },
  {
    title: 'System & Support',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'help', label: 'Help & Support', icon: HelpCircle }
    ]
  }
];

export default function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    sidebarPinned,
    setSidebarPinned,
    sidebarWidth,
    setSidebarWidth,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    activeTab,
    setActiveTab,
    currentWorkspace,
    setCurrentWorkspace,
    currentCompany,
    setCurrentCompany,
    setProfileMenuOpen
  } = useShell();

  const toast = useToast();
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  // Resize Handler
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 220), 340);
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const renderContent = () => (
    <div className="flex flex-col h-full overflow-hidden select-none text-zinc-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(59,130,246,0.4)] shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="min-w-0 flex-1"
            >
              <h1 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                <span>BIZPILOT</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI OS
                </span>
              </h1>
              <p className="text-[10px] text-zinc-400 truncate">MSME Operating System</p>
            </motion.div>
          )}
        </div>

        {/* Toggle & Pin Actions */}
        <div className="flex items-center gap-1">
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                sidebarPinned ? 'text-blue-400 hover:bg-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
              title={sidebarPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden md:block"
            title={sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
        {SIDEBAR_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (mobileDrawerOpen) setMobileDrawerOpen(false);
                    }}
                    onMouseEnter={() => sidebarCollapsed && setHoveredTooltip(item.label)}
                    onMouseLeave={() => setHoveredTooltip(null)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer relative ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Animated Active Indicator Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className={`absolute inset-0 rounded-xl ${
                          item.isAi
                            ? 'bg-gradient-to-r from-purple-600/30 to-violet-600/20 border border-purple-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                            : 'bg-gradient-to-r from-blue-600/30 to-blue-500/10 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                        }`}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0 z-10">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? (item.isAi ? 'text-purple-400 scale-110' : 'text-blue-400 scale-110') : 'text-zinc-400'
                      }`} />

                      {!sidebarCollapsed && (
                        <span className="text-xs truncate tracking-wide">{item.label}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <span className={`z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.badge === 'Live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse' :
                        item.badge === 'NEW' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        item.badge === '2 Low' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {sidebarCollapsed && item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 z-10" />
                    )}
                  </button>

                  {/* Tooltip for Collapsed Sidebar */}
                  {sidebarCollapsed && hoveredTooltip === item.label && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-lg bg-[#1a1a20] border border-white/20 text-xs text-white font-medium shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Section: Workspace, Company & User Profile */}
      <div className="p-3 border-t border-white/[0.08] bg-white/[0.02] shrink-0 space-y-2">
        {!sidebarCollapsed && (
          <>
            {/* Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Workspace</div>
                  <div className="text-xs font-semibold text-white truncate">{currentWorkspace.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              {workspaceDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#1a1a22] border border-white/20 rounded-xl p-1.5 shadow-2xl z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] text-zinc-400 font-semibold uppercase">Switch Workspace</div>
                  {WORKSPACES.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setWorkspaceDropdownOpen(false);
                        toast.info('Workspace Switch', `Switched to ${ws.name}`);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                        currentWorkspace.id === ws.id ? 'bg-blue-600/20 text-blue-300 font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{ws.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current Company Quick Card */}
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate text-zinc-300 text-[11px] font-medium">{currentCompany.name}</span>
              </div>
            </div>
          </>
        )}

        {/* User Profile Mini Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setProfileMenuOpen(true)}
            className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-left min-w-0 ${
              sidebarCollapsed ? 'w-full justify-center' : 'flex-1'
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                KR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121215]" />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">Kirtan R.</div>
                <div className="text-[10px] text-zinc-400 truncate">CFO / Admin</div>
              </div>
            )}
          </button>

          {!sidebarCollapsed && (
            <button
              onClick={() => toast.info('Logged Out', 'Successfully signed out.')}
              className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 bg-[#121215]/95 border border-white/[0.1] rounded-[22px] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] relative shrink-0 z-30 group"
      >
        {renderContent()}

        {/* Resizable Width Drag Handle */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-blue-500/40 transition-opacity rounded-r-2xl z-40"
          />
        )}
      </motion.aside>

      {/* Mobile Drawer Overlay Sidebar */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex">
            <div className="absolute inset-0" onClick={() => setMobileDrawerOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-72 h-full bg-[#121215] border-r border-white/15 relative z-10 shadow-2xl"
            >
              {renderContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
