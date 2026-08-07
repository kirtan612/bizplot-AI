import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command, ArrowRight, Sparkles, FilePlus, ShoppingBag, 
  Settings, Users, Package, FileText, ArrowUpRight, CheckCircle2, 
  HelpCircle, BarChart3, TrendingUp, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';
import { SYSTEM_MODULES, MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_INVOICES, MOCK_SUPPLIERS, QUICK_ACTIONS } from '../../services/searchDataService';

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveTab } = useShell();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [commandPaletteOpen]);

  // Aggregate search items based on query
  const getFilteredResults = () => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return [
        { type: 'header', title: 'Quick Actions' },
        ...QUICK_ACTIONS.map(item => ({ ...item, section: 'action' })),
        { type: 'header', title: 'Core Navigation' },
        ...SYSTEM_MODULES.slice(0, 6).map(item => ({ ...item, section: 'module' }))
      ];
    }

    const results = [];

    // Modules
    const filteredModules = SYSTEM_MODULES.filter(m => 
      m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
    if (filteredModules.length > 0) {
      results.push({ type: 'header', title: 'Business Modules' });
      filteredModules.forEach(m => results.push({ ...m, section: 'module' }));
    }

    // Customers
    const filteredCust = MOCK_CUSTOMERS.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));
    if (filteredCust.length > 0) {
      results.push({ type: 'header', title: 'Customers' });
      filteredCust.forEach(c => results.push({ ...c, section: 'customer' }));
    }

    // Products
    const filteredProd = MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q));
    if (filteredProd.length > 0) {
      results.push({ type: 'header', title: 'Inventory & Products' });
      filteredProd.forEach(p => results.push({ ...p, section: 'product' }));
    }

    // Invoices
    const filteredInv = MOCK_INVOICES.filter(i => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
    if (filteredInv.length > 0) {
      results.push({ type: 'header', title: 'Invoices & Billing' });
      filteredInv.forEach(i => results.push({ ...i, section: 'invoice' }));
    }

    // Direct AI Ask trigger
    results.push({ type: 'header', title: 'Ask BizPilot AI' });
    results.push({
      id: `ai-ask-${q}`,
      title: `Ask AI: "${query}"`,
      category: 'AI Query',
      subtitle: 'Run real-time autonomous analysis across company database',
      section: 'ai-query'
    });

    return results;
  };

  const results = getFilteredResults();
  const selectableItems = results.filter(r => r.type !== 'header');

  // Handle Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (selectableItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + selectableItems.length) % (selectableItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = selectableItems[selectedIndex];
      if (selected) handleExecute(selected);
    }
  };

  const handleExecute = (item) => {
    setCommandPaletteOpen(false);

    if (item.section === 'module') {
      setActiveTab(item.id);
      toast.info('Navigating', `Switched to ${item.title}`);
    } else if (item.section === 'action') {
      if (item.id === 'act-invoice') {
        toast.action('Create Invoice Initiated', 'Invoice builder opened with auto GST draft.', 'View Draft', () => setActiveTab('finance'));
      } else if (item.id === 'act-po') {
        toast.success('Purchase Order Workflow', 'Opening vendor purchase order wizard.');
      } else if (item.id === 'act-ai-audit') {
        setActiveTab('profit');
        toast.action('AI Audit Completed', 'Detected 3 margin optimization opportunities.', 'View Insights', () => setActiveTab('profit'));
      }
    } else if (item.section === 'ai-query') {
      setActiveTab('ai-advisor');
      toast.info('BizPilot AI Advisor', `Processing query: "${query}"`);
    } else {
      toast.info('Item Selected', `${item.title} — ${item.category}`);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={() => setCommandPaletteOpen(false)} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-2xl bg-[#0f0f13]/95 border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10"
        >
          {/* Header Search Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search anything... (Pages, Invoices, Customers, Products, Ask AI)"
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-sans"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-white p-1 mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-[11px] font-mono text-zinc-400 border border-white/10">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.04]">
            {selectableItems.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No matching results found for "{query}". Try searching for 'Invoice', 'Steel', or 'Profit'.
              </div>
            ) : (
              results.map((item, idx) => {
                if (item.type === 'header') {
                  return (
                    <div key={`header-${item.title}-${idx}`} className="px-3 pt-3 pb-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                      {item.title}
                    </div>
                  );
                }

                // Compute index in selectable items array
                const itemSelectIndex = selectableItems.findIndex(s => s.id === item.id);
                const isSelected = itemSelectIndex === selectedIndex;

                return (
                  <button
                    key={item.id || idx}
                    onClick={() => handleExecute(item)}
                    onMouseEnter={() => setSelectedIndex(itemSelectIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer my-0.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'text-zinc-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.section === 'ai-query' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        item.section === 'action' ? 'bg-amber-500/20 text-amber-400' :
                        item.section === 'module' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-white/10 text-zinc-300'
                      }`}>
                        {item.section === 'ai-query' ? <Sparkles className="w-4 h-4" /> :
                         item.section === 'action' ? <FilePlus className="w-4 h-4" /> :
                         item.section === 'customer' ? <Users className="w-4 h-4" /> :
                         item.section === 'product' ? <Package className="w-4 h-4" /> :
                         item.section === 'invoice' ? <FileText className="w-4 h-4" /> :
                         <Command className="w-4 h-4" />}
                      </div>

                      <div className="truncate">
                        <div className="text-xs font-semibold flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.status && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 font-normal">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {item.subtitle || item.description || item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.shortcut && (
                        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-zinc-400 border border-white/10">
                          {item.shortcut}
                        </span>
                      )}
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-blue-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-zinc-300">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-zinc-300">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-zinc-300">esc</kbd> Exit
              </span>
            </div>
            <span className="text-zinc-600 font-mono">BizPilot AI Search Engine v2.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
