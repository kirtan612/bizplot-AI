export type ExecutiveStatusType = 'Healthy' | 'Attention' | 'Risk' | 'Working' | 'Offline';

export interface AIExecutive {
  id: string;
  code: string;
  name: string;
  role: string;
  department: string;
  iconName: string; // Lucide icon identifier
  status: ExecutiveStatusType;
  statusText: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  primaryMetricChange: string;
  insight: string;
  route: string;
  permission: string;
  accentColor: string;
  description: string;
  keyResponsibilities: string[];
  recentDiagnostic: {
    timestamp: string;
    finding: string;
    impact: string;
  }[];
  domainMetrics: {
    label: string;
    value: string;
    change?: string;
    status?: 'positive' | 'negative' | 'neutral';
  }[];
  strategicOptions: {
    title: string;
    impact: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommended: boolean;
  }[];
}

export const MOCK_AI_EXECUTIVES: AIExecutive[] = [
  {
    id: 'ai-ceo',
    code: 'CEO',
    name: 'AI CEO',
    role: 'Chief Executive Officer',
    department: 'Executive Strategy & Corporate Growth',
    iconName: 'Building2',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'Company Health Index',
    primaryMetricValue: '94.2/100',
    primaryMetricChange: '+2.4 pts',
    insight: 'Revenue growth trajectory is strong (+12.4%), but gross margin erosion requires cross-executive alignment.',
    route: '/app/ai/ceo',
    permission: 'ai.ceo.view',
    accentColor: '#3B82F6', // Blue
    description: 'Provides holistic strategic oversight, evaluates multi-department trade-offs, and synthesizes executive insights into decisive growth strategies.',
    keyResponsibilities: [
      'Corporate Growth & Expansion Strategy',
      'Cross-Executive Alignment',
      'Capital Allocation Efficiency',
      'Market Expansion & Competitive Risk',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:45 AM',
        finding: 'Consolidated revenue pacing 8.4% ahead of annual baseline.',
        impact: 'High upside for Q3 valuation multiples.',
      },
      {
        timestamp: '09:12 AM',
        finding: 'Cross-functional alignment required on distributor discount policies.',
        impact: 'Prevents unnecessary price dilution across Tier-2 distributors.',
      },
    ],
    domainMetrics: [
      { label: 'Overall Business Growth', value: '+14.2%', change: 'YoY', status: 'positive' },
      { label: 'Market Share Index', value: '38.6%', change: '+1.8%', status: 'positive' },
      { label: 'Capital Efficiency (ROIC)', value: '22.4%', change: '+0.9%', status: 'positive' },
      { label: 'Strategic Risk Score', value: '18/100', change: '-4 pts', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Accelerate Tier-1 Infrastructure Supply Contracts',
        impact: 'Adds ₹4.2Cr projected revenue in Q4',
        riskLevel: 'Medium',
        recommended: true,
      },
      {
        title: 'Consolidate Primary Raw Material Suppliers',
        impact: 'Saves 3.8% on bill of materials',
        riskLevel: 'Low',
        recommended: true,
      },
      {
        title: 'Expand Direct Distribution Centers to South Region',
        impact: 'Increases regional market share by 6%',
        riskLevel: 'High',
        recommended: false,
      },
    ],
  },
  {
    id: 'ai-cfo',
    code: 'CFO',
    name: 'AI CFO',
    role: 'Chief Financial Officer',
    department: 'Treasury, Margins & Financial Control',
    iconName: 'DollarSign',
    status: 'Attention',
    statusText: 'Attention',
    primaryMetricLabel: 'Gross Margin',
    primaryMetricValue: '25.8%',
    primaryMetricChange: '-1.4%',
    insight: 'Gross margin declined due to increased material cost (+12.4%) and higher freight expenses.',
    route: '/app/ai/cfo',
    permission: 'ai.cfo.view',
    accentColor: '#F59E0B', // Amber
    description: 'Monitors real-time financial ledgers, projects multi-period cash liquidity, analyzes cost variances, and enforces margin discipline.',
    keyResponsibilities: [
      'Financial Telemetry & Profit Analysis',
      'Working Capital & Cash Flow Forecasting',
      'Accounts Receivable Aging Mitigation',
      'Tax & GST Reconciliation Control',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:42 AM',
        finding: 'Steel coil input costs rose 12.4% over past purchasing cycle.',
        impact: 'Reduces net profit margin by 140 bps unless pricing is re-indexed.',
      },
      {
        timestamp: '08:30 AM',
        finding: 'Overdue receivables (>60 days) reached ₹4.1L across 12 dealer accounts.',
        impact: 'Increases short-term liquidity risk by ₹2.4L.',
      },
    ],
    domainMetrics: [
      { label: 'Net Profit Margin', value: '11.8%', change: '-0.8%', status: 'negative' },
      { label: 'Days Sales Outstanding (DSO)', value: '34 Days', change: '+2 Days', status: 'negative' },
      { label: 'Free Cash Flow', value: '₹9.2L', change: '-3.2%', status: 'negative' },
      { label: 'EBITDA Margin', value: '18.4%', change: '+0.3%', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Enforce Automated Credit Freeze on 60+ Day Overdue Accounts',
        impact: 'Recovers ₹2.4L in cash within 14 days',
        riskLevel: 'Low',
        recommended: true,
      },
      {
        title: 'Adjust Wholesale Pricing Floor by +2.5%',
        impact: 'Restores gross margin to 27.2%',
        riskLevel: 'Medium',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-coo',
    code: 'COO',
    name: 'AI COO',
    role: 'Chief Operating Officer',
    department: 'Operations, Fulfillment & Efficiency',
    iconName: 'BriefcaseBusiness',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'Operational Efficiency',
    primaryMetricValue: '92.6%',
    primaryMetricChange: '+1.8%',
    insight: 'Order fulfillment cycle time improved to 1.4 days across major logistics hubs.',
    route: '/app/ai/coo',
    permission: 'ai.coo.view',
    accentColor: '#10B981', // Emerald
    description: 'Optimizes supply logistics, eliminates operational bottlenecks, and tracks plant production yield continuously.',
    keyResponsibilities: [
      'Warehouse & Fulfillment Logistics',
      'Process Bottleneck Elimination',
      'Operational Cost Optimization',
      'Quality & SLA Management',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:15 AM',
        finding: 'Western Distribution Hub reduced loading turn-around time by 18 minutes.',
        impact: 'Saves ₹42K in monthly demurrage fees.',
      },
    ],
    domainMetrics: [
      { label: 'Fulfillment On-Time Rate', value: '96.8%', change: '+1.2%', status: 'positive' },
      { label: 'Warehouse Turn Time', value: '1.4 Days', change: '-0.3 Days', status: 'positive' },
      { label: 'Cost Per Order Fulfilled', value: '₹142', change: '-4.1%', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Automate Route Dispatch for Regional Delivery Fleets',
        impact: 'Saves ₹74K monthly in transport overhead',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-cmo',
    code: 'CMO',
    name: 'AI CMO',
    role: 'Chief Marketing Officer',
    department: 'Brand, Customer Acquisition & Campaigns',
    iconName: 'TrendingUp',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'Customer Acquisition Cost',
    primaryMetricValue: '₹3,420',
    primaryMetricChange: '-8.4%',
    insight: 'Digital distributor campaigns yielded 240+ qualified dealer leads this month.',
    route: '/app/ai/cmo',
    permission: 'ai.cmo.view',
    accentColor: '#EC4899', // Pink
    description: 'Tracks customer acquisition channels, campaign performance ROI, dealer enablement, and brand health metrics.',
    keyResponsibilities: [
      'Customer Acquisition Strategy',
      'Campaign ROI Optimization',
      'Dealer Enablement & Brand Presence',
      'Market Positioning',
    ],
    recentDiagnostic: [
      {
        timestamp: '09:40 AM',
        finding: 'B2B dealer portal referral program generated 42 new verified accounts.',
        impact: 'CAC reduced by ₹310 per account.',
      },
    ],
    domainMetrics: [
      { label: 'Monthly Qualified Leads', value: '384', change: '+18.2%', status: 'positive' },
      { label: 'Marketing ROI', value: '4.8x', change: '+0.4x', status: 'positive' },
      { label: 'Lead Conversion Rate', value: '14.2%', change: '+1.1%', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Launch Incentive Program for High-Volume Distributors',
        impact: 'Boosts dealer order frequency by 16%',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-cto',
    code: 'CTO',
    name: 'AI CTO',
    role: 'Chief Technology Officer',
    department: 'Infrastructure, Data Architecture & Automation',
    iconName: 'Bot',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'System Uptime',
    primaryMetricValue: '99.99%',
    primaryMetricChange: 'Optimal',
    insight: 'All ledger sync APIs operating under 45ms latency with zero data pipeline lag.',
    route: '/app/ai/cto',
    permission: 'ai.cto.view',
    accentColor: '#8B5CF6', // Purple
    description: 'Guarantees core telemetry stability, manages cloud infrastructure, and automates operational workflows across departments.',
    keyResponsibilities: [
      'System Architecture & API Health',
      'Data Security & Multi-Tenant Isolation',
      'Automated Workflow Pipelines',
      'AI Engine Latency Control',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:00 AM',
        finding: 'Database query latency averaged 32ms during peak batch ledger execution.',
        impact: 'Zero user UI stutter detected.',
      },
    ],
    domainMetrics: [
      { label: 'API Response Time', value: '38ms', change: '-4ms', status: 'positive' },
      { label: 'Pipeline Reliability', value: '100%', change: 'Stable', status: 'positive' },
      { label: 'Security Vulnerabilities', value: '0', change: 'Clean', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Deploy Real-Time Webhook Engine for Automated GST Filing',
        impact: 'Reduces manual accountant review time by 40%',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-hr',
    code: 'HR',
    name: 'AI HR',
    role: 'Chief Human Resources Officer',
    department: 'Workforce, Attendance & Productivity',
    iconName: 'UsersRound',
    status: 'Attention',
    statusText: 'Attention',
    primaryMetricLabel: 'Workforce Productivity',
    primaryMetricValue: '88.4%',
    primaryMetricChange: '-1.2%',
    insight: 'Shift coverage at Northern Logistics Hub experienced 4.2% overtime drift.',
    route: '/app/ai/hr',
    permission: 'ai.hr.view',
    accentColor: '#F97316', // Orange
    description: 'Monitors staff allocation, productivity indices, sales compensation plans, and attendance telemetry.',
    keyResponsibilities: [
      'Workforce Planning & Utilization',
      'Sales Team Incentive Tracking',
      'Attendance & Shift Telemetry',
      'Talent Retention',
    ],
    recentDiagnostic: [
      {
        timestamp: '08:50 AM',
        finding: 'Overtime hours at warehouse hub increased by 14 hours this week.',
        impact: 'Payroll cost overrun of ₹18K.',
      },
    ],
    domainMetrics: [
      { label: 'Employee Engagement', value: '82.5%', change: '+0.5%', status: 'positive' },
      { label: 'Sales Rep Quota Attainment', value: '76.4%', change: '-2.1%', status: 'negative' },
      { label: 'Retention Rate', value: '94.1%', change: 'Stable', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Reallocate 2 Shift Operators from Western Hub',
        impact: 'Eliminates Northern Hub overtime costs',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-legal',
    code: 'Legal',
    name: 'AI Legal',
    role: 'General Counsel & Chief Legal Officer',
    department: 'Contracts, Compliance & Risk Audit',
    iconName: 'Shield',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'Contract Compliance',
    primaryMetricValue: '100%',
    primaryMetricChange: 'Compliant',
    insight: 'All vendor agreements & GST filings are audit-verified with zero non-conformances.',
    route: '/app/ai/legal',
    permission: 'ai.legal.view',
    accentColor: '#0EA5E9', // Sky
    description: 'Reviews commercial contracts, monitors regulatory changes, enforces vendor compliance, and protects company IP.',
    keyResponsibilities: [
      'Contract Lifecycle & Risk Review',
      'Regulatory & Tax Compliance',
      'Vendor Liability Safeguards',
      'Corporate Governance',
    ],
    recentDiagnostic: [
      {
        timestamp: '07:30 AM',
        finding: '3 major supplier contracts up for renewal within 45 days.',
        impact: 'Opportunity to insert updated SLA penalty clauses.',
      },
    ],
    domainMetrics: [
      { label: 'Active Commercial Contracts', value: '42', change: '+4', status: 'positive' },
      { label: 'Compliance Audit Score', value: '98/100', change: 'Top Tier', status: 'positive' },
      { label: 'Pending Legal Disputes', value: '0', change: 'Clean', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Insert Inflation-Linked Material Indexing Clauses in Supplier Renewal Agreements',
        impact: 'Protects gross margins against commodity spikes',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-supply-chain',
    code: 'Supply',
    name: 'AI Supply Chain',
    role: 'Chief Supply Chain Officer',
    department: 'Procurement, Inventory & Supplier Relations',
    iconName: 'Truck',
    status: 'Risk',
    statusText: 'Risk',
    primaryMetricLabel: 'Supplier Price Variance',
    primaryMetricValue: '+12.4%',
    primaryMetricChange: 'Cost Risk',
    insight: 'Two core steel suppliers account for 68% of recent raw material price spikes.',
    route: '/app/ai/supply-chain',
    permission: 'ai.supply.view',
    accentColor: '#EF4444', // Red
    description: 'Analyzes vendor pricing dynamics, predicts stockout vulnerabilities, manages procurement cycles, and flags inventory risks.',
    keyResponsibilities: [
      'Raw Material Procurement',
      'Supplier Risk Management',
      'Slow-Moving Inventory Identification',
      'Stockout Risk Mitigation',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:38 AM',
        finding: 'Identified ₹3.2L in slow-moving structural steel inventory (>90 days idle).',
        impact: 'Ties up working capital; target for bulk dealer promotion.',
      },
      {
        timestamp: '09:05 AM',
        finding: 'Supplier Jindal Steel increased quote by 14% on GI Pipes.',
        impact: 'Primary cause of overall company gross margin erosion.',
      },
    ],
    domainMetrics: [
      { label: 'Stockout Risk Level', value: 'Low', change: 'Controlled', status: 'positive' },
      { label: 'Slow-Moving Stock Value', value: '₹3.2L', change: '+₹45K', status: 'negative' },
      { label: 'Supplier On-Time Delivery', value: '91.2%', change: '-2.4%', status: 'negative' },
    ],
    strategicOptions: [
      {
        title: 'Renegotiate Tier-1 Pricing with Alternative Suppliers',
        impact: 'Potential annual cost reduction of ₹1.4Cr',
        riskLevel: 'Medium',
        recommended: true,
      },
      {
        title: 'Launch Liquidation Discount on 90+ Day Slow Inventory',
        impact: 'Frees ₹3.2L cash back into treasury',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-sales',
    code: 'Sales',
    name: 'AI Chief Sales Officer',
    role: 'Chief Revenue & Sales Officer',
    department: 'Sales Pipeline, Key Accounts & Retention',
    iconName: 'ShoppingCart',
    status: 'Healthy',
    statusText: 'Healthy',
    primaryMetricLabel: 'Sales Pipeline Value',
    primaryMetricValue: '₹68.4L',
    primaryMetricChange: '+14.8%',
    insight: '18 high-value distributor accounts show declining order frequency over 45 days.',
    route: '/app/ai/sales',
    permission: 'ai.sales.view',
    accentColor: '#06B6D4', // Cyan
    description: 'Tracks customer order trends, identifies churn risks in major accounts, optimizes conversion pipelines, and prompts upsell actions.',
    keyResponsibilities: [
      'Sales Pipeline Management',
      'Key Account Health Telemetry',
      'Declining Account Intervention',
      'Customer Retention Acceleration',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:31 AM',
        finding: '18 high-value distributor accounts reduced repeat purchasing frequency by 22%.',
        impact: 'Exposes ₹3.2L in monthly recurring revenue to competitor poaching.',
      },
    ],
    domainMetrics: [
      { label: 'Active Pipeline Deals', value: '84 Deals', change: '+12', status: 'positive' },
      { label: 'Win Rate', value: '38.4%', change: '+2.1%', status: 'positive' },
      { label: 'Average Order Value', value: '₹1.85L', change: '+6.4%', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Deploy Priority Outreach to Top 6 Declining Accounts',
        impact: 'Protects ₹2.1L in monthly recurring revenue',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
  {
    id: 'ai-bi',
    code: 'BI',
    name: 'AI Business Intelligence',
    role: 'Chief Analytics & Intelligence Officer',
    department: 'Cross-Department Analytics & Anomaly Detection',
    iconName: 'BarChart3',
    status: 'Working',
    statusText: 'Working',
    primaryMetricLabel: 'Data Models Synced',
    primaryMetricValue: '100%',
    primaryMetricChange: 'Active',
    insight: 'Correlated raw material price spikes with distributor ordering cycles for predictive margin forecasting.',
    route: '/app/ai/bi',
    permission: 'ai.bi.view',
    accentColor: '#6366F1', // Indigo
    description: 'Synthesizes telemetry across Sales, Finance, Inventory, Operations, and Customers to discover hidden correlations and trend signals.',
    keyResponsibilities: [
      'Cross-Department Anomaly Detection',
      'Predictive Business Forecasting',
      'Trend & Pattern Recognition',
      'Executive Collaboration Synthesis',
    ],
    recentDiagnostic: [
      {
        timestamp: '10:50 AM',
        finding: 'Discovered high statistical correlation (r=0.88) between freight delays and distributor churn.',
        impact: 'Reveals logistics root cause behind customer account declines.',
      },
    ],
    domainMetrics: [
      { label: 'Anomaly Detection Accuracy', value: '99.4%', change: 'Optimal', status: 'positive' },
      { label: 'Cross-Domain Insights Generated', value: '142', change: '+18 this week', status: 'positive' },
      { label: 'Forecast Variance', value: '<1.8%', change: 'Precise', status: 'positive' },
    ],
    strategicOptions: [
      {
        title: 'Publish Automated Weekly Executive Risk Briefing',
        impact: 'Speeds up executive decision cycle by 3 days',
        riskLevel: 'Low',
        recommended: true,
      },
    ],
  },
];
