export const SYSTEM_MODULES = [
  { id: 'command-center', title: 'Business Command Center', category: 'Modules', shortcut: 'G C', description: 'Real-time executive KPI monitoring dashboard' },
  { id: 'finance', title: 'Finance Intelligence', category: 'Modules', shortcut: 'G F', description: 'Automated GST, Cash Flow & Financial Statements' },
  { id: 'profit', title: 'Profit Intelligence', category: 'Modules', shortcut: 'G P', description: 'Margin leakage detection & EBITDA optimizer' },
  { id: 'sales', title: 'Sales Intelligence', category: 'Modules', shortcut: 'G S', description: 'Pipeline forecasting, revenue streams & quotes' },
  { id: 'inventory', title: 'Inventory Intelligence', category: 'Modules', shortcut: 'G I', description: 'Stock monitoring, ABC analysis & safety buffers' },
  { id: 'customer', title: 'Customer Intelligence', category: 'Modules', shortcut: 'G U', description: 'Credit scoring, payment behavior & CRM' },
  { id: 'supplier', title: 'Supplier Intelligence', category: 'Modules', shortcut: 'G V', description: 'Vendor scorecards & purchase order management' },
  { id: 'analytics', title: 'Analytics', category: 'Modules', shortcut: 'G A', description: 'Cross-functional operational metrics' },
  { id: 'reports', title: 'Reports', category: 'Modules', shortcut: 'G R', description: 'Automated exportable P&L, Balance Sheet, GST files' },
  { id: 'ai-advisor', title: 'AI Business Advisor', category: 'AI Tools', shortcut: 'G AI', description: 'Autonomous MSME strategic virtual advisor' },
  { id: 'ai-board', title: 'AI Board Meeting', category: 'AI Tools', shortcut: 'G B', description: 'Simulated C-suite strategy session' },
  { id: 'action-center', title: 'Action Center', category: 'Workflow', shortcut: 'G X', badge: '3 Pending', description: 'Pending approvals & urgent task matrix' },
  { id: 'settings', title: 'Settings', category: 'System', shortcut: 'G S', description: 'Workspace configuration, roles & integrations' },
  { id: 'profile', title: 'Profile & Team', category: 'System', shortcut: 'G P', description: 'User account & subscription management' },
  { id: 'help', title: 'Help & Support', category: 'System', shortcut: 'G H', description: 'Knowledge base, API docs & live support' }
];

export const MOCK_CUSTOMERS = [
  { id: 'cust-101', title: 'Apex Industrial Solutions', category: 'Customers', subtitle: 'GSTIN: 27AAAAA0000A1Z5 | Outstanding: ₹4,85,000', status: 'Healthy' },
  { id: 'cust-102', title: 'Bharat Heavy Engineering', category: 'Customers', subtitle: 'GSTIN: 27BBBBB2222B1Z4 | Outstanding: ₹12,40,000', status: 'Credit Review' },
  { id: 'cust-103', title: 'Metro Infrastructure Ltd', category: 'Customers', subtitle: 'GSTIN: 27CCCCC3333C1Z3 | Outstanding: ₹0 (Paid)', status: 'VIP' }
];

export const MOCK_PRODUCTS = [
  { id: 'prod-501', title: 'Cold-Rolled Steel Coils (CR-4042)', category: 'Products', subtitle: 'Stock: 4.2 Tons | Reorder Point: 5.0 Tons', status: 'Low Stock' },
  { id: 'prod-502', title: 'Industrial Hydraulic Valve H-99', category: 'Products', subtitle: 'Stock: 142 Units | Unit Price: ₹8,500', status: 'In Stock' },
  { id: 'prod-503', title: 'Precision Brass Fasteners (M8)', category: 'Products', subtitle: 'Stock: 12,000 Units | Unit Price: ₹14.50', status: 'In Stock' }
];

export const MOCK_INVOICES = [
  { id: 'inv-889', title: 'Invoice #INV-2026-889', category: 'Invoices', subtitle: 'Customer: Metro Infra | Amount: ₹14,50,000', status: 'Paid' },
  { id: 'inv-890', title: 'Invoice #INV-2026-890', category: 'Invoices', subtitle: 'Customer: Apex Industrial | Amount: ₹4,85,000', status: 'Overdue (4 Days)' }
];

export const MOCK_SUPPLIERS = [
  { id: 'sup-301', title: 'JSW Steel Processing Yard', category: 'Suppliers', subtitle: 'Category: Raw Materials | Rating: 98/100', status: 'Primary Vendor' },
  { id: 'sup-302', title: 'Gujarat Brass Foundries', category: 'Suppliers', subtitle: 'Category: Metal Components | Rating: 91/100', status: 'Active' }
];

export const QUICK_ACTIONS = [
  { id: 'act-invoice', title: 'Create New Invoice', category: 'Actions', iconName: 'FilePlus', shortcut: 'Alt + N' },
  { id: 'act-po', title: 'Create Purchase Order', category: 'Actions', iconName: 'ShoppingBag', shortcut: 'Alt + P' },
  { id: 'act-ai-audit', title: 'Run AI Financial Health Audit', category: 'Actions', iconName: 'Sparkles', shortcut: 'Alt + A' },
  { id: 'act-[#export]', title: 'Export Monthly Tax Summary', category: 'Actions', iconName: 'Download', shortcut: 'Alt + E' }
];
