import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, FileText, ShoppingBag, Users, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commandItems: { category: string; items: CommandItem[] }[] = [
    { category: 'Quick Actions', items: [
      { id: '1', title: 'Ask BizPilot AI Assistant', icon: <Sparkles className="w-4 h-4 text-ai" />, shortcut: '⌘A' },
      { id: '2', title: 'Create Sales Invoice', icon: <FileText className="w-4 h-4 text-status-success" />, shortcut: '⌘S' },
      { id: '3', title: 'New Purchase Order', icon: <ShoppingBag className="w-4 h-4 text-primary" />, shortcut: '⌘P' }
    ]},
    { category: 'Master Registers', items: [
      { id: '4', title: 'Product Catalog (140 SKUs)', icon: <Layers className="w-4 h-4 text-secondary" /> },
      { id: '5', title: 'Suppliers Directory', icon: <Users className="w-4 h-4 text-text-secondary" /> },
      { id: '6', title: 'Customer Ledger Accounts', icon: <Users className="w-4 h-4 text-text-secondary" /> }
    ]}
  ];

  const filteredCategories = commandItems.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative z-10 w-full max-w-xl bg-surface border border-borderToken rounded-2xl shadow-2xl overflow-hidden glass-panel-elevated"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-borderToken">
              <Search className="w-5 h-5 text-text-muted shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search registers..."
                autoFocus
                className="w-full bg-transparent px-3 py-4 text-base text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted bg-surface-elevated px-2 py-0.5 rounded border border-borderToken">
                <Command className="w-3 h-3" /> K
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-sm">
                  No matching commands found.
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div key={cat.category} className="mb-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-3 py-1.5">
                      {cat.category}
                    </div>
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-text-primary hover:bg-primary-muted hover:text-white cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        {item.shortcut ? (
                          <span className="text-xs font-mono text-text-muted group-hover:text-white/80">
                            {item.shortcut}
                          </span>
                        ) : (
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 bg-surface-elevated/50 border-t border-borderToken flex items-center justify-between text-[11px] text-text-muted">
              <span>Press <kbd className="font-mono text-text-secondary">ESC</kbd> to exit</span>
              <span>BizPilot AI Command Shell</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
