export type InsightCategory = 'Risk' | 'Opportunity' | 'Trend' | 'Recommendation';

export interface AIBusinessInsight {
  id: string;
  category: InsightCategory;
  title: string;
  whyItMatters: string;
  recommendedAction: string;
  sourceExecutive: string;
  sourceExecutiveId: string;
  actionText: string;
  actionRoute: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const MOCK_AI_INSIGHTS: AIBusinessInsight[] = [
  {
    id: 'ins-1',
    category: 'Risk',
    title: '18 high-value customer accounts show declining purchase frequency.',
    whyItMatters: 'These distributor accounts represent ₹3.2L in average monthly recurring revenue and 14% of total order volume.',
    recommendedAction: 'Prioritize top 6 key accounts for immediate relationship review and customized pricing tier incentives.',
    sourceExecutive: 'AI Sales',
    sourceExecutiveId: 'ai-sales',
    actionText: 'Review Customers',
    actionRoute: '/app/customers',
    metrics: [
      { label: 'Exposed Monthly Revenue', value: '₹3.2L' },
      { label: 'Declining Accounts', value: '18' },
    ],
  },
  {
    id: 'ins-2',
    category: 'Opportunity',
    title: '₹3.2L slow-moving structural steel inventory identified (>90 days idle).',
    whyItMatters: 'Holding idle inventory ties up liquid treasury cash and incurs warehouse storage cost overhead.',
    recommendedAction: 'Launch a bundled liquidation promotion to high-frequency regional infrastructure contractors.',
    sourceExecutive: 'AI Supply Chain',
    sourceExecutiveId: 'ai-supply-chain',
    actionText: 'Analyze Inventory',
    actionRoute: '/app/inventory',
    metrics: [
      { label: 'Idle Stock Value', value: '₹3.2L' },
      { label: 'Days Idle', value: '>90 Days' },
    ],
  },
  {
    id: 'ins-3',
    category: 'Recommendation',
    title: 'Automate receivables credit freeze on accounts 60+ days past due.',
    whyItMatters: 'Overdue receivables increased to ₹4.1L, creating short-term working capital constraints.',
    recommendedAction: 'Enforce automatic order placement hold for accounts exceeding credit terms until partial payment clears.',
    sourceExecutive: 'AI CFO',
    sourceExecutiveId: 'ai-cfo',
    actionText: 'Review Overdue Invoices',
    actionRoute: '/app/invoices',
    metrics: [
      { label: 'Overdue Amount', value: '₹2.4L' },
      { label: 'Pending Invoices', value: '12' },
    ],
  },
  {
    id: 'ins-4',
    category: 'Trend',
    title: 'Regional logistics consolidation reduced fulfillment cycle by 18 minutes.',
    whyItMatters: 'Faster warehouse throughput led to a +1.2% improvement in customer delivery satisfaction scores.',
    recommendedAction: 'Replicate Western Distribution Hub dispatch automation across Eastern regional facilities.',
    sourceExecutive: 'AI COO',
    sourceExecutiveId: 'ai-coo',
    actionText: 'View Operations',
    actionRoute: '/app',
    metrics: [
      { label: 'Fulfillment Time', value: '1.4 Days' },
      { label: 'Monthly Saving', value: '₹42K' },
    ],
  },
];

export interface PriorityAction {
  step: string;
  title: string;
  subtitle: string;
  metricBadge: string;
  leadExecutive: string;
  leadExecutiveId: string;
  actionText: string;
  actionRoute: string;
}

export const MOCK_PRIORITY_ACTIONS: PriorityAction[] = [
  {
    step: '01',
    title: 'Recover overdue receivables',
    subtitle: '12 past-due invoices require collection escalation',
    metricBadge: '₹2.4L overdue',
    leadExecutive: 'AI CFO',
    leadExecutiveId: 'ai-cfo',
    actionText: 'Review',
    actionRoute: '/app/invoices',
  },
  {
    step: '02',
    title: 'Contact declining customers',
    subtitle: 'Key accounts with reduced order volume over 45 days',
    metricBadge: '18 accounts',
    leadExecutive: 'AI Sales',
    leadExecutiveId: 'ai-sales',
    actionText: 'View Customers',
    actionRoute: '/app/customers',
  },
  {
    step: '03',
    title: 'Renegotiate supplier pricing',
    subtitle: 'Primary raw material suppliers spike cost structure',
    metricBadge: '3 suppliers',
    leadExecutive: 'AI Supply Chain',
    leadExecutiveId: 'ai-supply-chain',
    actionText: 'Analyze Suppliers',
    actionRoute: '/app/purchases',
  },
  {
    step: '04',
    title: 'Reduce operational costs',
    subtitle: 'Consolidate freight logistics dispatch routes',
    metricBadge: 'Potential saving: ₹74K',
    leadExecutive: 'AI COO',
    leadExecutiveId: 'ai-coo',
    actionText: 'Review Logistics',
    actionRoute: '/app/finance',
  },
];
