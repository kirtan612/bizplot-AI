import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface OrderItem {
  id: string;
  orderNumber: string;
  customer: string;
  amount: string;
  status: 'draft' | 'confirmed' | 'delivered';
  date: string;
}

const MOCK_RECENT_ORDERS: OrderItem[] = [
  { id: '1', orderNumber: 'ORD-2026-0005', customer: 'Gandhinagar Pipes', amount: '₹59,000', status: 'draft', date: '30 Jul 2026' },
  { id: '2', orderNumber: 'ORD-2026-0004', customer: 'Vadodara Construction', amount: '₹61,360', status: 'confirmed', date: '24 Jul 2026' },
  { id: '3', orderNumber: 'ORD-2026-0003', customer: 'Rajkot Traders', amount: '₹1,00,450', status: 'confirmed', date: '12 Jul 2026' },
  { id: '4', orderNumber: 'ORD-2025-0002', customer: 'Rajesh Patel & Sons', amount: '₹8,968', status: 'delivered', date: '12 Jul 2026' },
  { id: '5', orderNumber: 'ORD-2025-0001', customer: 'Ahmedabad Steel Infra', amount: '₹58,410', status: 'confirmed', date: '08 Jul 2026' },
];

export const RecentOrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const { tokens: t } = useTheme();

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'draft':
        return <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: t.textSub, background: t.accentSoft, border: `1px solid ${t.border}` }}>draft</span>;
      case 'confirmed':
        return <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: t.ok, background: t.accentSoft }}>confirmed</span>;
      case 'delivered':
        return <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: t.accent, background: t.accentSoft }}>delivered</span>;
    }
  };

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 28,
        padding: 22,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:-translate-y-1 hover:shadow-lg"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, fontFamily: "'Manrope', sans-serif" }}>
          Recent Orders
        </h3>
        <button
          onClick={() => navigate('/app/sales')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            fontSize: 12.5,
            color: t.accent,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          className="hover:translate-x-1"
        >
          <span>View All Orders</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}`, color: t.textFaint }}>
              <th className="pb-2.5 font-semibold">Order Number</th>
              <th className="pb-2.5 font-semibold">Customer</th>
              <th className="pb-2.5 font-semibold">Amount</th>
              <th className="pb-2.5 font-semibold">Status</th>
              <th className="pb-2.5 font-semibold">Date</th>
              <th className="pb-2.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RECENT_ORDERS.map((order) => (
              <tr key={order.id} style={{ borderBottom: `1px solid ${t.border}` }} className="hover:bg-purple-500/5 transition-colors">
                <td className="py-3 font-mono font-semibold" style={{ color: t.accent }}>{order.orderNumber}</td>
                <td className="py-3 font-medium" style={{ color: t.text }}>{order.customer}</td>
                <td className="py-3 font-semibold font-mono" style={{ color: t.text }}>{order.amount}</td>
                <td className="py-3">{getStatusBadge(order.status)}</td>
                <td className="py-3 font-mono text-[11px]" style={{ color: t.textSub }}>{order.date}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => navigate('/app/sales')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: t.textSub,
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
