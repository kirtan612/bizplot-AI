import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ShoppingCart,
  Users,
  Wallet,
  FileText,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Circle,
  ArrowUpRight,
  Bot,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RevenueProfitChart } from '../../components/charts/RevenueProfitChart';
import { CashFlowChart } from '../../components/charts/CashFlowChart';
import { SalesPerformanceChart } from '../../components/charts/SalesPerformanceChart';
import { CustomerRetentionChart } from '../../components/charts/CustomerRetentionChart';
import { RecentOrdersTable } from '../../components/dashboard/RecentOrdersTable';
import { LowStockAlertsPanel } from '../../components/dashboard/LowStockAlertsPanel';
import { ExecutiveRoomPreview } from '../../components/dashboard/ExecutiveRoomPreview';
import { PriorityActionPanel } from '../../components/dashboard/PriorityActionPanel';
import { InsightPanel } from '../../components/dashboard/InsightPanel';
import { AlertCenter } from '../../components/dashboard/AlertCenter';
import { IntelligenceTimeline } from '../../components/dashboard/IntelligenceTimeline';
import { PermissionGate } from '../../components/layout/PermissionGate';

/* Bento Mock Data */
const statPills = [
  { label: 'Revenue', value: '+12.4%' },
  { label: 'Gross profit', value: '+8.7%' },
  { label: 'Cash position', value: '-3.2%' },
  { label: 'Receivables', value: '-1.1%' },
];

const bigStats = [
  { icon: Users, value: '342', label: 'Customers' },
  { icon: ShoppingCart, value: '1.2k', label: 'Orders' },
  { icon: Brain, value: '10', label: 'AI Execs' },
];

const monthlyBars = [
  { m: 'F', v: 46 },
  { m: 'M', v: 55 },
  { m: 'A', v: 61 },
  { m: 'M', v: 58 },
  { m: 'J', v: 70 },
  { m: 'J', v: 100 },
];

const executives = [
  { role: 'AI CFO', insight: 'Gross margin declined on higher material costs.' },
  { role: 'AI Supply Chain', insight: 'Two suppliers drove most of the cost rise.' },
  { role: 'AI Sales', insight: 'Three key accounts ordering less often.' },
  { role: 'AI HR', insight: 'Attendance dipped 4% across the ops team.' },
];

const meetings = [
  { day: 'Mon 22', time: '9:00 am', title: 'Weekly Executive Sync', note: 'CEO · CFO · COO', who: 'CE' },
  { day: 'Wed 24', time: '11:00 am', title: 'Margin Review Session', note: 'CFO · Supply Chain', who: 'CF' },
  { day: 'Fri 26', time: '2:00 pm', title: 'Retention Deep Dive', note: 'CMO · Sales', who: 'SA' },
];

const priorityActions = [
  { icon: Wallet, title: 'Recover overdue receivables', meta: '₹2.4L overdue', done: true },
  { icon: Users, title: 'Contact declining customers', meta: '18 accounts', done: true },
  { icon: Package, title: 'Renegotiate supplier pricing', meta: '3 suppliers', done: false },
  { icon: FileText, title: 'Reduce operational costs', meta: 'Save ~₹74K', done: false },
];

/* BentoCard with smooth lift and shadow hover */
function BentoCard({ children, style, dark = false, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; dark?: boolean; className?: string }) {
  const { tokens: t } = useTheme();
  return (
    <div
      style={{
        background: dark ? t.dark : t.card,
        color: dark ? t.darkText : t.text,
        borderRadius: 28,
        border: dark ? 'none' : `1px solid ${t.border}`,
        padding: 22,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        ...style,
      }}
      className={`hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, ariaLabel, filled }: { children: React.ReactNode; onClick?: () => void; ariaLabel: string; filled?: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: `1px solid ${t.border}`,
        background: filled ? t.dark : t.card,
        color: filled ? t.darkText : t.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'transform 0.15s ease, background 0.15s ease',
      }}
      className="hover:scale-110 hover:border-purple-300 dark:hover:border-purple-700"
    >
      {children}
    </button>
  );
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  const [openExecAccordion, setOpenExecAccordion] = useState(0);

  const doneCount = priorityActions.filter((a) => a.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Header: Greeting + Stat Pills + Big Numbers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ margin: '0 0 20px', fontSize: 36, fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: -1, color: t.text }}>
            Good morning, {user?.name.split(' ')[0] || 'Rhea'}
          </h1>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {statPills.map((s) => (
              <div key={s.label} className="group cursor-pointer">
                <div style={{ fontSize: 12, color: t.textSub, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    border: `1px solid ${t.border}`,
                    background: t.card,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'Manrope', sans-serif",
                    color: s.value.startsWith('-') ? t.warn : t.ok,
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  className="group-hover:scale-105 group-hover:shadow-xs"
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
          {bigStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="group cursor-pointer">
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: t.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.15s ease',
                  }}
                  className="group-hover:scale-110"
                >
                  <Icon size={15} color={t.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Manrope', sans-serif", lineHeight: 1, color: t.text }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bento 4x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hero AI CFO */}
        <BentoCard
          style={{
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            background: `linear-gradient(160deg, ${t.heroFrom}, ${t.heroTo})`,
            border: 'none',
            minHeight: 280,
          }}
          className="cursor-pointer"
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={19} color={t.accent} />
            </div>
          </div>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0 14px' }}>
            <Brain size={30} color="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Manrope', sans-serif", color: t.text }}>AI CFO</div>
              <div style={{ fontSize: 12.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>Financial intelligence</div>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: 999, background: t.card, fontSize: 13, fontWeight: 700, fontFamily: "'Manrope', sans-serif", color: t.text }}>
              ₹6.4L
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Progress Card */}
        <BentoCard style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Revenue</div>
            <IconBtn ariaLabel="Open" onClick={() => navigate('/app/finance')}>
              <ArrowUpRight size={14} color={t.textSub} />
            </IconBtn>
          </div>
          <div style={{ margin: '16px 0 4px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>₹24.8L</span>
          </div>
          <div style={{ fontSize: 12, color: t.textSub, marginBottom: 22, fontFamily: "'Inter', sans-serif" }}>vs previous month</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flex: 1 }}>
            {monthlyBars.map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }} className="group cursor-pointer">
                <div
                  style={{
                    width: 8,
                    borderRadius: 4,
                    height: `${(b.v / 100) * 80}px`,
                    background: i === monthlyBars.length - 1 ? t.accent : t.track,
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  className="group-hover:scale-y-110"
                />
                <span style={{ fontSize: 10.5, color: t.textFaint, fontFamily: "'Inter', sans-serif" }}>{b.m}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Card 3: Target Ring */}
        <BentoCard style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Target reached</div>
            <IconBtn ariaLabel="Open" onClick={() => navigate('/app/reports')}>
              <ArrowUpRight size={14} color={t.textSub} />
            </IconBtn>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke={t.track} strokeWidth="10" />
              <circle
                cx="65"
                cy="65"
                r="54"
                fill="none"
                stroke={t.accent}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - 0.82)}
                transform="rotate(-90 65 65)"
              />
              <text x="65" y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill={t.text} fontFamily="Manrope">
                82%
              </text>
              <text x="65" y="78" textAnchor="middle" fontSize="10.5" fill={t.textSub} fontFamily="Inter">
                of monthly target
              </text>
            </svg>
          </div>
        </BentoCard>

        {/* Card 4: Health Card */}
        <BentoCard style={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Executive health</div>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Manrope', sans-serif" }}>60%</span>
          </div>
          <div style={{ display: 'flex', gap: 16, margin: '18px 0 12px', fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>
            <span>Healthy 60%</span>
            <span>Attention 30%</span>
            <span>Risk 10%</span>
          </div>
          <div style={{ display: 'flex', gap: 4, height: 38 }}>
            <div style={{ flex: 60, background: t.accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} className="hover:scale-102">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Healthy</span>
            </div>
            <div style={{ flex: 30, background: t.dark, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease' }} className="hover:scale-102">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Attention</span>
            </div>
            <div style={{ flex: 10, background: t.track, borderRadius: 10 }} />
          </div>
          <div style={{ marginTop: 'auto', fontSize: 12, color: t.textSub, fontFamily: "'Inter', sans-serif", paddingTop: 14 }}>
            6 of 10 executives reporting healthy status.
          </div>
        </BentoCard>

        {/* Card 5: Exec Accordion */}
        <BentoCard style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif", marginBottom: 8 }}>AI Insights</div>
          {executives.map((e, i) => (
            <div key={e.role} style={{ borderBottom: i < executives.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div
                onClick={() => setOpenExecAccordion(openExecAccordion === i ? -1 : i)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 2px', cursor: 'pointer', transition: 'color 0.15s ease' }}
                className="hover:text-purple-600 dark:hover:text-purple-400"
              >
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{e.role}</span>
                <ChevronDown size={14} color={t.textSub} style={{ transform: openExecAccordion === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
              {openExecAccordion === i && (
                <p style={{ margin: '0 2px 12px', fontSize: 12, color: t.textSub, lineHeight: 1.45, fontFamily: "'Inter', sans-serif" }}>
                  {e.insight}
                </p>
              )}
            </div>
          ))}
        </BentoCard>

        {/* Card 6: Meetings Card */}
        <BentoCard className="lg:col-span-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Executive Room — this week</div>
            <span
              onClick={() => navigate('/app/executive-room')}
              style={{ fontSize: 12.5, color: t.accent, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 2, transition: 'transform 0.15s ease' }}
              className="hover:translate-x-1"
            >
              View all <ChevronRight size={13} />
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meetings.map((m) => (
              <div
                key={m.title}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 16, background: t.accentSoft, transition: 'transform 0.15s ease' }}
                className="hover:translate-x-1 cursor-pointer"
                onClick={() => navigate('/app/executive-room')}
              >
                <div style={{ fontSize: 11.5, color: t.textSub, width: 62, flexShrink: 0, fontFamily: "'Inter', sans-serif" }}>
                  {m.day}<br />{m.time}
                </div>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: "'Manrope', sans-serif" }}>
                  {m.who}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>{m.title}</div>
                  <div style={{ fontSize: 11.5, color: t.textSub, fontFamily: "'Inter', sans-serif" }}>{m.note}</div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Card 7: Tasks Card (Dark Card) */}
        <BentoCard dark style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Manrope', sans-serif" }}>Priority actions</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent, fontFamily: "'Manrope', sans-serif" }}>
              {doneCount}/{priorityActions.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            {priorityActions.map((a) => {
              const ActionIcon = a.icon;
              return (
                <div
                  key={a.title}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', transition: 'transform 0.15s ease' }}
                  className="hover:translate-x-1 cursor-pointer"
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ActionIcon size={13} color={t.darkText} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}>{a.meta}</div>
                  </div>
                  {a.done ? <CircleCheck size={17} color={t.accent} /> : <Circle size={17} color="rgba(255,255,255,0.25)" />}
                </div>
              );
            })}
          </div>
        </BentoCard>
      </div>

      {/* Row 1: Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueProfitChart />
        <PermissionGate permission="cashflow.view">
          <CashFlowChart />
        </PermissionGate>
      </div>

      {/* Row 2: Secondary Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PermissionGate permission="sales.view">
          <SalesPerformanceChart />
        </PermissionGate>
        <PermissionGate permission="customers.view">
          <CustomerRetentionChart />
        </PermissionGate>
      </div>

      {/* Recent Orders Table (70%) & Low Stock Alerts (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <LowStockAlertsPanel />
        </div>
      </div>

      {/* Executive Room Collaboration Boardroom */}
      <PermissionGate permission="ai.executive_room.view">
        <ExecutiveRoomPreview />
      </PermissionGate>

      {/* Priority Actions & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PriorityActionPanel />
        <InsightPanel />
      </div>

      {/* Alerts & Intelligence Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertCenter />
        <IntelligenceTimeline />
      </div>
    </div>
  );
};
