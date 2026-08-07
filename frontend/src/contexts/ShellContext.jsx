import React, { createContext, useContext, useState, useEffect } from 'react';

const ShellContext = createContext(null);

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Critical Stock Level Warning',
    message: 'Cold-Rolled Steel Coils (CR-4042) dropped below minimum safety threshold (4.2 Tons remaining).',
    category: 'Inventory Alerts',
    priority: 'high',
    timestamp: '10 mins ago',
    unread: true,
    actionLabel: 'Reorder Now',
    actionTab: 'inventory'
  },
  {
    id: 'notif-2',
    title: 'AI Margin Optimization Recommendation',
    message: 'AI detected a 4.8% gross margin leakage on Tier-2 distributor contracts in Western region.',
    category: 'AI Recommendations',
    priority: 'high',
    timestamp: '45 mins ago',
    unread: true,
    actionLabel: 'View AI Insight',
    actionTab: 'profit'
  },
  {
    id: 'notif-3',
    title: 'High-Value Invoice Payment Received',
    message: 'Received ₹14,50,000 payment from Metro Infra Solutions for Invoice #INV-2026-889.',
    category: 'Finance Alerts',
    priority: 'normal',
    timestamp: '2 hours ago',
    unread: true,
    actionLabel: 'View Invoice',
    actionTab: 'finance'
  },
  {
    id: 'notif-4',
    title: 'Sales Target Exceeded',
    message: 'Q3 Sales target milestone reached 104.2% ahead of schedule.',
    category: 'Sales Alerts',
    priority: 'normal',
    timestamp: '5 hours ago',
    unread: false,
    actionLabel: 'View Sales Report',
    actionTab: 'sales'
  },
  {
    id: 'notif-5',
    title: 'Autonomous GST Reconciliation Complete',
    message: 'GSTR-3B draft auto-matched with 99.4% precision against vendor tax credits.',
    category: 'Business Alerts',
    priority: 'normal',
    timestamp: '1 day ago',
    unread: false,
    actionLabel: 'Review Filing',
    actionTab: 'reports'
  }
];

export const WORKSPACES = [
  { id: 'ws-mumbai', name: 'Mumbai Industrial Hub', code: 'BOM-01', role: 'Headquarters', type: 'Primary' },
  { id: 'ws-pune', name: 'Pune Manufacturing Yard', code: 'PNQ-02', role: 'Production Plant', type: 'Secondary' },
  { id: 'ws-delhi', name: 'NCR Distribution Hub', code: 'DEL-04', role: 'Logistics', type: 'Branch' }
];

export const COMPANIES = [
  { id: 'comp-apex', name: 'Apex Steel & Materials Pvt Ltd', gstin: '27AAAAA0000A1Z5', currency: 'INR (₹)' },
  { id: 'comp-zenith', name: 'Zenith Logistics & Supply Chain', gstin: '27BBBBB1111B1Z2', currency: 'INR (₹)' },
  { id: 'comp-global', name: 'BizPilot Exports Global Inc.', gstin: 'FOREIGN-EX-99', currency: 'USD ($)' }
];

export function ShellProvider({ children }) {
  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('bizpilot_sidebar_collapsed') === 'true';
  });
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260); // Default expanded width
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('command-center');
  
  // Workspace & Company states
  const [currentWorkspace, setCurrentWorkspace] = useState(WORKSPACES[0]);
  const [currentCompany, setCurrentCompany] = useState(COMPANIES[0]);

  // Command Palette & Global Search
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Notification Center
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // AI Advisor Overlay
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState(false);
  const [hasNewAiInsights, setHasNewAiInsights] = useState(true);

  // Profile Menu Dropdown state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Keyboard Shortcuts Modal state
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Global Loading State
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Persist sidebar collapsed state
  useEffect(() => {
    localStorage.setItem('bizpilot_sidebar_collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const triggerGlobalLoading = (durationMs = 800) => {
    setIsGlobalLoading(true);
    setLoadingProgress(15);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, durationMs / 4);

    setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsGlobalLoading(false);
        setLoadingProgress(0);
      }, 200);
    }, durationMs);
  };

  const handleNavigateTab = (tabId) => {
    triggerGlobalLoading(400);
    setActiveTab(tabId);
    if (mobileDrawerOpen) setMobileDrawerOpen(false);
  };

  return (
    <ShellContext.Provider
      value={{
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
        setActiveTab: handleNavigateTab,
        currentWorkspace,
        setCurrentWorkspace,
        currentCompany,
        setCurrentCompany,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        clearNotification,
        aiAdvisorOpen,
        setAiAdvisorOpen,
        hasNewAiInsights,
        setHasNewAiInsights,
        profileMenuOpen,
        setProfileMenuOpen,
        shortcutsModalOpen,
        setShortcutsModalOpen,
        isGlobalLoading,
        loadingProgress,
        triggerGlobalLoading
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}
