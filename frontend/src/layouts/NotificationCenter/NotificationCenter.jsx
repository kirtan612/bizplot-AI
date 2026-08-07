import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, CheckCheck, Filter, Search, Sparkles, AlertTriangle, 
  DollarSign, Package, TrendingUp, ShieldAlert, ArrowRight, Trash2 
} from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

const CATEGORIES = ['All', 'AI Recommendations', 'Business Alerts', 'Finance Alerts', 'Inventory Alerts', 'Sales Alerts'];

export default function NotificationCenter() {
  const { 
    notificationDrawerOpen, 
    setNotificationDrawerOpen, 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead, 
    clearNotification,
    setActiveTab 
  } = useShell();

  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!notificationDrawerOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'AI Recommendations': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Finance Alerts': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Inventory Alerts': return <Package className="w-4 h-4 text-amber-400" />;
      case 'Sales Alerts': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={() => setNotificationDrawerOpen(false)} />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="w-screen max-w-md bg-[#0f0f13] border-l border-white/10 shadow-2xl flex flex-col relative z-10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500 text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">Real-time MSME autonomous intelligence alerts</p>
                </div>
              </div>

              <button
                onClick={() => setNotificationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Controls & Search */}
            <div className="p-4 border-b border-white/10 bg-white/[0.01] space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter notifications..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500">Showing {filteredNotifications.length} items</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead();
                      toast.success('All notifications marked as read');
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  No notifications match your current filter.
                </div>
              ) : (
                filteredNotifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition-all relative ${
                      n.unread
                        ? 'bg-white/[0.04] border-white/15 shadow-md'
                        : 'bg-white/[0.01] border-white/5 opacity-75'
                    }`}
                  >
                    {n.unread && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white/5 shrink-0 mt-0.5">
                        {getCategoryIcon(n.category)}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                            {n.category}
                          </span>
                          <span className="text-[10px] text-zinc-500">{n.timestamp}</span>
                        </div>

                        <h4 className="text-xs font-semibold text-white mt-1">{n.title}</h4>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">{n.message}</p>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                          {n.actionLabel && (
                            <button
                              onClick={() => {
                                markAsRead(n.id);
                                setNotificationDrawerOpen(false);
                                if (n.actionTab) setActiveTab(n.actionTab);
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                              <span>{n.actionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => clearNotification(n.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors cursor-pointer ml-auto"
                            title="Dismiss"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-white/[0.02] text-center">
              <p className="text-[10px] font-mono text-zinc-500">BizPilot Autonomous Monitoring Active</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
