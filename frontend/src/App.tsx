import React, { useState } from 'react';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { ReactBitsBackground } from '@/components/ui/ReactBitsBackground';
import { ShinyText } from '@/components/ui/ShinyText';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlowButton } from '@/components/ui/GlowButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusChip } from '@/components/ui/StatusChip';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DebouncedSearch } from '@/components/ui/DebouncedSearch';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { SidebarNavItem } from '@/components/ui/SidebarNavItem';
import { AIWidgetShell, type AIWidgetState } from '@/components/ui/AIWidgetShell';
import { LineChartWrapper, BarChartWrapper, AreaChartWrapper } from '@/components/ui/Charts';
import {
  Sparkles,
  Command,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  TrendingUp,
  Package,
  DollarSign,
  Shield
} from 'lucide-react';

function DesignSystemGallery() {
  const { addToast } = useToast();

  // State controls for interactive preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [aiState, setAiState] = useState<AIWidgetState>('answered');
  const [tableState, setTableState] = useState<'data' | 'loading' | 'empty' | 'error'>('data');

  // Sample Data Table Rows
  const sampleProducts = [
    { id: '1', code: 'GI-PIPE-50MM', brand: 'APL Apollo', category: 'GI', size: '50mm (2")', closingQty: 140, reorderLevel: 200, reorderFlag: true, status: 'paid' },
    { id: '2', code: 'MS-PIPE-80MM', brand: 'Jindal Star', category: 'MS', size: '80mm (3")', closingQty: 480, reorderLevel: 150, reorderFlag: false, status: 'pending' },
    { id: '3', code: 'GP-SHEET-1.2', brand: 'Tata Structura', category: 'GP', size: '1.2mm x 1220mm', closingQty: 620, reorderLevel: 100, reorderFlag: false, status: 'paid' },
    { id: '4', code: 'GI-PIPE-25MM', brand: 'APL Apollo', category: 'GI', size: '25mm (1")', closingQty: 85, reorderLevel: 120, reorderFlag: true, status: 'overdue' },
  ];

  const tableColumns = [
    { key: 'code', header: 'Product Code', sortable: true, render: (row: any) => <span className="font-mono font-semibold text-primary">{row.code}</span> },
    { key: 'brand', header: 'Brand', sortable: true },
    { key: 'category', header: 'Category', sortable: true, render: (row: any) => <Badge variant="info">{row.category}</Badge> },
    { key: 'size', header: 'Size Spec' },
    { key: 'closingQty', header: 'Current Stock', sortable: true, align: 'right' as const, render: (row: any) => <span className="font-mono">{row.closingQty} pcs</span> },
    { key: 'reorderFlag', header: 'Stock Status', render: (row: any) => <StatusChip type="reorder_flag" value={row.reorderFlag} /> },
    { key: 'status', header: 'Payment', render: (row: any) => <StatusChip type="payment_status" value={row.status} /> },
  ];

  // Sample Chart Data
  const sampleChartData = [
    { date: 'Apr 2024', Sales: 2340000, Purchases: 2720000, Index: 142.5 },
    { date: 'May 2024', Sales: 2380000, Purchases: 1380000, Index: 145.2 },
    { date: 'Jun 2024', Sales: 2180000, Purchases: 1520000, Index: 148.0 },
    { date: 'Jul 2024', Sales: 2250000, Purchases: 1440000, Index: 151.3 },
    { date: 'Aug 2024', Sales: 2500000, Purchases: 1490000, Index: 153.8 },
    { date: 'Sep 2024', Sales: 2370000, Purchases: 1200000, Index: 156.1 },
  ];

  return (
    <ReactBitsBackground>
      <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-borderToken pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-glow">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                  <ShinyText text="BizPilot AI Design System" />
                  <Badge variant="ai">React Bits Aurora & Particles</Badge>
                </h1>
                <p className="text-sm text-text-secondary">
                  Live Canvas Animations & Fixed UI Component Library Showcase
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCmdOpen(true)}
              leftIcon={<Command className="w-4 h-4 text-primary" />}
            >
              Cmd + K Palette
            </Button>
            <GlowButton onClick={() => addToast('React Bits Engine Running', 'Live canvas particle starfield and aurora waves active.', 'success')}>
              Interactive Glow Action
            </GlowButton>
          </div>
        </header>

        {/* SECTION 1: FIXED SPOTLIGHT KPI CARDS WITH LIVE ANIMATED COUNTERS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              1. Executive KPI Cards (React Bits Cursor Spotlight)
            </h2>
            <span className="text-xs text-text-muted">Hover cursor to see dynamic spotlight lighting!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard spotlightColor="rgba(124, 58, 237, 0.25)">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary uppercase">Active Products</span>
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold text-text-primary font-mono">
                <AnimatedCounter value={140} suffix=" SKUs" />
              </div>
              <p className="text-xs text-status-success mt-2 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +12 new products added
              </p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(192, 132, 252, 0.25)">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary uppercase">30-Day Sales Volume</span>
                <TrendingUp className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-3xl font-extrabold text-text-primary font-mono">
                <AnimatedCounter value={18450230} prefix="₹" />
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Across 248 sales invoices
              </p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.25)">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-secondary uppercase">Cash Position (Admin)</span>
                <DollarSign className="w-4 h-4 text-status-success" />
              </div>
              <div className="text-3xl font-extrabold text-status-success font-mono">
                <AnimatedCounter value={4520190} prefix="₹" />
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Net ledger closing balance
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* SECTION 2: DESIGN TOKENS & COLOR PALETTE */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            2. Design Tokens & Color Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-background border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-[#09090B] border border-white/10" />
              <span className="text-xs font-mono block font-semibold">Background</span>
              <span className="text-[10px] font-mono text-text-muted">#09090B</span>
            </div>
            <div className="bg-surface border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-[#111113] border border-white/10" />
              <span className="text-xs font-mono block font-semibold">Surface</span>
              <span className="text-[10px] font-mono text-text-muted">#111113</span>
            </div>
            <div className="bg-surface-elevated border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-[#18181B] border border-white/10" />
              <span className="text-xs font-mono block font-semibold">Elevated Surface</span>
              <span className="text-[10px] font-mono text-text-muted">#18181B</span>
            </div>
            <div className="bg-surface border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-primary" />
              <span className="text-xs font-mono block font-semibold">Primary Accent</span>
              <span className="text-[10px] font-mono text-text-muted">#7C3AED</span>
            </div>
            <div className="bg-surface border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-secondary" />
              <span className="text-xs font-mono block font-semibold">Secondary Accent</span>
              <span className="text-[10px] font-mono text-text-muted">#A855F7</span>
            </div>
            <div className="bg-surface border border-borderToken rounded-xl p-3 space-y-1">
              <div className="h-10 rounded bg-ai" />
              <span className="text-xs font-mono block font-semibold">AI Accent</span>
              <span className="text-[10px] font-mono text-text-muted">#C084FC</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: BUTTONS & BADGES */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-text-primary">
            3. Buttons & Badges
          </h2>
          <SpotlightCard className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Button Variants & States</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ai" leftIcon={<Sparkles className="w-4 h-4" />}>AI Assistant</Button>
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Badges & Status Chips</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="ai" icon={<Sparkles className="w-3 h-3" />}>AI Prediction Gated</Badge>
                <StatusChip type="reorder_flag" value={true} />
                <StatusChip type="reorder_flag" value={false} />
                <StatusChip type="payment_status" value="Paid" />
                <StatusChip type="payment_status" value="Pending" />
                <StatusChip type="payment_status" value="Overdue" />
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* SECTION 4: FORM CONTROLS */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-text-primary">
            4. Form Controls
          </h2>
          <SpotlightCard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input label="Product Code Input" placeholder="e.g. GI-PIPE-50MM" />
            <Select
              label="Category Select"
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'GI', label: 'Galvanized Iron (GI)' },
                { value: 'MS', label: 'Mild Steel (MS)' },
                { value: 'GP', label: 'Galvanized Pipe (GP)' },
              ]}
            />
            <DebouncedSearch onSearch={(val) => console.log('Search:', val)} />
            <DateRangePicker />
          </SpotlightCard>
        </section>

        {/* SECTION 5: AI WIDGET SHELL (3 REQUIRED STATES) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                5. AI Widget Shell ("Ask BizPilot AI")
                <Badge variant="ai">3 Required States</Badge>
              </h2>
              <p className="text-xs text-text-secondary">
                Includes answered, loading typing animation, and 503 HTTP unavailable state for Milestone 4 model gating.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-lg border border-borderToken">
              <Button
                variant={aiState === 'answered' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAiState('answered')}
                className="h-7 text-xs"
              >
                Answered
              </Button>
              <Button
                variant={aiState === 'loading' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAiState('loading')}
                className="h-7 text-xs"
              >
                Loading
              </Button>
              <Button
                variant={aiState === 'unavailable' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAiState('unavailable')}
                className="h-7 text-xs"
              >
                Unavailable (503)
              </Button>
            </div>
          </div>

          <div className="max-w-2xl">
            <AIWidgetShell
              state={aiState}
              onRetry={() => addToast('Model Registry Check', 'Checking for trained model artifacts in models/ directory...', 'info')}
            />
          </div>
        </section>

        {/* SECTION 6: DATA TABLE WITH PAGINATION & STATES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">
              6. Data Table (Sortable, Max Page Size 100, Skeletons, Empty & Error States)
            </h2>
            <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-lg border border-borderToken">
              <Button variant={tableState === 'data' ? 'primary' : 'ghost'} size="sm" onClick={() => setTableState('data')} className="h-7 text-xs">Data</Button>
              <Button variant={tableState === 'loading' ? 'primary' : 'ghost'} size="sm" onClick={() => setTableState('loading')} className="h-7 text-xs">Loading</Button>
              <Button variant={tableState === 'empty' ? 'primary' : 'ghost'} size="sm" onClick={() => setTableState('empty')} className="h-7 text-xs">Empty</Button>
              <Button variant={tableState === 'error' ? 'primary' : 'ghost'} size="sm" onClick={() => setTableState('error')} className="h-7 text-xs">Error</Button>
            </div>
          </div>

          <DataTable
            columns={tableColumns}
            data={tableState === 'data' ? sampleProducts : []}
            totalItems={tableState === 'data' ? 140 : 0}
            page={1}
            pageSize={20}
            isLoading={tableState === 'loading'}
            isError={tableState === 'error'}
            errorMessage="Failed to connect to FastAPI endpoint GET /api/products"
            onRetry={() => setTableState('data')}
          />
        </section>

        {/* SECTION 7: CHARTS */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-text-primary">
            7. Recharts Wrappers with Token Palettes & Entrance Animation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChartWrapper
              title="Sales vs Purchases Trajectory (Last 6 Months)"
              data={sampleChartData}
              xAxisKey="date"
              dataKeys={[
                { key: 'Sales', name: 'Sales (₹)', color: '#22C55E' },
                { key: 'Purchases', name: 'Purchases (₹)', color: '#7C3AED' }
              ]}
            />
            <LineChartWrapper
              title="Steel Index Trend Benchmark"
              data={sampleChartData}
              xAxisKey="date"
              dataKeys={[
                { key: 'Index', name: 'Steel Price Index', color: '#C084FC' }
              ]}
            />
          </div>
        </section>

        {/* SECTION 8: SIDEBAR NAV & TOAST INTERACTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">
              8. Sidebar Navigation Component
            </h2>
            <SpotlightCard className="space-y-1 p-3">
              <SidebarNavItem label="Executive Dashboard" icon={<LayoutDashboard className="w-4 h-4" />} isActive />
              <SidebarNavItem label="Product Catalog" icon={<Layers className="w-4 h-4" />} badge="140" />
              <SidebarNavItem label="Purchase Register" icon={<ShoppingBag className="w-4 h-4" />} />
              <SidebarNavItem label="Cashbook Register" icon={<Shield className="w-4 h-4" />} isRoleGated requiredRole="Admin Only" />
            </SpotlightCard>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">
              9. Dialog Modal & Toast Notifications
            </h2>
            <SpotlightCard className="space-y-4 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Button>
                <Button variant="outline" size="sm" onClick={() => addToast('Success Event', 'Operation completed successfully.', 'success')}>Success Toast</Button>
                <Button variant="outline" size="sm" onClick={() => addToast('Warning Event', 'Product stock below reorder level.', 'warning')}>Warning Toast</Button>
                <Button variant="outline" size="sm" onClick={() => addToast('HTTP 503 Error', 'AI Model is not yet available.', 'error')}>Error Toast</Button>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Reorder Threshold Change"
          description="Update automated minimum stock reorder parameters for GI Pipes 50mm."
        >
          <div className="space-y-4 pt-2">
            <Input label="New Reorder Level (Pcs)" defaultValue="250" />
            <div className="flex justify-end gap-2 pt-4 border-t border-borderToken">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { setIsModalOpen(false); addToast('Reorder Updated', 'Reorder level set to 250 pcs.', 'success'); }}>Save Parameters</Button>
            </div>
          </div>
        </Modal>

        {/* Command Palette Instance */}
        <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
      </div>
    </ReactBitsBackground>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DesignSystemGallery />
    </ToastProvider>
  );
}
