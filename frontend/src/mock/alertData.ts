export type AlertCategory = 'Critical' | 'Attention' | 'Opportunity' | 'Information';

export interface AIAlert {
  id: string;
  category: AlertCategory;
  title: string;
  explanation: string;
  sourceExecutive: string;
  sourceExecutiveId: string;
  timestamp: string;
  actionText: string;
  actionRoute: string;
  iconName: string;
  badgeStyle: string;
}

export const MOCK_AI_ALERTS: AIAlert[] = [
  {
    id: 'alt-1',
    category: 'Critical',
    title: 'Cash-flow risk detected.',
    explanation: 'Working capital projected to fall below buffer limit if ₹2.4L in receivables remain uncollected past day 60.',
    sourceExecutive: 'AI CFO',
    sourceExecutiveId: 'ai-cfo',
    timestamp: '10:48 AM',
    actionText: 'Review Cash Flow',
    actionRoute: '/app/cashflow',
    iconName: 'CircleAlert',
    badgeStyle: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/50 dark:border-red-800/60',
  },
  {
    id: 'alt-2',
    category: 'Attention',
    title: '12 invoices are overdue.',
    explanation: 'Distributor invoice cycle variance increased by 4.2 days across Tier-2 dealer network.',
    sourceExecutive: 'AI CFO',
    sourceExecutiveId: 'ai-cfo',
    timestamp: '10:42 AM',
    actionText: 'Inspect Invoices',
    actionRoute: '/app/invoices',
    iconName: 'Clock',
    badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/60',
  },
  {
    id: 'alt-3',
    category: 'Opportunity',
    title: '₹3.2L slow-moving inventory identified.',
    explanation: 'GI Structural Pipe inventory idle for 90+ days in Western warehouse hub.',
    sourceExecutive: 'AI Supply Chain',
    sourceExecutiveId: 'ai-supply-chain',
    timestamp: '10:35 AM',
    actionText: 'Promote Inventory',
    actionRoute: '/app/inventory',
    iconName: 'Sparkles',
    badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60',
  },
  {
    id: 'alt-4',
    category: 'Information',
    title: 'Revenue exceeded the monthly target.',
    explanation: 'Monthly top-line reached ₹24.8L, pacing 3.3% higher than target projections.',
    sourceExecutive: 'AI CEO',
    sourceExecutiveId: 'ai-ceo',
    timestamp: '09:15 AM',
    actionText: 'View Performance',
    actionRoute: '/app/reports',
    iconName: 'CircleCheck',
    badgeStyle: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/50 dark:border-blue-800/60',
  },
];
