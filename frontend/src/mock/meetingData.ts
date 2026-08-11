export interface ExecutiveMessage {
  id: string;
  executiveId: string;
  executiveName: string;
  executiveRole: string;
  avatarIcon: string;
  badgeColor: string;
  timestamp: string;
  content: string;
  dataReferences?: {
    label: string;
    value: string;
    trend?: string;
  }[];
}

export interface ExecutiveMeetingTopic {
  id: string;
  title: string;
  subtitle: string;
  category: 'Financial Performance' | 'Operations' | 'Growth' | 'Risk Control';
  participants: string[]; // executive ids
  date: string;
  status: 'Completed' | 'Live Discussion' | 'Scheduled';
  messages: ExecutiveMessage[];
  finalConclusion: {
    title: string;
    summary: string;
    recommendations: {
      id: string;
      title: string;
      leadExecutive: string;
      expectedImpact: string;
      actionRoute: string;
      actionText: string;
    }[];
  };
}

export const MOCK_MEETING_TOPICS: ExecutiveMeetingTopic[] = [
  {
    id: 'mtg-profit-decline',
    title: 'Why did gross profit margin decline this month?',
    subtitle: 'Cross-executive analysis of input cost inflation, distributor discounting, and supply chain pricing variance.',
    category: 'Financial Performance',
    participants: ['ai-ceo', 'ai-cfo', 'ai-coo', 'ai-supply-chain', 'ai-sales'],
    date: 'Today • 10:45 AM',
    status: 'Completed',
    messages: [
      {
        id: 'msg-1',
        executiveId: 'ai-ceo',
        executiveName: 'AI CEO',
        executiveRole: 'Chief Executive Officer',
        avatarIcon: 'Building2',
        badgeColor: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
        timestamp: '10:42 AM',
        content: 'Team, our top-line revenue is growing strongly at +12.4%, but gross margin compressed by 140 bps. Let us identify the root cause across ledgers, procurement, and sales.',
        dataReferences: [
          { label: 'Revenue Growth', value: '+12.4%', trend: 'up' },
          { label: 'Gross Margin', value: '25.8%', trend: 'down' },
        ],
      },
      {
        id: 'msg-2',
        executiveId: 'ai-cfo',
        executiveName: 'AI CFO',
        executiveRole: 'Chief Financial Officer',
        avatarIcon: 'DollarSign',
        badgeColor: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
        timestamp: '10:43 AM',
        content: 'Analyzing the P&L ledgers reveals material cost of goods sold rose 12.4% over the past cycle. Additionally, average distributor volume discounts increased from 4.2% to 6.0%.',
        dataReferences: [
          { label: 'Raw Material COGS', value: '+12.4%', trend: 'up' },
          { label: 'Distributor Discount', value: '6.0%', trend: 'up' },
        ],
      },
      {
        id: 'msg-3',
        executiveId: 'ai-supply-chain',
        executiveName: 'AI Supply Chain',
        executiveRole: 'Chief Supply Chain Officer',
        avatarIcon: 'Truck',
        badgeColor: 'border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
        timestamp: '10:44 AM',
        content: 'Two key steel mills (Jindal Steel & Tata BSL) raised quote prices by 14% due to global iron ore price adjustments. This concentrated cost spike accounts for 68% of our cost variance.',
        dataReferences: [
          { label: 'Jindal Steel Quote Variance', value: '+14.0%', trend: 'up' },
          { label: 'Supplier Concentration', value: '68%', trend: 'warning' },
        ],
      },
      {
        id: 'msg-4',
        executiveId: 'ai-coo',
        executiveName: 'AI COO',
        executiveRole: 'Chief Operating Officer',
        avatarIcon: 'BriefcaseBusiness',
        badgeColor: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
        timestamp: '10:44 AM',
        content: 'We can offset roughly ₹74K in monthly operational overhead by consolidating regional freight routes and utilizing back-haul capacity from our Western Logistics Hub.',
        dataReferences: [
          { label: 'Operational Freight Saving', value: '₹74K/mo', trend: 'down' },
        ],
      },
      {
        id: 'msg-5',
        executiveId: 'ai-sales',
        executiveName: 'AI Sales',
        executiveRole: 'Chief Sales Officer',
        avatarIcon: 'ShoppingCart',
        badgeColor: 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
        timestamp: '10:45 AM',
        content: 'Notice that 18 high-value distributor accounts reduced repeat purchasing by 22% because of extended freight fulfillment lead times. We cannot raise base prices blindly without risking further account attrition.',
        dataReferences: [
          { label: 'Declining Accounts', value: '18 accounts', trend: 'warning' },
          { label: 'Order Frequency Reduction', value: '-22.0%', trend: 'down' },
        ],
      },
      {
        id: 'msg-6',
        executiveId: 'ai-ceo',
        executiveName: 'AI CEO',
        executiveRole: 'Chief Executive Officer',
        avatarIcon: 'Building2',
        badgeColor: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
        timestamp: '10:45 AM',
        content: 'Synthesis agreed. We must prioritize retaining high-value accounts while renegotiating primary supplier contracts and re-indexing Tier-2 distributor discount structures.',
      },
    ],
    finalConclusion: {
      title: 'Strategic Decision & Action Plan',
      summary: 'The Executive Leadership Team recommends a 3-pronged operational intervention to restore gross margin back to 27.5% without compromising customer retention.',
      recommendations: [
        {
          id: 'rec-1',
          title: 'Renegotiate Tier-1 Supplier Quotations',
          leadExecutive: 'AI Supply Chain',
          expectedImpact: 'Restores +1.4% to gross margin',
          actionRoute: '/app/purchases',
          actionText: 'Analyze Suppliers',
        },
        {
          id: 'rec-2',
          title: 'Re-index Discount Tiers for Non-Bulk Distributors',
          leadExecutive: 'AI CFO & Sales',
          expectedImpact: 'Recovers ₹1.2Cr in annual net revenue',
          actionRoute: '/app/finance',
          actionText: 'Review Pricing Tiers',
        },
        {
          id: 'rec-3',
          title: 'Direct Priority Outreach to 18 Declining Accounts',
          leadExecutive: 'AI Sales',
          expectedImpact: 'Protects ₹3.2L in monthly recurring sales',
          actionRoute: '/app/customers',
          actionText: 'View Accounts',
        },
      ],
    },
  },
];
