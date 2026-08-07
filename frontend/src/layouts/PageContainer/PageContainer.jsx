import React from 'react';
import { motion } from 'framer-motion';

export default function PageContainer({ 
  title, 
  description, 
  badge, 
  actions, 
  children,
  className = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${className}`}
    >
      {/* Page Header Section */}
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {title && (
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  {title}
                </h1>
              )}

              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono">
                  {badge}
                </span>
              )}
            </div>

            {description && (
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Header Action Buttons Slot */}
          {actions && (
            <div className="flex items-center gap-2.5 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Main Page Content Body */}
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}
