export interface TimelineEvent {
  id: string;
  time: string;
  executiveId: string;
  executiveName: string;
  executiveRole: string;
  iconName: string;
  eventText: string;
  detailText?: string;
  category: 'Diagnostic' | 'Meeting' | 'Alert' | 'Optimization';
}

export const MOCK_INTELLIGENCE_TIMELINE: TimelineEvent[] = [
  {
    id: 'evt-1',
    time: '10:42 AM',
    executiveId: 'ai-cfo',
    executiveName: 'AI CFO',
    executiveRole: 'Chief Financial Officer',
    iconName: 'DollarSign',
    eventText: 'AI CFO detected margin decline.',
    detailText: 'Gross margin compressed to 25.8% due to steel coil input cost variance.',
    category: 'Diagnostic',
  },
  {
    id: 'evt-2',
    time: '10:38 AM',
    executiveId: 'ai-supply-chain',
    executiveName: 'AI Supply Chain',
    executiveRole: 'Chief Supply Chain Officer',
    iconName: 'Truck',
    eventText: 'AI Supply Chain identified supplier cost increase.',
    detailText: 'Jindal Steel & Tata BSL quotes raised 14% on structural pipe products.',
    category: 'Diagnostic',
  },
  {
    id: 'evt-3',
    time: '10:31 AM',
    executiveId: 'ai-sales',
    executiveName: 'AI Sales',
    executiveRole: 'Chief Revenue Officer',
    iconName: 'ShoppingCart',
    eventText: 'AI Sales detected declining high-value customers.',
    detailText: '18 key distributor accounts reduced order frequency by 22%.',
    category: 'Alert',
  },
  {
    id: 'evt-4',
    time: '10:15 AM',
    executiveId: 'ai-coo',
    executiveName: 'AI COO',
    executiveRole: 'Chief Operating Officer',
    iconName: 'BriefcaseBusiness',
    eventText: 'AI COO identified operational bottleneck.',
    detailText: 'Western hub dispatch routing automated, saving 18 minutes per turnaround.',
    category: 'Optimization',
  },
  {
    id: 'evt-5',
    time: '09:52 AM',
    executiveId: 'ai-ceo',
    executiveName: 'AI CEO',
    executiveRole: 'Chief Executive Officer',
    iconName: 'Building2',
    eventText: 'Executive Meeting completed.',
    detailText: 'Boardroom session finalized 3 strategic actions to protect profit margins.',
    category: 'Meeting',
  },
  {
    id: 'evt-6',
    time: '09:15 AM',
    executiveId: 'ai-bi',
    executiveName: 'AI BI',
    executiveRole: 'Chief Analytics Officer',
    iconName: 'BarChart3',
    eventText: 'AI BI correlated freight delays with dealer churn.',
    detailText: 'Discovered high statistical correlation (r=0.88) between delivery lead time and churn risk.',
    category: 'Diagnostic',
  },
];
