import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, X, ArrowRight } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, actionLabel, onAction, duration = 4500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, type, title, message, actionLabel, onAction };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message, options = {}) => addToast({ type: 'success', title, message, ...options }),
    warning: (title, message, options = {}) => addToast({ type: 'warning', title, message, ...options }),
    error: (title, message, options = {}) => addToast({ type: 'error', title, message, ...options }),
    info: (title, message, options = {}) => addToast({ type: 'info', title, message, ...options }),
    action: (title, message, actionLabel, onAction, options = {}) => 
      addToast({ type: 'action', title, message, actionLabel, onAction, duration: 6000, ...options }),
    remove: removeToast
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="sync">
          {toasts.map((item) => (
            <ToastItem key={item.id} item={item} onClose={() => removeToast(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ item, onClose }) {
  const { type, title, message, actionLabel, onAction } = item;

  const styles = {
    success: {
      bg: 'bg-[#0f1d17]/95',
      border: 'border-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    warning: {
      bg: 'bg-[#1f190e]/95',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    error: {
      bg: 'bg-[#201012]/95',
      border: 'border-rose-500/30',
      icon: XCircle,
      iconColor: 'text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]'
    },
    info: {
      bg: 'bg-[#101423]/95',
      border: 'border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-400',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
    },
    action: {
      bg: 'bg-[#151226]/95',
      border: 'border-violet-500/35',
      icon: Sparkles,
      iconColor: 'text-violet-400',
      glow: 'shadow-[0_0_25px_rgba(139,92,246,0.2)]'
    }
  };

  const style = styles[type] || styles.info;
  const IconComponent = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`pointer-events-auto w-full p-4 rounded-xl border ${style.bg} ${style.border} ${style.glow} backdrop-blur-xl text-white shadow-2xl flex items-start gap-3.5 relative overflow-hidden`}
    >
      {/* Accent edge line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        type === 'success' ? 'bg-emerald-500' :
        type === 'warning' ? 'bg-amber-500' :
        type === 'error' ? 'bg-rose-500' :
        type === 'action' ? 'bg-violet-500' : 'bg-blue-500'
      }`} />

      <div className="p-1 rounded-lg bg-white/5 shrink-0 mt-0.5">
        <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-xs font-semibold tracking-wide text-zinc-100 uppercase">{title}</h4>
        {message && <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{message}</p>}

        {actionLabel && onAction && (
          <button
            onClick={() => {
              onAction();
              onClose();
            }}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-md text-xs font-medium transition-colors cursor-pointer border border-white/10"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
