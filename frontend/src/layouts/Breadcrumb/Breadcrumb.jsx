import React from 'react';
import { ChevronRight, Home, LayoutDashboard, Sparkles } from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';

const NAV_MAP = {
  'command-center': { title: 'Business Command Center', parent: 'Overview' },
  'finance': { title: 'Finance Intelligence', parent: 'Intelligence Engine' },
  'profit': { title: 'Profit Intelligence', parent: 'Intelligence Engine' },
  'sales': { title: 'Sales Intelligence', parent: 'Intelligence Engine' },
  'inventory': { title: 'Inventory Intelligence', parent: 'Intelligence Engine' },
  'customer': { title: 'Customer Intelligence', parent: 'Intelligence Engine' },
  'supplier': { title: 'Supplier Intelligence', parent: 'Intelligence Engine' },
  'analytics': { title: 'Analytics & KPIs', parent: 'Reports & Analytics' },
  'reports': { title: 'Compliance & Reports', parent: 'Reports & Analytics' },
  'ai-advisor': { title: 'AI Business Advisor', parent: 'Autonomous AI' },
  'ai-board': { title: 'AI Board Meeting', parent: 'Autonomous AI' },
  'action-center': { title: 'Action Center', parent: 'Workflow' },
  'settings': { title: 'System Settings', parent: 'Platform' },
  'profile': { title: 'User Profile & Workspace', parent: 'Platform' },
  'help': { title: 'Help & Knowledge Base', parent: 'Platform' }
};

export default function Breadcrumb({ overrideItems }) {
  const { activeTab, setActiveTab, currentWorkspace } = useShell();

  const currentNav = NAV_MAP[activeTab] || { title: activeTab, parent: 'Workspace' };

  const defaultItems = [
    { label: currentWorkspace.name, onClick: () => setActiveTab('command-center'), icon: Home },
    { label: currentNav.parent, onClick: null },
    { label: currentNav.title, onClick: null, isCurrent: true }
  ];

  const items = overrideItems || defaultItems;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-zinc-400">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
            
            {item.onClick && !isLast ? (
              <button
                onClick={item.onClick}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer rounded px-1.5 py-0.5 hover:bg-white/5"
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-blue-400" />}
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.label}</span>
              </button>
            ) : isLast ? (
              <span className="flex items-center gap-1.5 text-zinc-100 font-semibold truncate max-w-[180px] sm:max-w-[240px] bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.06]">
                {Icon && <Icon className="w-3.5 h-3.5 text-purple-400" />}
                <span className="truncate">{item.label}</span>
              </span>
            ) : (
              <span className="text-zinc-400 truncate max-w-[120px] sm:max-w-[180px]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
