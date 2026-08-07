import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, ArrowRight, DollarSign, Package, TrendingDown, 
  CreditCard, PhoneCall, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { useShell } from '../../contexts/ShellContext';
import { useToast } from '../../contexts/ToastContext';

export default function ActionCenterSection() {
  const { setActiveTab } = useShell();
  const toast = useToast();

  const actionCards = [
    {
      id: 'act-1',
      title: 'Collect Payments (Overdue Invoices)',
      description: 'Apex Industrial Solutions has ₹4,85,000 overdue by 4 days (Invoice #INV-2026-890).',
      priority: 'High',
      priorityColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      impact: '+₹4,85,000 Cash Inflow',
      ctaLabel: 'Send Automated Payment Reminder',
      icon: DollarSign,
      action: () => {
        toast.success('Payment Reminder Sent', 'Automated WhatsApp & Email notice sent to Apex Accounts Dept.');
      }
    },
    {
      id: 'act-2',
      title: 'Generate Purchase Order for Steel Coils',
      description: 'CR-4042 Steel Coils stock at 4.2 Tons (Below 5.0 Tons safety threshold).',
      priority: 'High',
      priorityColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      impact: 'Prevent Production Stockout',
      ctaLabel: 'Draft PO to JSW Steel',
      icon: Package,
      action: () => {
        setActiveTab('supplier');
        toast.action('PO Drafted', 'Purchase Order #PO-2026-105 drafted for JSW Steel.', 'View PO', () => setActiveTab('supplier'));
      }
    },
    {
      id: 'act-3',
      title: 'Review Profit Margin Drop in West Region',
      description: 'Gross margin dropped 4.8% on Tier-2 distributor contracts due to freight cost variance.',
      priority: 'Medium',
      priorityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      impact: '+₹1,40,000 EBITDA Recovery',
      ctaLabel: 'Adjust Tier Pricing Thresholds',
      icon: TrendingDown,
      action: () => {
        setActiveTab('profit');
        toast.info('Pricing Matrix Opened', 'Reviewing Tier-2 distributor freight pricing.');
      }
    },
    {
      id: 'act-4',
      title: 'Check Inventory Reorder Alert',
      description: 'Precision Brass Fasteners M8 reached reorder level (12,000 units remaining).',
      priority: 'Medium',
      priorityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      impact: 'Maintain Order Delivery Speed',
      ctaLabel: 'Reorder Stock Snapshot',
      icon: Package,
      action: () => {
        setActiveTab('inventory');
        toast.success('Reorder Triggered', 'Stock reorder request logged for Gujarat Foundries.');
      }
    },
    {
      id: 'act-5',
      title: 'Approve Working Capital Credit Line',
      description: 'Pre-approved ₹25,000,000 working capital line at 8.2% p.a. for seasonal steel inventory.',
      priority: 'Low',
      priorityColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      impact: '₹25L Extended Liquidity Buffer',
      ctaLabel: 'Review Credit Terms',
      icon: CreditCard,
      action: () => {
        setActiveTab('finance');
        toast.info('Credit Offer Terms', 'Viewing bank working capital terms.');
      }
    },
    {
      id: 'act-6',
      title: 'Schedule Customer Contract Renewal',
      description: 'Bharat Heavy Engineering annual supply agreement expires in 14 days.',
      priority: 'Medium',
      priorityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      impact: 'Protect ₹12.4L Annual Revenue',
      ctaLabel: 'Schedule Executive Call',
      icon: PhoneCall,
      action: () => {
        setActiveTab('customer');
        toast.success('Follow-up Logged', 'Executive call scheduled for Monday 11:00 AM.');
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Action Center Matrix (6 High-Impact Items)
          </h3>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">Automated Task Prioritization</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-[#121215]/90 border border-white/[0.08] hover:border-white/20 transition-all shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase font-mono ${card.priorityColor}`}>
                    {card.priority} Priority
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 text-zinc-400 group-hover:text-purple-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {card.title}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Business Impact:</span>
                  <span className="font-mono">{card.impact}</span>
                </div>

                <button
                  onClick={card.action}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-purple-600/30 text-zinc-200 hover:text-white border border-white/10 hover:border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{card.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
